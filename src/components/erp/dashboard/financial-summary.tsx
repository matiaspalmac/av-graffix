import { sql } from "drizzle-orm";
import { db } from "@/db/client";
import {
    clients,
    invoices,
    materialConsumptions,
    payments,
    purchaseOrders,
    quotes,
    timesheets,
} from "@/db/schema";
import { formatCLP } from "@/lib/format";
import Link from "next/link";
import { Wallet } from "lucide-react";

function monthStartISO() {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}

export async function FinancialSummary() {
    const monthStart = monthStartISO();

    const [
        pendingCollectionsResult,
        materialWasteResult,
        quotesConversionResult,
        pendingPurchaseOrdersResult,
        monthlyHoursCostResult,
        monthlyMaterialCostResult,
    ] = await Promise.all([
        db
            .select({
                value: sql<number>`coalesce(sum(${invoices.totalClp}),0) - coalesce((select sum(${payments.amountClp}) from ${payments} where ${payments.invoiceId} = ${invoices.id}),0)`,
            })
            .from(invoices)
            .where(sql`${invoices.status} in ('issued','partial','overdue')`),
        // % de merma/desperdicio real vs planificado
        db.select({
            wastePct: sql<number>`
        case 
          when coalesce(sum(${materialConsumptions.qtyPlanned}),0) > 0 
          then (coalesce(sum(${materialConsumptions.wasteQty}),0) * 100.0) / coalesce(sum(${materialConsumptions.qtyPlanned}),1)
          else 0
        end
      `
        }).from(materialConsumptions).where(sql`${materialConsumptions.consumptionDate} >= ${monthStart}`),
        // Tasa de conversión de cotizaciones (aprobadas / total del mes)
        db.select({
            total: sql<number>`coalesce(count(*),0)`,
            approved: sql<number>`coalesce(sum(case when ${quotes.status} = 'approved' then 1 else 0 end),0)`,
        }).from(quotes).where(sql`${quotes.issueDate} >= ${monthStart}`),
        // Órdenes de compra pendientes
        db.select({ value: sql<number>`count(*)` }).from(purchaseOrders).where(sql`${purchaseOrders.status} in ('draft','sent','partial')`),
        db.select({ value: sql<number>`coalesce(sum(${timesheets.totalCostClp}),0)` }).from(timesheets).where(sql`${timesheets.workDate} >= ${monthStart}`),
        db.select({ value: sql<number>`coalesce(sum(${materialConsumptions.totalCostClp}),0)` }).from(materialConsumptions).where(sql`${materialConsumptions.consumptionDate} >= ${monthStart}`),
    ]);

    const overdueInvoices = await db
        .select({
            id: invoices.id,
            dueDate: invoices.dueDate,
            pendingClp: sql<number>`coalesce(${invoices.totalClp},0) - coalesce((select sum(${payments.amountClp}) from ${payments} where ${payments.invoiceId} = ${invoices.id}),0)`,
        })
        .from(invoices)
        .where(sql`${invoices.status} in ('issued','partial','overdue') and ${invoices.dueDate} is not null and ${invoices.dueDate} < datetime('now') and (coalesce(${invoices.totalClp},0) - coalesce((select sum(${payments.amountClp}) from ${payments} where ${payments.invoiceId} = ${invoices.id}),0)) > 0`);

    const pendingCollections = Number(pendingCollectionsResult[0]?.value ?? 0);
    const materialWastePct = Number(materialWasteResult[0]?.wastePct ?? 0);
    const quotesTotal = Number(quotesConversionResult[0]?.total ?? 0);
    const quotesApproved = Number(quotesConversionResult[0]?.approved ?? 0);
    const quotesConversionRate = quotesTotal > 0 ? (quotesApproved * 100) / quotesTotal : 0;
    const pendingPurchaseOrders = Number(pendingPurchaseOrdersResult[0]?.value ?? 0);
    const monthlyCost = Number(monthlyHoursCostResult[0]?.value ?? 0) + Number(monthlyMaterialCostResult[0]?.value ?? 0);

    const overdueAmount = overdueInvoices.reduce((sum, invoice) => sum + Number(invoice.pendingClp ?? 0), 0);
    const maxLateDays = overdueInvoices.reduce((maxDays, invoice) => {
        if (!invoice.dueDate) return maxDays;
        const dueTime = new Date(invoice.dueDate).getTime();
        const days = Math.max(Math.floor((Date.now() - dueTime) / (1000 * 60 * 60 * 24)), 0);
        return Math.max(maxDays, days);
    }, 0);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Cobranza</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Facturas emitidas pendientes de cobro</p>
                <p className="mt-4 text-3xl font-black text-violet-600">{formatCLP(pendingCollections)}</p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-3">
                        <p className="text-zinc-500">Facturas vencidas</p>
                        <p className="mt-1 text-base font-bold text-zinc-900 dark:text-zinc-100">{overdueInvoices.length}</p>
                    </div>
                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-3">
                        <p className="text-zinc-500">Monto vencido</p>
                        <p className="mt-1 text-base font-bold text-zinc-900 dark:text-zinc-100">{formatCLP(overdueAmount)}</p>
                    </div>
                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-3">
                        <p className="text-zinc-500">Mayor atraso</p>
                        <p className="mt-1 text-base font-bold text-zinc-900 dark:text-zinc-100">{maxLateDays} día(s)</p>
                    </div>
                </div>
                <Link href="/erp/finanzas" className="mt-4 inline-block text-sm font-semibold text-brand-700 dark:text-brand-300">
                    Gestionar cobranza →
                </Link>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Indicadores rápidos</h3>
                <ul className="mt-4 space-y-3 text-sm">
                    <li className="flex items-center justify-between rounded-lg bg-zinc-100 dark:bg-zinc-800/60 px-3 py-2">
                        <span className="text-zinc-600 dark:text-zinc-300">Merma de materiales (mes)</span>
                        <span className={`font-semibold ${materialWastePct > 15 ? 'text-red-600' : materialWastePct > 8 ? 'text-orange-600' : 'text-green-600'}`}>
                            {materialWastePct.toFixed(1)}%
                        </span>
                    </li>
                    <li className="flex items-center justify-between rounded-lg bg-zinc-100 dark:bg-zinc-800/60 px-3 py-2">
                        <span className="text-zinc-600 dark:text-zinc-300">Tasa conversión cotizaciones</span>
                        <span className={`font-semibold ${quotesConversionRate < 30 ? 'text-red-600' : quotesConversionRate < 50 ? 'text-orange-600' : 'text-green-600'}`}>
                            {quotesConversionRate.toFixed(0)}%
                        </span>
                    </li>
                    <li className="flex items-center justify-between rounded-lg bg-zinc-100 dark:bg-zinc-800/60 px-3 py-2">
                        <span className="text-zinc-600 dark:text-zinc-300">Órdenes de compra pendientes</span>
                        <span className={`font-semibold ${pendingPurchaseOrders > 10 ? 'text-orange-600' : 'text-zinc-900 dark:text-zinc-100'}`}>
                            {pendingPurchaseOrders}
                        </span>
                    </li>
                </ul>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-3">
                        <p className="text-zinc-500">Costo total mes</p>
                        <p className="mt-1 text-base font-bold text-zinc-900 dark:text-zinc-100">{formatCLP(monthlyCost)}</p>
                    </div>
                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-3">
                        <p className="text-zinc-500">Estado cobranza</p>
                        <p className="mt-1 text-base font-bold text-zinc-900 dark:text-zinc-100 inline-flex items-center gap-1">
                            <Wallet size={14} /> Activa
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
