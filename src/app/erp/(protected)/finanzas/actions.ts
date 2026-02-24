"use server";

import { revalidatePath } from "next/cache";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { clients, invoices, payments, projects, quotes, users } from "@/db/schema";
import { requireRole, toErrorMessage } from "@/lib/server-action";
import { exportInvoicesToExcel } from "@/lib/export-utils";

function asNumber(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function invoiceNumber() {
  const stamp = Date.now().toString().slice(-6);
  return `FCT-${new Date().getFullYear()}-${stamp}`;
}

function dueDateByDays(days: number) {
  const now = new Date();
  now.setDate(now.getDate() + Math.max(days, 0));
  return now.toISOString();
}

async function recalcInvoiceStatus(invoiceId: number) {
  const [invoiceRow, paymentsAgg] = await Promise.all([
    db
      .select({ totalClp: invoices.totalClp, dueDate: invoices.dueDate })
      .from(invoices)
      .where(eq(invoices.id, invoiceId))
      .limit(1),
    db
      .select({ collected: sql<number>`coalesce(sum(${payments.amountClp}),0)` })
      .from(payments)
      .where(eq(payments.invoiceId, invoiceId)),
  ]);

  const total = Number(invoiceRow[0]?.totalClp ?? 0);
  const collected = Number(paymentsAgg[0]?.collected ?? 0);
  const dueDate = invoiceRow[0]?.dueDate;

  let status = "issued";

  if (collected >= total && total > 0) {
    status = "paid";
  } else if (collected > 0) {
    status = "partial";
  } else if (dueDate && new Date(dueDate).getTime() < Date.now()) {
    status = "overdue";
  }

  await db
    .update(invoices)
    .set({ status, updatedAt: new Date().toISOString() })
    .where(eq(invoices.id, invoiceId));
}

export async function createInvoiceAction(formData: FormData) {
  try {
    const session = await requireRole(["admin", "finanzas"]);

    const clientId = asNumber(formData.get("clientId"));
    const subtotalClp = asNumber(formData.get("subtotalClp"));

    if (!clientId || subtotalClp <= 0) {
      return;
    }

    const taxClp = Math.round(subtotalClp * 0.19);
    const totalClp = subtotalClp + taxClp;
    const issueDate = new Date().toISOString();

    await db.insert(invoices).values({
      invoiceNumber: invoiceNumber(),
      siiFolio: String(formData.get("siiFolio") ?? "").trim() || null,
      clientId,
      projectId: asNumber(formData.get("projectId"), 0) || null,
      quoteId: asNumber(formData.get("quoteId"), 0) || null,
      issueDate,
      dueDate: String(formData.get("dueDate") ?? "").trim() || dueDateByDays(asNumber(formData.get("paymentTermsDays"), 30)),
      currencyCode: "CLP",
      subtotalClp,
      taxClp,
      totalClp,
      status: "issued",
      pdfUrl: null,
      createdByUserId: Number(session.user.id || 0) || null,
      updatedAt: issueDate,
    });

    revalidatePath("/erp/finanzas");
    revalidatePath("/erp/reportes");
  } catch (error) {
    console.error("createInvoiceAction", toErrorMessage(error));
  }
}

export async function registerPaymentAction(formData: FormData) {
  try {
    const session = await requireRole(["admin", "finanzas"]);
    const invoiceId = asNumber(formData.get("invoiceId"));
    const amountClp = asNumber(formData.get("amountClp"));

    if (!invoiceId || amountClp <= 0) {
      return;
    }

    await db.insert(payments).values({
      invoiceId,
      paymentDate: String(formData.get("paymentDate") ?? "").trim() || new Date().toISOString(),
      amountClp,
      method: String(formData.get("method") ?? "transfer").trim() || "transfer",
      bankReference: String(formData.get("bankReference") ?? "").trim() || null,
      status: "confirmed",
      exchangeRate: 1,
      feesClp: asNumber(formData.get("feesClp"), 0),
      collectedByUserId: Number(session.user.id || 0) || null,
      notes: String(formData.get("notes") ?? "").trim() || null,
      receiptUrl: null,
      updatedAt: new Date().toISOString(),
    });

    await recalcInvoiceStatus(invoiceId);

    revalidatePath("/erp/finanzas");
    revalidatePath("/erp/reportes");
  } catch (error) {
    console.error("registerPaymentAction", toErrorMessage(error));
  }
}

export async function updateInvoiceStatusAction(formData: FormData) {
  try {
    await requireRole(["admin", "finanzas"]);
    const invoiceId = asNumber(formData.get("invoiceId"));
    const status = String(formData.get("status") ?? "issued").trim();

    if (!invoiceId || !status) {
      return;
    }

    await db
      .update(invoices)
      .set({ status, updatedAt: new Date().toISOString() })
      .where(eq(invoices.id, invoiceId));

    revalidatePath("/erp/finanzas");
  } catch (error) {
    console.error("updateInvoiceStatusAction", toErrorMessage(error));
  }
}

export async function deletePaymentAction(formData: FormData) {
  try {
    await requireRole(["admin", "finanzas"]);
    const paymentId = asNumber(formData.get("paymentId"));
    const invoiceId = asNumber(formData.get("invoiceId"));

    if (!paymentId || !invoiceId) {
      return;
    }

    await db.delete(payments).where(eq(payments.id, paymentId));
    await recalcInvoiceStatus(invoiceId);
    revalidatePath("/erp/finanzas");
  } catch (error) {
    console.error("deletePaymentAction", toErrorMessage(error));
  }
}

export async function deleteInvoiceAction(formData: FormData) {
  try {
    await requireRole(["admin", "finanzas"]);
    const invoiceId = asNumber(formData.get("invoiceId"));

    if (!invoiceId) {
      return;
    }

    await db.delete(payments).where(eq(payments.invoiceId, invoiceId));
    await db.delete(invoices).where(eq(invoices.id, invoiceId));

    revalidatePath("/erp/finanzas");
  } catch (error) {
    console.error("deleteInvoiceAction", toErrorMessage(error));
  }
}

export async function financeFormOptions() {
  const [clientOptions, projectOptions, quoteOptions, invoiceOptions] = await Promise.all([
    db.select({ id: clients.id, tradeName: clients.tradeName, paymentTermsDays: clients.paymentTermsDays }).from(clients).orderBy(desc(clients.id)),
    db.select({ id: projects.id, name: projects.name }).from(projects).orderBy(desc(projects.id)),
    db.select({ id: quotes.id, quoteNumber: quotes.quoteNumber }).from(quotes).orderBy(desc(quotes.id)),
    db.select({ id: invoices.id, invoiceNumber: invoices.invoiceNumber, totalClp: invoices.totalClp }).from(invoices).orderBy(desc(invoices.id)),
  ]);

  return { clientOptions, projectOptions, quoteOptions, invoiceOptions };
}

export async function latestInvoicesWithPayments(limit = 20) {
  const invoiceRows = await db
    .select({
      id: invoices.id,
      invoiceNumber: invoices.invoiceNumber,
      issueDate: invoices.issueDate,
      dueDate: invoices.dueDate,
      status: invoices.status,
      subtotalClp: invoices.subtotalClp,
      taxClp: invoices.taxClp,
      totalClp: invoices.totalClp,
      clientName: clients.tradeName,
      projectName: projects.name,
    })
    .from(invoices)
    .leftJoin(clients, eq(invoices.clientId, clients.id))
    .leftJoin(projects, eq(invoices.projectId, projects.id))
    .orderBy(desc(invoices.id))
    .limit(limit);

  if (invoiceRows.length === 0) {
    return [];
  }

  const invoiceIds = invoiceRows.map((invoice) => invoice.id);

  const paymentRows = await db
    .select({
      id: payments.id,
      invoiceId: payments.invoiceId,
      paymentDate: payments.paymentDate,
      amountClp: payments.amountClp,
      method: payments.method,
      bankReference: payments.bankReference,
      feesClp: payments.feesClp,
    })
    .from(payments)
    .where(sql`${payments.invoiceId} in (${sql.join(invoiceIds.map((id) => sql`${id}`), sql`,`)})`)
    .orderBy(desc(payments.id));

  return invoiceRows.map((invoice) => {
    const invoicePayments = paymentRows.filter((payment) => payment.invoiceId === invoice.id);
    const paidClp = invoicePayments.reduce((sum, payment) => sum + Number(payment.amountClp), 0);

    return {
      ...invoice,
      paidClp,
      pendingClp: Number(invoice.totalClp) - paidClp,
      payments: invoicePayments,
    };
  });
}

export async function exportInvoicesExcelAction() {
  try {
    await requireRole(["admin", "finanzas"]);

    const invoicesData = await db
      .select({
        invoiceNumber: invoices.invoiceNumber,
        client: {
          tradeName: clients.tradeName,
          rut: clients.rut,
        },
        project: {
          projectCode: projects.projectCode,
        },
        issueDate: invoices.issueDate,
        dueDate: invoices.dueDate,
        subtotalClp: invoices.subtotalClp,
        taxClp: invoices.taxClp,
        totalClp: invoices.totalClp,
        status: invoices.status,
        createdByUser: {
          fullName: users.fullName,
        },
      })
      .from(invoices)
      .leftJoin(clients, eq(invoices.clientId, clients.id))
      .leftJoin(projects, eq(invoices.projectId, projects.id))
      .leftJoin(users, eq(invoices.createdByUserId, users.id))
      .orderBy(desc(invoices.id))
      .limit(500);

    const buffer = await exportInvoicesToExcel(invoicesData);

    return {
      success: true,
      data: Buffer.from(buffer).toString("base64"),
      filename: `facturas_${new Date().toISOString().split("T")[0]}.xlsx`,
    };
  } catch (error) {
    console.error("exportInvoicesExcelAction", toErrorMessage(error));
    return {
      success: false,
      error: toErrorMessage(error),
    };
  }
}
