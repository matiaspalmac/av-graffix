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
import Link from "next/link";
import { sql } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db/client";
import {
  clients,
  invoices,
  inventoryTransactions,
  materialConsumptions,
  materials,
  payments,
  purchaseOrders,
  projects,
  quotes,
  suppliers,
  tasks,
  timesheets,
} from "@/db/schema";
import { formatCLP, formatPercent } from "@/lib/format";
import { KpiCard } from "@/components/erp/kpi-card";
import { updateTaskStatusQuickAction } from "@/app/erp/(protected)/dashboard-actions";

function monthStartISO() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}

export default async function ErpDashboardPage() {
  const session = await auth();
  const currentUserId = Number(session?.user?.id ?? 0);
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
    materialWasteResult,
    quotesConversionResult,
    pendingPurchaseOrdersResult,
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
  ]);

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

  const userTasks = currentUserId
    ? await db
        .select({
          id: tasks.id,
          title: tasks.title,
          status: tasks.status,
          dueAt: tasks.dueAt,
          priority: tasks.priority,
        })
        .from(tasks)
        .where(sql`${tasks.assigneeUserId} = ${currentUserId} and ${tasks.status} in ('todo','in_progress')`)
        .orderBy(sql`
          case ${tasks.priority}
            when 'high' then 1
            when 'normal' then 2
            else 3
          end,
          coalesce(${tasks.dueAt}, '9999-12-31') asc,
          ${tasks.id} desc
        `)
        .limit(8)
    : [];

  const activeProjects = Number(activeProjectsResult[0]?.value ?? 0);
  const quotesPending = Number(quotesPendingResult[0]?.value ?? 0);
  const monthlyRevenue = Number(monthlyRevenueResult[0]?.value ?? 0);
  const monthlyHoursCost = Number(monthlyHoursCostResult[0]?.value ?? 0);
  const monthlyMaterialCost = Number(monthlyMaterialCostResult[0]?.value ?? 0);
  const pendingCollections = Number(pendingCollectionsResult[0]?.value ?? 0);
  const criticalStock = Number(criticalStockResult[0]?.value ?? 0);
  const productionProjects = Number(productionProjectsResult[0]?.value ?? 0);
  
  // KPIs dinámicos
  const materialWastePct = Number(materialWasteResult[0]?.wastePct ?? 0);
  const quotesTotal = Number(quotesConversionResult[0]?.total ?? 0);
  const quotesApproved = Number(quotesConversionResult[0]?.approved ?? 0);
  const quotesConversionRate = quotesTotal > 0 ? (quotesApproved * 100) / quotesTotal : 0;
  const pendingPurchaseOrders = Number(pendingPurchaseOrdersResult[0]?.value ?? 0);

  const monthlyCost = monthlyHoursCost + monthlyMaterialCost;
  const monthlyMargin = monthlyRevenue > 0 ? ((monthlyRevenue - monthlyCost) * 100) / monthlyRevenue : 0;
  const overdueAmount = overdueInvoices.reduce((sum, invoice) => sum + Number(invoice.pendingClp ?? 0), 0);
  const maxLateDays = overdueInvoices.reduce((maxDays, invoice) => {
    if (!invoice.dueDate) {
      return maxDays;
    }
    const dueTime = new Date(invoice.dueDate).getTime();
    const days = Math.max(Math.floor((Date.now() - dueTime) / (1000 * 60 * 60 * 24)), 0);
    return Math.max(maxDays, days);
  }, 0);

  const currentDate = Date.now();

  function lateDaysLabel(dateIso: string | null) {
    if (!dateIso) {
      return "-";
    }
    const diffMs = currentDate - new Date(dateIso).getTime();
    const days = Math.max(Math.floor(diffMs / (1000 * 60 * 60 * 24)), 0);
    return `${days} día(s)`;
  }

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

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Alertas operativas unificadas</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Prioridades diarias para stock, abastecimiento y caja.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="rounded-xl border border-orange-200 dark:border-orange-900/40 p-4 bg-orange-50/60 dark:bg-orange-950/20">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Stock crítico</p>
              <span className="text-xs rounded-full bg-white/80 dark:bg-zinc-900 px-2 py-1 border border-orange-200 dark:border-orange-900/40">
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

          <div className="rounded-xl border border-amber-200 dark:border-amber-900/40 p-4 bg-amber-50/60 dark:bg-amber-950/20">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">OC atrasadas</p>
              <span className="text-xs rounded-full bg-white/80 dark:bg-zinc-900 px-2 py-1 border border-amber-200 dark:border-amber-900/40">
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

          <div className="rounded-xl border border-violet-200 dark:border-violet-900/40 p-4 bg-violet-50/60 dark:bg-violet-950/20">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Cobranza vencida</p>
              <span className="text-xs rounded-full bg-white/80 dark:bg-zinc-900 px-2 py-1 border border-violet-200 dark:border-violet-900/40">
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

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Mi trabajo hoy</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Tareas asignadas para avanzar en operación diaria.</p>

        {userTasks.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">No tienes tareas pendientes asignadas.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {userTasks.map((task) => (
              <form key={task.id} action={updateTaskStatusQuickAction} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center rounded-xl border border-zinc-200 dark:border-zinc-800 p-3">
                <input type="hidden" name="taskId" value={task.id} />
                <div className="md:col-span-6">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{task.title}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Prioridad: {task.priority ?? "normal"}
                    {task.dueAt ? ` · Vence: ${new Date(task.dueAt).toLocaleDateString("es-CL")}` : ""}
                  </p>
                </div>
                <div className="md:col-span-4">
                  <select name="status" defaultValue={task.status} className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-2 text-sm">
                    <option value="todo">Por hacer</option>
                    <option value="in_progress">En progreso</option>
                    <option value="done">Hecha</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <button className="w-full rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-2 py-2 text-sm font-semibold">
                    Guardar
                  </button>
                </div>
              </form>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
