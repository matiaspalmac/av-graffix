"use server";

import { revalidatePath } from "next/cache";
import { asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { clients, quoteItems, quotes, users } from "@/db/schema";
import { requireRole, toErrorMessage } from "@/lib/server-action";
import { exportQuotesToExcel } from "@/lib/export-utils";

function asNumber(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function asText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function allQuotesWithDetails(limit = 50) {
  const quotesData = await db
    .select({
      id: quotes.id,
      quoteNumber: quotes.quoteNumber,
      clientId: quotes.clientId,
      clientName: clients.tradeName,
      issueDate: quotes.issueDate,
      validUntil: quotes.validUntil,
      currencyCode: quotes.currencyCode,
      subtotalClp: quotes.subtotalClp,
      discountClp: quotes.discountClp,
      taxClp: quotes.taxClp,
      totalClp: quotes.totalClp,
      status: quotes.status,
      termsText: quotes.termsText,
    })
    .from(quotes)
    .leftJoin(clients, eq(quotes.clientId, clients.id))
    .orderBy(desc(quotes.id))
    .limit(limit);

  const quoteIds = quotesData.map((q) => q.id);

  if (quoteIds.length === 0) {
    return [];
  }

  const allItems = await db
    .select({
      id: quoteItems.id,
      quoteId: quoteItems.quoteId,
      lineNo: quoteItems.lineNo,
      itemType: quoteItems.itemType,
      serviceCategory: quoteItems.serviceCategory,
      description: quoteItems.description,
      qty: quoteItems.qty,
      unit: quoteItems.unit,
      unitPriceClp: quoteItems.unitPriceClp,
      hoursEstimated: quoteItems.hoursEstimated,
      materialEstimatedCostClp: quoteItems.materialEstimatedCostClp,
      lineTotalClp: quoteItems.lineTotalClp,
      specsJson: quoteItems.specsJson,
      dueDate: quoteItems.dueDate,
    })
    .from(quoteItems)
    .orderBy(asc(quoteItems.lineNo));

  return quotesData.map((quote) => ({
    ...quote,
    items: allItems.filter((item) => item.quoteId === quote.id),
  }));
}

export async function updateQuoteAction(formData: FormData) {
  try {
    await requireRole(["admin", "produccion"]);
    const quoteId = asNumber(formData.get("quoteId"));
    const status = asText(formData.get("status"));
    const termsText = asText(formData.get("termsText"));
    const validUntil = asText(formData.get("validUntil"));
    const discountClp = asNumber(formData.get("discountClp"), 0);

    if (!quoteId) {
      return;
    }

    await db
      .update(quotes)
      .set({
        status,
        termsText: termsText || null,
        validUntil: validUntil || quotes.validUntil,
        discountClp,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(quotes.id, quoteId));

    // Recalcular totales si cambió el descuento
    const quoteData = await db
      .select({
        subtotalClp: quotes.subtotalClp,
        discountClp: quotes.discountClp,
      })
      .from(quotes)
      .where(eq(quotes.id, quoteId))
      .limit(1);

    if (quoteData.length > 0) {
      const subtotal = Number(quoteData[0].subtotalClp);
      const discount = Number(quoteData[0].discountClp);
      const taxBase = subtotal - discount;
      const tax = Math.round(taxBase * 0.19);
      const total = taxBase + tax;

      await db
        .update(quotes)
        .set({
          taxClp: tax,
          totalClp: total,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(quotes.id, quoteId));
    }

    revalidatePath("/erp/cotizaciones");
    revalidatePath("/erp/ventas");
  } catch (error) {
    console.error("updateQuoteAction", toErrorMessage(error));
  }
}

export async function updateQuoteItemAction(formData: FormData) {
  try {
    await requireRole(["admin", "produccion"]);
    const itemId = asNumber(formData.get("itemId"));
    const description = asText(formData.get("description"));
    const serviceCategory = asText(formData.get("serviceCategory"));
    const qty = asNumber(formData.get("qty"), 1);
    const unitPriceClp = asNumber(formData.get("unitPriceClp"), 0);
    const hoursEstimated = asNumber(formData.get("hoursEstimated"), 0);
    const materialEstimatedCostClp = asNumber(formData.get("materialEstimatedCostClp"), 0);

    if (!itemId || !description || qty <= 0) {
      return;
    }

    const lineTotal = qty * unitPriceClp;

    await db
      .update(quoteItems)
      .set({
        description,
        serviceCategory,
        qty,
        unitPriceClp,
        hoursEstimated,
        materialEstimatedCostClp,
        lineTotalClp: lineTotal,
      })
      .where(eq(quoteItems.id, itemId));

    // Obtener quoteId para recalcular totales
    const item = await db
      .select({ quoteId: quoteItems.quoteId })
      .from(quoteItems)
      .where(eq(quoteItems.id, itemId))
      .limit(1);

    if (item.length > 0) {
      await recalcQuoteTotals(item[0].quoteId);
    }

    revalidatePath("/erp/cotizaciones");
    revalidatePath("/erp/ventas");
  } catch (error) {
    console.error("updateQuoteItemAction", toErrorMessage(error));
  }
}

async function recalcQuoteTotals(quoteId: number) {
  const items = await db
    .select({ lineTotalClp: quoteItems.lineTotalClp })
    .from(quoteItems)
    .where(eq(quoteItems.quoteId, quoteId));

  const subtotal = items.reduce((sum, item) => sum + Number(item.lineTotalClp), 0);

  const quoteData = await db
    .select({ discountClp: quotes.discountClp })
    .from(quotes)
    .where(eq(quotes.id, quoteId))
    .limit(1);

  const discount = Number(quoteData[0]?.discountClp ?? 0);
  const taxBase = subtotal - discount;
  const tax = Math.round(taxBase * 0.19);
  const total = taxBase + tax;

  await db
    .update(quotes)
    .set({
      subtotalClp: subtotal,
      taxClp: tax,
      totalClp: total,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(quotes.id, quoteId));
}

export async function exportQuotesExcelAction() {
  try {
    await requireRole(["admin", "produccion"]);

    const quotesData = await db
      .select({
        quoteNumber: quotes.quoteNumber,
        client: {
          tradeName: clients.tradeName,
          rut: clients.rut,
        },
        issueDate: quotes.issueDate,
        validUntil: quotes.validUntil,
        subtotalClp: quotes.subtotalClp,
        taxClp: quotes.taxClp,
        totalClp: quotes.totalClp,
        status: quotes.status,
        salesUser: {
          fullName: users.fullName,
        },
      })
      .from(quotes)
      .leftJoin(clients, eq(quotes.clientId, clients.id))
      .leftJoin(users, eq(quotes.salesUserId, users.id))
      .orderBy(desc(quotes.id))
      .limit(500);

    const buffer = await exportQuotesToExcel(quotesData);
    
    return {
      success: true,
      data: Buffer.from(buffer).toString("base64"),
      filename: `cotizaciones_${new Date().toISOString().split("T")[0]}.xlsx`,
    };
  } catch (error) {
    console.error("exportQuotesExcelAction", toErrorMessage(error));
    return {
      success: false,
      error: toErrorMessage(error),
    };
  }
}

export async function deleteQuoteAction(formData: FormData) {
  try {
    await requireRole(["admin", "produccion"]);

    const quoteId = asNumber(formData.get("quoteId"));

    if (!quoteId) {
      return;
    }

    // Eliminar items de la cotización primero
    await db.delete(quoteItems).where(eq(quoteItems.quoteId, quoteId));

    // Eliminar la cotización
    await db.delete(quotes).where(eq(quotes.id, quoteId));

    revalidatePath("/erp/cotizaciones");
    revalidatePath("/erp/ventas");
  } catch (error) {
    console.error("deleteQuoteAction", toErrorMessage(error));
    throw error;
  }
}
