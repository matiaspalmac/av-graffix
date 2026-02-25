"use server";

import { revalidatePath } from "next/cache";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import {
  inventoryTransactions,
  materialConsumptions,
  materialVariants,
  materials,
  purchaseOrderItems,
  supplierMaterialPrices,
  suppliers,
} from "@/db/schema";
import { requireRole, toErrorMessage } from "@/lib/server-action";

function asNumber(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
}

async function getCurrentStock(materialId: number) {
  const result = await db
    .select({
      stock: sql<number>`coalesce(sum(${inventoryTransactions.qtyIn} - ${inventoryTransactions.qtyOut}),0)`,
    })
    .from(inventoryTransactions)
    .where(eq(inventoryTransactions.materialId, materialId));

  return Number(result[0]?.stock ?? 0);
}

export async function createMaterialAction(formData: FormData) {
  try {
    await requireRole(["admin", "produccion"]);

    const sku = String(formData.get("sku") ?? "").trim().toUpperCase();
    const name = String(formData.get("name") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();

    if (!sku || !name || !category) {
      return;
    }

    await db.insert(materials).values({
      sku,
      name,
      category,
      baseUnit: String(formData.get("baseUnit") ?? "unit").trim() || "unit",
      brand: String(formData.get("brand") ?? "").trim() || null,
      model: String(formData.get("model") ?? "").trim() || null,
      color: String(formData.get("color") ?? "").trim() || null,
      defaultWastePct: asNumber(formData.get("defaultWastePct"), 5),
      reorderPoint: asNumber(formData.get("reorderPoint"), 0),
      updatedAt: new Date().toISOString(),
    });

    revalidatePath("/erp/inventario");
  } catch (error) {
    console.error("createMaterialAction", toErrorMessage(error));
  }
}

export async function toggleMaterialActiveAction(formData: FormData) {
  try {
    await requireRole(["admin", "produccion"]);

    const materialId = asNumber(formData.get("materialId"));
    const isActive = String(formData.get("isActive") ?? "1") === "1";

    if (!materialId) {
      return;
    }

    await db
      .update(materials)
      .set({ isActive: !isActive, updatedAt: new Date().toISOString() })
      .where(eq(materials.id, materialId));

    revalidatePath("/erp/inventario");
  } catch (error) {
    console.error("toggleMaterialActiveAction", toErrorMessage(error));
  }
}

export async function deleteMaterialAction(formData: FormData) {
  try {
    await requireRole(["admin", "produccion"]);

    const materialId = asNumber(formData.get("materialId"));
    if (!materialId) {
      return { success: false, error: "Material inválido" };
    }

    const [inventoryUsage, consumptionUsage, purchaseUsage] = await Promise.all([
      db
        .select({ v: sql<number>`count(*)` })
        .from(inventoryTransactions)
        .where(eq(inventoryTransactions.materialId, materialId)),
      db
        .select({ v: sql<number>`count(*)` })
        .from(materialConsumptions)
        .where(eq(materialConsumptions.materialId, materialId)),
      db
        .select({ v: sql<number>`count(*)` })
        .from(purchaseOrderItems)
        .where(eq(purchaseOrderItems.materialId, materialId)),
    ]);

    const hasUsage =
      Number(inventoryUsage[0]?.v ?? 0) > 0 ||
      Number(consumptionUsage[0]?.v ?? 0) > 0 ||
      Number(purchaseUsage[0]?.v ?? 0) > 0;

    if (hasUsage) {
      return {
        success: false,
        error: "No se puede eliminar: el material tiene movimientos, consumos o compras asociadas.",
      };
    }

    await db.delete(supplierMaterialPrices).where(eq(supplierMaterialPrices.materialId, materialId));
    await db.delete(materialVariants).where(eq(materialVariants.materialId, materialId));
    await db.delete(materials).where(eq(materials.id, materialId));

    revalidatePath("/erp/inventario");
    revalidatePath("/erp/compras");
    revalidatePath("/erp/produccion");

    return { success: true, message: "Material eliminado correctamente" };
  } catch (error) {
    const errorMessage = toErrorMessage(error);
    console.error("deleteMaterialAction", errorMessage);
    return { success: false, error: errorMessage };
  }
}

export async function registerInventoryMoveAction(formData: FormData) {
  try {
    const session = await requireRole(["admin", "produccion"]);

    const materialId = asNumber(formData.get("materialId"));
    const moveType = String(formData.get("moveType") ?? "in").trim();
    const qty = asNumber(formData.get("qty"), 0);
    const unitCostClp = asNumber(formData.get("unitCostClp"), 0);

    if (!materialId || qty <= 0) {
      return;
    }

    const stockBefore = await getCurrentStock(materialId);

    if (moveType === "out" && qty > stockBefore) {
      return;
    }

    const qtyIn = moveType === "in" ? qty : 0;
    const qtyOut = moveType === "out" ? qty : 0;
    const stockAfter = stockBefore + qtyIn - qtyOut;
    const totalCostClp = qty * unitCostClp;

    await db.insert(inventoryTransactions).values({
      materialId,
      warehouse: String(formData.get("warehouse") ?? "principal").trim() || "principal",
      txnType: moveType === "in" ? "adjust_in" : "adjust_out",
      referenceType: "manual",
      referenceId: null,
      qtyIn,
      qtyOut,
      unitCostClp,
      totalCostClp,
      stockAfter,
      txnDate: new Date().toISOString(),
      batchLot: String(formData.get("batchLot") ?? "").trim() || null,
      createdByUserId: Number(session.user.id || 0) || null,
    });

    revalidatePath("/erp/inventario");
  } catch (error) {
    console.error("registerInventoryMoveAction", toErrorMessage(error));
  }
}

export async function createMaterialPriceAction(formData: FormData) {
  try {
    await requireRole(["admin", "produccion"]);

    const supplierId = asNumber(formData.get("supplierId"));
    const materialId = asNumber(formData.get("materialId"));
    const priceClp = asNumber(formData.get("priceClp"));

    if (!supplierId || !materialId || priceClp <= 0) {
      return;
    }

    await db
      .update(supplierMaterialPrices)
      .set({ isCurrent: false, updatedAt: new Date().toISOString() })
      .where(eq(supplierMaterialPrices.materialId, materialId));

    await db.insert(supplierMaterialPrices).values({
      supplierId,
      materialId,
      variantId: null,
      priceClp,
      priceUnit: String(formData.get("priceUnit") ?? "unit").trim() || "unit",
      minOrderQty: asNumber(formData.get("minOrderQty"), 1),
      leadTimeDays: asNumber(formData.get("leadTimeDays"), 5),
      validFrom: new Date().toISOString(),
      validTo: String(formData.get("validTo") ?? "").trim() || null,
      incoterm: String(formData.get("incoterm") ?? "").trim() || null,
      freightClp: asNumber(formData.get("freightClp"), 0),
      isCurrent: true,
      sourceDocRef: String(formData.get("sourceDocRef") ?? "").trim() || null,
      updatedAt: new Date().toISOString(),
    });

    revalidatePath("/erp/inventario");
  } catch (error) {
    console.error("createMaterialPriceAction", toErrorMessage(error));
  }
}

export async function inventoryFormOptions() {
  const [materialOptions, supplierOptions] = await Promise.all([
    db
      .select({ id: materials.id, name: materials.name, sku: materials.sku, baseUnit: materials.baseUnit })
      .from(materials)
      .where(eq(materials.isActive, true))
      .orderBy(desc(materials.id)),
    db
      .select({ id: suppliers.id, tradeName: suppliers.tradeName })
      .from(suppliers)
      .where(eq(suppliers.isActive, true))
      .orderBy(desc(suppliers.id)),
  ]);

  return { materialOptions, supplierOptions };
}

export async function latestMaterialsWithStock(limit = 20) {
  return db
    .select({
      id: materials.id,
      sku: materials.sku,
      name: materials.name,
      category: materials.category,
      baseUnit: materials.baseUnit,
      reorderPoint: materials.reorderPoint,
      isActive: materials.isActive,
      stock: sql<number>`coalesce((select sum(${inventoryTransactions.qtyIn} - ${inventoryTransactions.qtyOut}) from ${inventoryTransactions} where ${inventoryTransactions.materialId} = ${materials.id}),0)`,
      currentPriceClp: sql<number>`coalesce((select ${supplierMaterialPrices.priceClp} from ${supplierMaterialPrices} where ${supplierMaterialPrices.materialId} = ${materials.id} and ${supplierMaterialPrices.isCurrent} = 1 order by ${supplierMaterialPrices.validFrom} desc limit 1),0)`,
    })
    .from(materials)
    .orderBy(desc(materials.id))
    .limit(limit);
}

export async function latestInventoryMovements(limit = 20) {
  return db
    .select({
      id: inventoryTransactions.id,
      txnDate: inventoryTransactions.txnDate,
      materialName: materials.name,
      txnType: inventoryTransactions.txnType,
      qtyIn: inventoryTransactions.qtyIn,
      qtyOut: inventoryTransactions.qtyOut,
      unitCostClp: inventoryTransactions.unitCostClp,
      totalCostClp: inventoryTransactions.totalCostClp,
      stockAfter: inventoryTransactions.stockAfter,
      warehouse: inventoryTransactions.warehouse,
    })
    .from(inventoryTransactions)
    .leftJoin(materials, eq(inventoryTransactions.materialId, materials.id))
    .orderBy(desc(inventoryTransactions.id))
    .limit(limit);
}
