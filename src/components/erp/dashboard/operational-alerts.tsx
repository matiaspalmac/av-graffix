import { sql } from "drizzle-orm";
import { db } from "@/db/client";
import {
    clients,
    invoices,
    inventoryTransactions,
    materials,
    payments,
    purchaseOrders,
    suppliers,
} from "@/db/schema";
import { formatCLP } from "@/lib/format";
import Link from "next/link";

export async function OperationalAlerts() {
    const currentDate = Date.now();

    const [criticalMaterials, delayedPurchaseOrders, overdueInvoices] = await Promise.all([
        db
            .select({
                id: materials.id,
                name: materials.name,
                baseUnit: materials.baseUnit,
                reorderPoint: materials.reorderPoint,
                stock: sql<number>`coalesce((select sum(${inventoryTransactions.qtyIn} - ${inventoryTransactions.qtyOut}) from ${inventoryTransactions} where ${inventoryTransactions.materialId} = ${materials.id}),0)`,
            })
            .from(materials)
            .where(
                sql`coalesce((select sum(${inventoryTransactions.qtyIn} - ${inventoryTransactions.qtyOut}) from ${inventoryTransactions} where ${inventoryTransactions.materialId} = ${materials.id}),0) <= ${materials.reorderPoint}`
            )
            .orderBy(sql`${materials.reorderPoint} desc, ${materials.name} asc`)
            .limit(6),

        db
            .select({
                id: purchaseOrders.id,
                poNumber: purchaseOrders.poNumber,
                expectedDate: purchaseOrders.expectedDate,
                status: purchaseOrders.status,
                supplierName: suppliers.tradeName,
            })
            .from(purchaseOrders)
            .leftJoin(suppliers, sql`${purchaseOrders.supplierId} = ${suppliers.id}`)
            .where(sql`${purchaseOrders.status} in ('sent','partial') and ${purchaseOrders.expectedDate} is not null and ${purchaseOrders.expectedDate} < datetime('now')`)
            .orderBy(sql`${purchaseOrders.expectedDate} asc`)
            .limit(6),

        db
            .select({
                id: invoices.id,
                invoiceNumber: invoices.invoiceNumber,
                dueDate: invoices.dueDate,
                clientName: clients.tradeName,
                pendingClp: sql<number>`coalesce(${invoices.totalClp},0) - coalesce((select sum(${payments.amountClp}) from ${payments} where ${payments.invoiceId} = ${invoices.id}),0)`,
            })
            .from(invoices)
            .leftJoin(clients, sql`${invoices.clientId} = ${clients.id}`)
            .where(sql`${invoices.status} in ('issued','partial','overdue') and ${invoices.dueDate} is not null and ${invoices.dueDate} < datetime('now') and (coalesce(${invoices.totalClp},0) - coalesce((select sum(${payments.amountClp}) from ${payments} where ${payments.invoiceId} = ${invoices.id}),0)) > 0`)
            .orderBy(sql`${invoices.dueDate} asc`)
            .limit(6),
    ]);

    function lateDaysLabel(dateIso: string | null) {
        if (!dateIso) return "-";
        const diffMs = currentDate - new Date(dateIso).getTime();
        const days = Math.max(Math.floor(diffMs / (1000 * 60 * 60 * 24)), 0);
        return `${days} día(s)`;
    }

    return (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Alertas operativas unificadas</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Prioridades diarias para stock, abastecimiento y caja.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-800/20 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800/50">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Stock crítico</p>
                        <span className="text-xs font-semibold rounded-full bg-white dark:bg-zinc-900 px-2 py-1 border border-zinc-200 dark:border-zinc-700 shadow-sm text-zinc-700 dark:text-zinc-300">
                            {criticalMaterials.length}
                        </span>
                    </div>
                    <div className="mt-3 space-y-2">
                        {criticalMaterials.length === 0 ? (
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">Sin alertas de reposición hoy.</p>
                        ) : (
                            criticalMaterials.map((material) => (
                                <div key={material.id} className="rounded-lg bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm">
                                    <p className="font-medium text-zinc-900 dark:text-zinc-100">{material.name}</p>
                                    <p className="text-zinc-600 dark:text-zinc-400">
                                        Stock {Number(material.stock).toFixed(2)} {material.baseUnit} · Min {Number(material.reorderPoint).toFixed(2)}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                    <Link href="/erp/inventario" className="mt-3 inline-block text-sm font-semibold text-brand-700 dark:text-brand-300">
                        Ir a Inventario →
                    </Link>
                </div>

                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-800/20 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800/50">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">OC atrasadas</p>
                        <span className="text-xs font-semibold rounded-full bg-white dark:bg-zinc-900 px-2 py-1 border border-zinc-200 dark:border-zinc-700 shadow-sm text-zinc-700 dark:text-zinc-300">
                            {delayedPurchaseOrders.length}
                        </span>
                    </div>
                    <div className="mt-3 space-y-2">
                        {delayedPurchaseOrders.length === 0 ? (
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">No hay órdenes retrasadas.</p>
                        ) : (
                            delayedPurchaseOrders.map((order) => (
                                <div key={order.id} className="rounded-lg bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm">
                                    <p className="font-medium text-zinc-900 dark:text-zinc-100">{order.poNumber} · {order.supplierName ?? "-"}</p>
                                    <p className="text-zinc-600 dark:text-zinc-400">
                                        Vencida hace {lateDaysLabel(order.expectedDate)} · Estado {order.status}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                    <Link href="/erp/compras" className="mt-3 inline-block text-sm font-semibold text-brand-700 dark:text-brand-300">
                        Ir a Compras →
                    </Link>
                </div>

                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-800/20 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800/50">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Cobranza vencida</p>
                        <span className="text-xs font-semibold rounded-full bg-white dark:bg-zinc-900 px-2 py-1 border border-zinc-200 dark:border-zinc-700 shadow-sm text-zinc-700 dark:text-zinc-300">
                            {overdueInvoices.length}
                        </span>
                    </div>
                    <div className="mt-3 space-y-2">
                        {overdueInvoices.length === 0 ? (
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">No hay facturas vencidas pendientes.</p>
                        ) : (
                            overdueInvoices.map((invoice) => (
                                <div key={invoice.id} className="rounded-lg bg-white/80 dark:bg-zinc-900/70 px-3 py-2 text-sm">
                                    <p className="font-medium text-zinc-900 dark:text-zinc-100">{invoice.invoiceNumber} · {invoice.clientName ?? "-"}</p>
                                    <p className="text-zinc-600 dark:text-zinc-400">
                                        Pendiente {formatCLP(invoice.pendingClp)} · Vencida hace {lateDaysLabel(invoice.dueDate)}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                    <Link href="/erp/finanzas" className="mt-3 inline-block text-sm font-semibold text-brand-700 dark:text-brand-300">
                        Ir a Finanzas →
                    </Link>
                </div>
            </div>
        </div>
    );
}
