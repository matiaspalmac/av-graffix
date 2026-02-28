import { sql } from "drizzle-orm";
import { db } from "@/db/client";
import {
    invoices,
    inventoryTransactions,
    materialConsumptions,
    materials,
    projects,
    quotes,
    timesheets,
} from "@/db/schema";
import {
    BarChart3,
    Boxes,
    Briefcase,
    Clock3,
    DollarSign,
    FileWarning,
    Factory,
    TrendingUp,
} from "lucide-react";
import { formatCLP, formatPercent } from "@/lib/format";
import { KpiCard } from "@/components/erp/kpi-card";

function monthStartISO() {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}

export async function ExecutiveKpis() {
    const monthStart = monthStartISO();

    const [
        activeProjectsResult,
        quotesPendingResult,
        monthlyRevenueResult,
        monthlyHoursCostResult,
        monthlyMaterialCostResult,
        criticalStockResult,
        productionProjectsResult,
    ] = await Promise.all([
        db.select({ value: sql<number>`count(*)` }).from(projects).where(sql`${projects.status} in ('planning','in_progress')`),
        db.select({ value: sql<number>`count(*)` }).from(quotes).where(sql`${quotes.status} in ('sent','approved')`),
        db
            .select({ value: sql<number>`coalesce(sum(${invoices.totalClp}),0)` })
            .from(invoices)
            .where(sql`${invoices.issueDate} >= ${monthStart}`),
        db
            .select({ value: sql<number>`coalesce(sum(${timesheets.totalCostClp}),0)` })
            .from(timesheets)
            .where(sql`${timesheets.workDate} >= ${monthStart}`),
        db
            .select({ value: sql<number>`coalesce(sum(${materialConsumptions.totalCostClp}),0)` })
            .from(materialConsumptions)
            .where(sql`${materialConsumptions.consumptionDate} >= ${monthStart}`),
        db
            .select({ value: sql<number>`count(*)` })
            .from(materials)
            .where(sql`
        coalesce(
          (
            select sum(${inventoryTransactions.qtyIn} - ${inventoryTransactions.qtyOut})
            from ${inventoryTransactions}
            where ${inventoryTransactions.materialId} = ${materials.id}
          ),
          0
        ) <= ${materials.reorderPoint}
      `),
        db.select({ value: sql<number>`count(*)` }).from(projects).where(sql`${projects.status} = 'in_progress'`),
    ]);

    const activeProjects = Number(activeProjectsResult[0]?.value ?? 0);
    const quotesPending = Number(quotesPendingResult[0]?.value ?? 0);
    const monthlyRevenue = Number(monthlyRevenueResult[0]?.value ?? 0);
    const monthlyHoursCost = Number(monthlyHoursCostResult[0]?.value ?? 0);
    const monthlyMaterialCost = Number(monthlyMaterialCostResult[0]?.value ?? 0);
    const criticalStock = Number(criticalStockResult[0]?.value ?? 0);
    const productionProjects = Number(productionProjectsResult[0]?.value ?? 0);

    const monthlyCost = monthlyHoursCost + monthlyMaterialCost;
    const monthlyMargin = monthlyRevenue > 0 ? ((monthlyRevenue - monthlyCost) * 100) / monthlyRevenue : 0;

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <KpiCard label="Proyectos activos" value={String(activeProjects)} hint="En planning o ejecución" icon={<Briefcase size={16} />} tone="brand" />
                <KpiCard label="En producción" value={String(productionProjects)} hint="Órdenes en taller" icon={<Factory size={16} />} tone="orange" />
                <KpiCard label="Cotizaciones abiertas" value={String(quotesPending)} hint="Enviadas/aprobadas" icon={<BarChart3 size={16} />} tone="zinc" />
                <KpiCard label="Stock crítico" value={String(criticalStock)} hint="Materiales en reorder" icon={<FileWarning size={16} />} tone="orange" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
                <KpiCard label="Facturación mes" value={formatCLP(monthlyRevenue)} hint="Total emitido" icon={<DollarSign size={16} />} tone="green" />
                <KpiCard label="Costo horas mes" value={formatCLP(monthlyHoursCost)} hint="Timesheets" icon={<Clock3 size={16} />} tone="zinc" />
                <KpiCard label="Costo materiales mes" value={formatCLP(monthlyMaterialCost)} hint="Consumos reales" icon={<Boxes size={16} />} tone="zinc" />
                <KpiCard label="Rentabilidad mes" value={formatPercent(monthlyMargin)} hint="Margen sobre facturación" icon={<TrendingUp size={16} />} tone="violet" />
            </div>
        </>
    );
}
