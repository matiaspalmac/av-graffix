"use server";

import { revalidatePath } from "next/cache";
import { asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import {
  inventoryTransactions,
  materialConsumptions,
  materials,
  projectBriefs,
  projectPhases,
  projects,
  supplierMaterialPrices,
} from "@/db/schema";
import { requireRole, toErrorMessage } from "@/lib/server-action";

function asNumber(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function createConsumptionAction(formData: FormData) {
  try {
    const session = await requireRole(["admin", "finanzas"]);

    const projectId = asNumber(formData.get("projectId"));
    const materialId = asNumber(formData.get("materialId"));
    const qtyUsed = asNumber(formData.get("qtyUsed"));
    const wastePct = asNumber(formData.get("wastePct"), 0);

    if (!projectId || !materialId || qtyUsed <= 0) {
      return;
    }

    const wasteQty = qtyUsed * (wastePct / 100);
    const totalQtyOut = qtyUsed + wasteQty;

    const cheapestPrice = await db
      .select({ price: supplierMaterialPrices.priceClp })
      .from(supplierMaterialPrices)
      .where(eq(supplierMaterialPrices.materialId, materialId))
      .orderBy(asc(supplierMaterialPrices.priceClp))
      .limit(1);

    const unitCostClp = Number(cheapestPrice[0]?.price ?? 0);
    const totalCostClp = totalQtyOut * unitCostClp;
    const now = new Date().toISOString();

    const inserted = await db
      .insert(materialConsumptions)
      .values({
        projectId,
        materialId,
        qtyPlanned: asNumber(formData.get("qtyPlanned"), qtyUsed),
        qtyUsed,
        wasteQty,
        wastePct,
        unitCostClp,
        totalCostClp,
        consumptionDate: now,
        operatorUserId: Number(session.user.id || 0) || null,
        notes: String(formData.get("notes") ?? "").trim() || null,
        updatedAt: now,
      })
      .returning({ id: materialConsumptions.id });

    const stockResult = await db
      .select({
        stock: sql<number>`coalesce(sum(${inventoryTransactions.qtyIn} - ${inventoryTransactions.qtyOut}),0)`,
      })
      .from(inventoryTransactions)
      .where(eq(inventoryTransactions.materialId, materialId));

    const currentStock = Number(stockResult[0]?.stock ?? 0);
    const stockAfter = currentStock - totalQtyOut;

    await db.insert(inventoryTransactions).values({
      materialId,
      warehouse: "principal",
      txnType: "consumption",
      referenceType: "material_consumption",
      referenceId: inserted[0]?.id ?? null,
      qtyIn: 0,
      qtyOut: totalQtyOut,
      unitCostClp,
      totalCostClp,
      stockAfter,
      txnDate: now,
      createdByUserId: Number(session.user.id || 0) || null,
    });

    revalidatePath("/erp/produccion");
    revalidatePath("/erp/reportes");
    revalidatePath("/erp");
  } catch (error) {
    console.error("createConsumptionAction", toErrorMessage(error));
  }
}

export async function deleteConsumptionAction(formData: FormData) {
  try {
    await requireRole(["admin", "finanzas"]);

    const id = asNumber(formData.get("consumptionId"));
    if (!id) {
      return;
    }

    await db
      .delete(inventoryTransactions)
      .where(
        sql`${inventoryTransactions.referenceType} = 'material_consumption' and ${inventoryTransactions.referenceId} = ${id}`
      );

    await db.delete(materialConsumptions).where(eq(materialConsumptions.id, id));

    revalidatePath("/erp/produccion");
    revalidatePath("/erp/reportes");
  } catch (error) {
    console.error("deleteConsumptionAction", toErrorMessage(error));
  }
}

export async function updateProjectStatusAction(formData: FormData) {
  try {
    await requireRole(["admin", "finanzas"]);

    const projectId = asNumber(formData.get("projectId"));
    const status = String(formData.get("status") ?? "in_progress").trim();

    if (!projectId) {
      return;
    }

    await db
      .update(projects)
      .set({ status, updatedAt: new Date().toISOString() })
      .where(eq(projects.id, projectId));

    revalidatePath("/erp/produccion");
  } catch (error) {
    console.error("updateProjectStatusAction", toErrorMessage(error));
  }
}

export async function approveProjectPhaseAction(formData: FormData) {
  try {
    await requireRole(["admin", "finanzas"]);

    const phaseId = asNumber(formData.get("phaseId"));
    if (!phaseId) {
      return;
    }

    await db
      .update(projectPhases)
      .set({
        status: "completed",
        progressPct: 100,
        actualEnd: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(projectPhases.id, phaseId));

    revalidatePath("/erp/proyectos");
    revalidatePath("/erp/produccion");
  } catch (error) {
    console.error("approveProjectPhaseAction", toErrorMessage(error));
  }
}

export async function productionOptions() {
  const [projectOptions, materialOptions] = await Promise.all([
    db
      .select({ 
        id: projects.id, 
        name: projects.name, 
        status: projects.status,
      })
      .from(projects)
      .leftJoin(projectBriefs, eq(projects.id, projectBriefs.projectId))
      .where(sql`${projects.status} in ('planning','in_progress')`)
      .orderBy(desc(projects.id)),
    db
      .select({ id: materials.id, name: materials.name, unit: materials.baseUnit })
      .from(materials)
      .where(eq(materials.isActive, true))
      .orderBy(desc(materials.id)),
  ]);

  return { projectOptions, materialOptions };
}

export async function latestConsumptions(limit = 15) {
  return db
    .select({
      id: materialConsumptions.id,
      consumptionDate: materialConsumptions.consumptionDate,
      projectName: projects.name,
      materialName: materials.name,
      qtyUsed: materialConsumptions.qtyUsed,
      wastePct: materialConsumptions.wastePct,
      totalCostClp: materialConsumptions.totalCostClp,
    })
    .from(materialConsumptions)
    .leftJoin(projects, eq(materialConsumptions.projectId, projects.id))
    .leftJoin(materials, eq(materialConsumptions.materialId, materials.id))
    .orderBy(desc(materialConsumptions.id))
    .limit(limit);
}
