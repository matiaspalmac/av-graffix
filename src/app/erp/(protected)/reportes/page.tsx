import { sql } from "drizzle-orm";
import { db } from "@/db/client";
import { invoices, materialConsumptions, projects, timesheets } from "@/db/schema";
import { formatCLP, formatPercent } from "@/lib/format";
export default async function ReportesPage() {
  const [projectCount, laborCost, materialCost, profitabilityRows] = await Promise.all([
    db.select({ v: sql<number>`count(*)` }).from(projects),
    db.select({ v: sql<number>`coalesce(sum(${timesheets.totalCostClp}),0)` }).from(timesheets),
    db.select({ v: sql<number>`coalesce(sum(${materialConsumptions.totalCostClp}),0)` }).from(materialConsumptions),
    db
      .select({
        projectId: projects.id,
        projectCode: projects.projectCode,
        projectName: projects.name,
        status: projects.status,
        budgetRevenueClp: projects.budgetRevenueClp,
        budgetCostClp: projects.budgetCostClp,
        laborCostClp: sql<number>`coalesce((select sum(${timesheets.totalCostClp}) from ${timesheets} where ${timesheets.projectId} = ${projects.id}),0)`,
        materialCostClp: sql<number>`coalesce((select sum(${materialConsumptions.totalCostClp}) from ${materialConsumptions} where ${materialConsumptions.projectId} = ${projects.id}),0)`,
        invoicedClp: sql<number>`coalesce((select sum(${invoices.totalClp}) from ${invoices} where ${invoices.projectId} = ${projects.id}),0)`,
      })
      .from(projects)
      .orderBy(sql`${projects.id} desc`)
      .limit(20),
  ]);

  const rows = profitabilityRows.map((row) => {
    const realCost = Number(row.laborCostClp) + Number(row.materialCostClp);
    const realRevenue = Number(row.invoicedClp) > 0 ? Number(row.invoicedClp) : Number(row.budgetRevenueClp);
    const marginPct = realRevenue > 0 ? ((realRevenue - realCost) * 100) / realRevenue : 0;

    return {
      ...row,
      realCost,
      realRevenue,
      marginPct,
    };
  });

  const profitable = rows.filter((row) => row.marginPct >= 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">Reportes & Rentabilidad</h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">Costo real por proyecto: horas + materiales vs ingreso CLP.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Proyectos analizados</p>
          <p className="mt-2 text-2xl font-black">{String(projectCount[0]?.v ?? 0)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Costo mano de obra</p>
          <p className="mt-2 text-2xl font-black">{formatCLP(Number(laborCost[0]?.v ?? 0))}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Costo materiales</p>
          <p className="mt-2 text-2xl font-black">{formatCLP(Number(materialCost[0]?.v ?? 0))}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Proyectos rentables</p>
          <p className="mt-2 text-2xl font-black">{profitable}/{rows.length}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 overflow-auto">
        <h3 className="text-lg font-bold mb-4">Rentabilidad por proyecto</h3>
        {rows.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-zinc-500 dark:text-zinc-400">No hay proyectos para analizar aún.</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">Los reportes se generan automáticamente a medida que registres proyectos con costos e ingresos.</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="sticky top-0 bg-white dark:bg-zinc-900 z-10">
                <tr className="text-left text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
              <th className="py-2">Proyecto</th>
              <th className="py-2">Estado</th>
              <th className="py-2">Ingreso</th>
              <th className="py-2">Costo horas</th>
              <th className="py-2">Costo materiales</th>
              <th className="py-2">Costo real</th>
              <th className="py-2">Margen</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.projectId} className="border-b border-zinc-100 dark:border-zinc-800/60">
                <td className="py-2">
                  <p className="font-semibold">{row.projectCode}</p>
                  <p className="text-xs text-zinc-500">{row.projectName}</p>
                </td>
                <td className="py-2">{row.status}</td>
                <td className="py-2">{formatCLP(row.realRevenue)}</td>
                <td className="py-2">{formatCLP(row.laborCostClp)}</td>
                <td className="py-2">{formatCLP(row.materialCostClp)}</td>
                <td className="py-2">{formatCLP(row.realCost)}</td>
                <td className={`py-2 font-semibold ${row.marginPct >= 0 ? "text-emerald-600" : "text-red-600"}`}>{formatPercent(row.marginPct)}</td>
              </tr>
            ))}
          </tbody>
        </table>        </div>        )}
      </div>
    </div>
  );
}
