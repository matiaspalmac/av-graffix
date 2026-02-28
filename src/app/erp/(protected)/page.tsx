import { Suspense } from "react";
import { Welcome } from "@/components/erp/welcome";
import { auth } from "@/auth";

// Components
import { ExecutiveKpis } from "@/components/erp/dashboard/executive-kpis";
import { FinancialSummary } from "@/components/erp/dashboard/financial-summary";
import { OperationalAlerts } from "@/components/erp/dashboard/operational-alerts";
import { MyWorkTasks } from "@/components/erp/dashboard/my-work-tasks";

// Skeletons
import { ExecutiveKpisSkeleton, WidgetSkeleton } from "@/components/erp/dashboard/skeletons";

export default async function ErpDashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      {/* Header Estático - Carga instantánea */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-brand-600 font-semibold">Dashboard Ejecutivo</p>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">Control AV GRAFFIX ERP</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Costos reales por horas + materiales en CLP</p>
        </div>
        <div className="text-right">
          <Welcome name={session?.user?.name || "Usuario"} />
        </div>
      </div>

      {/* KPIs Ejecutivos (2 filas de 4 tarjetas) */}
      <Suspense fallback={<ExecutiveKpisSkeleton />}>
        <ExecutiveKpis />
      </Suspense>

      {/* Resumen Financiero e Indicadores */}
      <Suspense fallback={
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <WidgetSkeleton className="h-[300px]" />
          <WidgetSkeleton className="h-[300px]" />
        </div>
      }>
        <FinancialSummary />
      </Suspense>

      {/* Alertas Operativas */}
      <Suspense fallback={<WidgetSkeleton className="h-[250px]" />}>
        <OperationalAlerts />
      </Suspense>

      {/* Tareas del Usuario */}
      <Suspense fallback={<WidgetSkeleton className="h-[300px]" />}>
        <MyWorkTasks />
      </Suspense>

    </div>
  );
}
