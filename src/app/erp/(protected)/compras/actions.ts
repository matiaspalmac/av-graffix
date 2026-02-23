"use server";

import { revalidatePath } from "next/cache";
import { desc, eq, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db/client";
import {
  inventoryTransactions,
  materials,
  purchaseOrderItems,
  purchaseOrders,
  suppliers,
} from "@/db/schema";

function asNumber(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function purchaseOrderNumber() {
  const stamp = Date.now().toString().slice(-6);
  return `OC-${new Date().getFullYear()}-${stamp}`;
}

async function currentStock(materialId: number) {
  const result = await db
    .select({ stock: sql<number>`coalesce(sum(${inventoryTransactions.qtyIn} - ${inventoryTransactions.qtyOut}),0)` })
    .from(inventoryTransactions)
    .where(eq(inventoryTransactions.materialId, materialId));

  return Number(result[0]?.stock ?? 0);
}

async function recalcPurchaseOrderTotals(purchaseOrderId: number) {
  const result = await db
    .select({
      subtotal: sql<number>`coalesce(sum(${purchaseOrderItems.qty} * ${purchaseOrderItems.unitPriceClp} - ${purchaseOrderItems.lineDiscountClp}),0)`,
      tax: sql<number>`coalesce(sum(${purchaseOrderItems.lineTaxClp}),0)`,
    })
    .from(purchaseOrderItems)
    .where(eq(purchaseOrderItems.purchaseOrderId, purchaseOrderId));

  const subtotal = Number(result[0]?.subtotal ?? 0);
  const tax = Number(result[0]?.tax ?? 0);

  const orderRow = await db
    .select({ discountClp: purchaseOrders.discountClp, shippingClp: purchaseOrders.shippingClp })
    .from(purchaseOrders)
    .where(eq(purchaseOrders.id, purchaseOrderId))
    .limit(1);

  const discount = Number(orderRow[0]?.discountClp ?? 0);
  const shipping = Number(orderRow[0]?.shippingClp ?? 0);
  const total = subtotal + tax + shipping - discount;

  await db
    .update(purchaseOrders)
    .set({ subtotalClp: subtotal, taxClp: tax, totalClp: total, updatedAt: new Date().toISOString() })
    .where(eq(purchaseOrders.id, purchaseOrderId));
}

export async function createSupplierAction(formData: FormData) {
  const legalName = String(formData.get("legalName") ?? "").trim();
  const tradeName = String(formData.get("tradeName") ?? "").trim();
  const rut = String(formData.get("rut") ?? "").trim();

  if (!legalName || !tradeName || !rut) {
    return;
  }

  await db.insert(suppliers).values({
    legalName,
    tradeName,
    rut,
    contactName: String(formData.get("contactName") ?? "").trim() || null,
    contactEmail: String(formData.get("contactEmail") ?? "").trim().toLowerCase() || null,
    contactPhone: String(formData.get("contactPhone") ?? "").trim() || null,
    leadTimeDays: asNumber(formData.get("leadTimeDays"), 5),
    paymentTermsDays: asNumber(formData.get("paymentTermsDays"), 30),
    currencyPreference: "CLP",
    updatedAt: new Date().toISOString(),
  });

  revalidatePath("/erp/compras");
  revalidatePath("/erp/inventario");
}

export async function createPurchaseOrderAction(formData: FormData) {
  const session = await auth();
  const supplierId = asNumber(formData.get("supplierId"));

  if (!supplierId) {
    return;
  }

  const issueDate = new Date().toISOString();

  await db.insert(purchaseOrders).values({
    poNumber: purchaseOrderNumber(),
    supplierId,
    requesterUserId: Number(session?.user?.id || 0) || null,
    issueDate,
    expectedDate: String(formData.get("expectedDate") ?? "").trim() || null,
    status: String(formData.get("status") ?? "draft").trim() || "draft",
    subtotalClp: 0,
    discountClp: asNumber(formData.get("discountClp"), 0),
    taxClp: 0,
    shippingClp: asNumber(formData.get("shippingClp"), 0),
    totalClp: 0,
    paymentTermsDays: asNumber(formData.get("paymentTermsDays"), 30),
    notes: String(formData.get("notes") ?? "").trim() || null,
    updatedAt: issueDate,
  });

  revalidatePath("/erp/compras");
}

export async function addPurchaseOrderItemAction(formData: FormData) {
  const purchaseOrderId = asNumber(formData.get("purchaseOrderId"));
  const materialId = asNumber(formData.get("materialId"));
  const qty = asNumber(formData.get("qty"));
  const unitPriceClp = asNumber(formData.get("unitPriceClp"));

  if (!purchaseOrderId || !materialId || qty <= 0 || unitPriceClp < 0) {
    return;
  }

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(purchaseOrderItems)
    .where(eq(purchaseOrderItems.purchaseOrderId, purchaseOrderId));

  const lineNo = Number(countResult[0]?.count ?? 0) + 1;
  const base = qty * unitPriceClp;
  const discount = asNumber(formData.get("lineDiscountClp"), 0);
  const taxable = Math.max(base - discount, 0);
  const lineTax = Math.round(taxable * 0.19);
  const lineTotal = taxable + lineTax;

  const material = await db
    .select({ name: materials.name, baseUnit: materials.baseUnit })
    .from(materials)
    .where(eq(materials.id, materialId))
    .limit(1);

  await db.insert(purchaseOrderItems).values({
    purchaseOrderId,
    lineNo,
    materialId,
    variantId: null,
    description: String(formData.get("description") ?? "").trim() || material[0]?.name || null,
    qty,
    unit: String(formData.get("unit") ?? material[0]?.baseUnit ?? "unit").trim() || "unit",
    unitPriceClp,
    lineDiscountClp: discount,
    lineTaxClp: lineTax,
    lineTotalClp: lineTotal,
    expectedDate: String(formData.get("expectedDate") ?? "").trim() || null,
    receivedQty: 0,
    updatedAt: new Date().toISOString(),
  });

  await recalcPurchaseOrderTotals(purchaseOrderId);
  revalidatePath("/erp/compras");
}

export async function updatePurchaseOrderStatusAction(formData: FormData) {
  const purchaseOrderId = asNumber(formData.get("purchaseOrderId"));
  const status = String(formData.get("status") ?? "draft").trim();

  if (!purchaseOrderId || !status) {
    return;
  }

  await db
    .update(purchaseOrders)
    .set({ status, updatedAt: new Date().toISOString() })
    .where(eq(purchaseOrders.id, purchaseOrderId));

  revalidatePath("/erp/compras");
}

export async function receivePurchaseOrderItemAction(formData: FormData) {
  const session = await auth();
  const poItemId = asNumber(formData.get("poItemId"));
  const receivedNow = asNumber(formData.get("receivedNow"));

  if (!poItemId || receivedNow <= 0) {
    return;
  }

  const itemRows = await db
    .select({
      id: purchaseOrderItems.id,
      purchaseOrderId: purchaseOrderItems.purchaseOrderId,
      materialId: purchaseOrderItems.materialId,
      qty: purchaseOrderItems.qty,
      receivedQty: purchaseOrderItems.receivedQty,
      unitPriceClp: purchaseOrderItems.unitPriceClp,
    })
    .from(purchaseOrderItems)
    .where(eq(purchaseOrderItems.id, poItemId))
    .limit(1);

  const item = itemRows[0];
  if (!item) {
    return;
  }

  const pending = Math.max(Number(item.qty) - Number(item.receivedQty), 0);
  const qtyAccepted = Math.min(receivedNow, pending);

  if (qtyAccepted <= 0) {
    return;
  }

  const nextReceivedQty = Number(item.receivedQty) + qtyAccepted;

  await db
    .update(purchaseOrderItems)
    .set({ receivedQty: nextReceivedQty, updatedAt: new Date().toISOString() })
    .where(eq(purchaseOrderItems.id, poItemId));

  const stockBefore = await currentStock(item.materialId);
  const stockAfter = stockBefore + qtyAccepted;
  const unitCostClp = asNumber(formData.get("unitCostClp"), Number(item.unitPriceClp));

  await db.insert(inventoryTransactions).values({
    materialId: item.materialId,
    variantId: null,
    warehouse: String(formData.get("warehouse") ?? "principal").trim() || "principal",
    txnType: "purchase_receipt",
    referenceType: "purchase_order",
    referenceId: item.purchaseOrderId,
    qtyIn: qtyAccepted,
    qtyOut: 0,
    unitCostClp,
    totalCostClp: qtyAccepted * unitCostClp,
    stockAfter,
    txnDate: new Date().toISOString(),
    batchLot: String(formData.get("batchLot") ?? "").trim() || null,
    createdByUserId: Number(session?.user?.id || 0) || null,
  });

  const agg = await db
    .select({
      ordered: sql<number>`coalesce(sum(${purchaseOrderItems.qty}),0)`,
      received: sql<number>`coalesce(sum(${purchaseOrderItems.receivedQty}),0)`,
    })
    .from(purchaseOrderItems)
    .where(eq(purchaseOrderItems.purchaseOrderId, item.purchaseOrderId));

  const ordered = Number(agg[0]?.ordered ?? 0);
  const received = Number(agg[0]?.received ?? 0);

  const status = received >= ordered ? "received" : "partial";

  await db
    .update(purchaseOrders)
    .set({ status, updatedAt: new Date().toISOString() })
    .where(eq(purchaseOrders.id, item.purchaseOrderId));

  revalidatePath("/erp/compras");
  revalidatePath("/erp/inventario");
}

export async function deletePurchaseOrderAction(formData: FormData) {
  const purchaseOrderId = asNumber(formData.get("purchaseOrderId"));

  if (!purchaseOrderId) {
    return;
  }

  await db.delete(purchaseOrderItems).where(eq(purchaseOrderItems.purchaseOrderId, purchaseOrderId));
  await db.delete(purchaseOrders).where(eq(purchaseOrders.id, purchaseOrderId));

  revalidatePath("/erp/compras");
}

export async function deletePurchaseOrderItemAction(formData: FormData) {
  const poItemId = asNumber(formData.get("poItemId"));
  const purchaseOrderId = asNumber(formData.get("purchaseOrderId"));

  if (!poItemId || !purchaseOrderId) {
    return;
  }

  await db.delete(purchaseOrderItems).where(eq(purchaseOrderItems.id, poItemId));
  await recalcPurchaseOrderTotals(purchaseOrderId);
  revalidatePath("/erp/compras");
}

export async function purchaseFormOptions() {
  const [supplierOptions, materialOptions] = await Promise.all([
    db
      .select({ id: suppliers.id, tradeName: suppliers.tradeName })
      .from(suppliers)
      .where(eq(suppliers.isActive, true))
      .orderBy(desc(suppliers.id)),
    db
      .select({ id: materials.id, name: materials.name, unit: materials.baseUnit })
      .from(materials)
      .where(eq(materials.isActive, true))
      .orderBy(desc(materials.id)),
  ]);

  return { supplierOptions, materialOptions };
}

export async function latestPurchaseOrdersWithItems(limit = 16) {
  const orders = await db
    .select({
      id: purchaseOrders.id,
      poNumber: purchaseOrders.poNumber,
      issueDate: purchaseOrders.issueDate,
      expectedDate: purchaseOrders.expectedDate,
      status: purchaseOrders.status,
      subtotalClp: purchaseOrders.subtotalClp,
      taxClp: purchaseOrders.taxClp,
      totalClp: purchaseOrders.totalClp,
      supplierName: suppliers.tradeName,
    })
    .from(purchaseOrders)
    .leftJoin(suppliers, eq(purchaseOrders.supplierId, suppliers.id))
    .orderBy(desc(purchaseOrders.id))
    .limit(limit);

  if (orders.length === 0) {
    return [];
  }

  const orderIds = orders.map((order) => order.id);

  const items = await db
    .select({
      id: purchaseOrderItems.id,
      purchaseOrderId: purchaseOrderItems.purchaseOrderId,
      lineNo: purchaseOrderItems.lineNo,
      materialName: materials.name,
      qty: purchaseOrderItems.qty,
      receivedQty: purchaseOrderItems.receivedQty,
      unit: purchaseOrderItems.unit,
      unitPriceClp: purchaseOrderItems.unitPriceClp,
      lineTotalClp: purchaseOrderItems.lineTotalClp,
    })
    .from(purchaseOrderItems)
    .leftJoin(materials, eq(purchaseOrderItems.materialId, materials.id))
    .where(sql`${purchaseOrderItems.purchaseOrderId} in (${sql.join(orderIds.map((id) => sql`${id}`), sql`,`)})`)
    .orderBy(desc(purchaseOrderItems.id));

  return orders.map((order) => ({
    ...order,
    items: items.filter((item) => item.purchaseOrderId === order.id),
  }));
}
