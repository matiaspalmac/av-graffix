"use server";

import { db } from "@/db/client";
import { sql } from "drizzle-orm";
import { materials, inventoryTransactions, projects, quotes, purchaseOrders, invoices } from "@/db/schema";
import { format, addDays } from "date-fns";

export type AppNotification = {
    id: string;
    type: "critical" | "warning" | "info";
    title: string;
    message: string;
    actionUrl?: string;
};

export async function getDashboardNotifications(): Promise<AppNotification[]> {
    const notifications: AppNotification[] = [];
    const todayDate = new Date();
    const today = format(todayDate, "yyyy-MM-dd");
    const inThreeDays = format(addDays(todayDate, 3), "yyyy-MM-dd");

    const [
        criticalStockResult,
        overdueProjectsResult,
        dueSoonProjectsResult,
        expiringQuotesResult,
        delayedPurchaseOrdersResult,
        overdueInvoicesResult,
    ] = await Promise.all([
        // 1. Stock Crítico
        db
            .select({ count: sql<number>`count(*)` })
            .from(materials)
            .where(
                sql`coalesce((select sum(${inventoryTransactions.qtyIn} - ${inventoryTransactions.qtyOut}) from ${inventoryTransactions} where ${inventoryTransactions.materialId} = ${materials.id}),0) <= ${materials.reorderPoint} AND ${materials.reorderPoint} > 0 AND ${materials.isActive} = 1`
            ),
        // 2. Proyectos Vencidos
        db
            .select({ count: sql<number>`count(*)` })
            .from(projects)
            .where(sql`${projects.status} IN ('planning', 'in_progress') AND ${projects.dueDate} < ${today}`),
        // 3. Proyectos por Vencer (0-3 días)
        db
            .select({ count: sql<number>`count(*)` })
            .from(projects)
            .where(sql`${projects.status} IN ('planning', 'in_progress') AND ${projects.dueDate} >= ${today} AND ${projects.dueDate} <= ${inThreeDays}`),
        // 4. Cotizaciones a punto de caducar (0-3 días)
        db
            .select({ count: sql<number>`count(*)` })
            .from(quotes)
            .where(sql`${quotes.status} IN ('draft', 'sent') AND ${quotes.validUntil} >= ${today} AND ${quotes.validUntil} <= ${inThreeDays}`),
        // 5. Órdenes de compra atrasadas
        db
            .select({ count: sql<number>`count(*)` })
            .from(purchaseOrders)
            .where(sql`${purchaseOrders.status} NOT IN ('received', 'cancelled') AND ${purchaseOrders.expectedDate} < ${today}`),
        // 6. Facturas vencidas impagas
        db
            .select({ count: sql<number>`count(*)` })
            .from(invoices)
            .where(sql`${invoices.status} NOT IN ('paid', 'cancelled') AND ${invoices.dueDate} < ${today}`),
    ]);

    // Stock
    const stockCount = criticalStockResult[0]?.count || 0;
    if (stockCount > 0) {
        notifications.push({
            id: "stock-critical",
            type: "critical",
            title: "Stock Crítico",
            message: `Hay ${stockCount} material(es) por debajo del stock mínimo.`,
            actionUrl: "/erp/inventario",
        });
    }

    // Proyectos Vencidos
    const overdueProjectsCount = overdueProjectsResult[0]?.count || 0;
    if (overdueProjectsCount > 0) {
        notifications.push({
            id: "projects-overdue",
            type: "critical",
            title: "Proyectos Vencidos",
            message: `Tienes ${overdueProjectsCount} proyecto(s) con fecha vencida de entrega.`,
            actionUrl: "/erp/cronograma",
        });
    }

    // Proyectos por Vencer
    const dueSoonProjectsCount = dueSoonProjectsResult[0]?.count || 0;
    if (dueSoonProjectsCount > 0) {
        notifications.push({
            id: "projects-due-soon",
            type: "warning",
            title: "Proyectos por Vencer",
            message: `Tienes ${dueSoonProjectsCount} proyecto(s) que vencen dentro de los próximos 3 días.`,
            actionUrl: "/erp/cronograma",
        });
    }

    // Cotizaciones por Caducar
    const expiringQuotesCount = expiringQuotesResult[0]?.count || 0;
    if (expiringQuotesCount > 0) {
        notifications.push({
            id: "quotes-expiring",
            type: "info",
            title: "Cotizaciones por Caducar",
            message: `Hay ${expiringQuotesCount} cotización(es) a punto de expirar pronto.`,
            actionUrl: "/erp/cotizaciones",
        });
    }

    // Órdenes de Compra
    const delayedOrdersCount = delayedPurchaseOrdersResult[0]?.count || 0;
    if (delayedOrdersCount > 0) {
        notifications.push({
            id: "orders-delayed",
            type: "warning",
            title: "Órdenes Atrasadas",
            message: `Hay ${delayedOrdersCount} orden(es) de compra pendientes con fecha esperada pasada.`,
            actionUrl: "/erp/compras",
        });
    }

    // Facturas Vencidas
    const overdueInvoicesCount = overdueInvoicesResult[0]?.count || 0;
    if (overdueInvoicesCount > 0) {
        notifications.push({
            id: "invoices-overdue",
            type: "critical",
            title: "Facturas Vencidas",
            message: `Tienes ${overdueInvoicesCount} factura(s) que se encuentran vencidas y sin pago.`,
            actionUrl: "/erp/finanzas", // Assuming URL exists or general location
        });
    }

    return notifications;
}
