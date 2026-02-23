import {
  BarChart3,
  Boxes,
  Briefcase,
  Clock3,
  DollarSign,
  FileWarning,
  Factory,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { sql } from "drizzle-orm";
import { db } from "@/db/client";
import {
  invoices,
  inventoryTransactions,
  materialConsumptions,
  materials,
  payments,
  projects,
  quotes,
  timesheets,
} from "@/db/schema";
import { formatCLP, formatPercent } from "@/lib/format";
import { KpiCard } from "@/components/erp/kpi-card";

function monthStartISO() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}

export default async function ErpDashboardPage() {
  const monthStart = monthStartISO();

  const [
    activeProjectsResult,
    quotesPendingResult,
    monthlyRevenueResult,
    monthlyHoursCostResult,
    monthlyMaterialCostResult,
    pendingCollectionsResult,
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
      .select({
        value: sql<number>`coalesce(sum(${invoices.totalClp}),0) - coalesce((select sum(${payments.amountClp}) from ${payments} where ${payments.invoiceId} = ${invoices.id}),0)`,
      })
      .from(invoices)
      .where(sql`${invoices.status} in ('issued','partial','overdue')`),
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
  const pendingCollections = Number(pendingCollectionsResult[0]?.value ?? 0);
  const criticalStock = Number(criticalStockResult[0]?.value ?? 0);
  const productionProjects = Number(productionProjectsResult[0]?.value ?? 0);

  const monthlyCost = monthlyHoursCost + monthlyMaterialCost;
  const monthlyMargin = monthlyRevenue > 0 ? ((monthlyRevenue - monthlyCost) * 100) / monthlyRevenue : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-brand-600 font-semibold">Dashboard Ejecutivo</p>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">Control AV GRAFFIX ERP</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Costos reales por horas + materiales en CLP</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Proyectos activos" value={String(activeProjects)} hint="En planning o ejecución" icon={<Briefcase size={16} />} tone="brand" />
        <KpiCard label="En producción" value={String(productionProjects)} hint="Órdenes en taller" icon={<Factory size={16} />} tone="orange" />
        <KpiCard label="Cotizaciones abiertas" value={String(quotesPending)} hint="Enviadas/aprobadas" icon={<BarChart3 size={16} />} tone="zinc" />
        <KpiCard label="Stock crítico" value={String(criticalStock)} hint="Materiales en reorder" icon={<FileWarning size={16} />} tone="orange" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Facturación mes" value={formatCLP(monthlyRevenue)} hint="Total emitido" icon={<DollarSign size={16} />} tone="green" />
        <KpiCard label="Costo horas mes" value={formatCLP(monthlyHoursCost)} hint="Timesheets" icon={<Clock3 size={16} />} tone="zinc" />
        <KpiCard label="Costo materiales mes" value={formatCLP(monthlyMaterialCost)} hint="Consumos reales" icon={<Boxes size={16} />} tone="zinc" />
        <KpiCard label="Rentabilidad mes" value={formatPercent(monthlyMargin)} hint="Margen sobre facturación" icon={<TrendingUp size={16} />} tone="violet" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Cobranza</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Facturas emitidas pendientes de cobro</p>
          <p className="mt-4 text-3xl font-black text-violet-600">{formatCLP(pendingCollections)}</p>
          <div className="mt-4 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900/40 p-3 text-sm text-violet-700 dark:text-violet-300">
            Sugerencia: priorizar cobranza de facturas &gt;30 días para proteger caja operativa.
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Indicadores rápidos</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center justify-between rounded-lg bg-zinc-100 dark:bg-zinc-800/60 px-3 py-2">
              <span className="text-zinc-600 dark:text-zinc-300">Pendones y soportes gráficos</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">Monitorear merma de tela</span>
            </li>
            <li className="flex items-center justify-between rounded-lg bg-zinc-100 dark:bg-zinc-800/60 px-3 py-2">
              <span className="text-zinc-600 dark:text-zinc-300">Etiquetas adhesivas</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">Control fino de vinilo/adhesivo</span>
            </li>
            <li className="flex items-center justify-between rounded-lg bg-zinc-100 dark:bg-zinc-800/60 px-3 py-2">
              <span className="text-zinc-600 dark:text-zinc-300">Facturación y SII</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">Folio + PDF trazable</span>
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

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Próximo paso recomendado</h3>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Cargar catálogo inicial de materiales (vinilos, tintas, papeles, telas) y precios vigentes por proveedor para habilitar cálculo de rentabilidad por proyecto con datos completos.
        </p>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Proveedores sugeridos: Antalis Chile, 3M Chile, Roland, Mimaki.</p>
      </div>
    </div>
  );
}
