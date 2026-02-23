import { sql } from "drizzle-orm";
import { db } from "@/db/client";
import { materialConsumptions, projects, timesheets } from "@/db/schema";
import { formatCLP } from "@/lib/format";
import {
  createConsumptionAction,
  deleteConsumptionAction,
  latestConsumptions,
  productionOptions,
  updateProjectStatusAction,
} from "@/app/erp/(protected)/produccion/actions";

export default async function ProduccionPage() {
  const [productionProjects, hoursEntries, consumptions] = await Promise.all([
    db.select({ v: sql<number>`count(*)` }).from(projects).where(sql`${projects.status} = 'in_progress'`),
    db.select({ v: sql<number>`count(*)` }).from(timesheets),
    db.select({ v: sql<number>`count(*)` }).from(materialConsumptions),
  ]);

  const [{ projectOptions, materialOptions }, recentConsumptions] = await Promise.all([
    productionOptions(),
    latestConsumptions(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">Producción</h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">Registro de consumos reales con merma y costo automático en CLP.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Proyectos en producción</p>
          <p className="mt-2 text-2xl font-black">{String(productionProjects[0]?.v ?? 0)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Registros de horas</p>
          <p className="mt-2 text-2xl font-black">{String(hoursEntries[0]?.v ?? 0)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Consumos registrados</p>
          <p className="mt-2 text-2xl font-black">{String(consumptions[0]?.v ?? 0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <form action={createConsumptionAction} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
          <h3 className="text-lg font-bold">Registrar consumo</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select name="projectId" required className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
              <option value="">Proyecto</option>
              {projectOptions.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
            <select name="materialId" required className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
              <option value="">Material</option>
              {materialOptions.map((material) => (
                <option key={material.id} value={material.id}>{material.name} ({material.unit})</option>
              ))}
            </select>
            <input name="qtyPlanned" type="number" step="0.01" defaultValue="0" placeholder="Cantidad planificada" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            <input name="qtyUsed" type="number" step="0.01" defaultValue="0" required placeholder="Cantidad usada" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            <input name="wastePct" type="number" step="0.01" defaultValue="0" placeholder="Merma %" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            <input name="notes" placeholder="Notas" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
          </div>
          <button className="rounded-xl bg-brand-600 text-white px-4 py-2 font-semibold">Guardar consumo</button>
        </form>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
          <h3 className="text-lg font-bold">Estado de proyectos</h3>
          {projectOptions.length === 0 ? (
            <p className="text-sm text-zinc-500">No hay proyectos activos.</p>
          ) : (
            projectOptions.map((project) => (
              <form key={project.id} action={updateProjectStatusAction} className="flex items-center gap-2">
                <input type="hidden" name="projectId" value={project.id} />
                <p className="flex-1 text-sm font-medium">{project.name}</p>
                <select name="status" defaultValue={project.status} className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1 text-sm">
                  <option value="planning">Planning</option>
                  <option value="in_progress">En progreso</option>
                  <option value="on_hold">Pausado</option>
                  <option value="delivered">Entregado</option>
                </select>
                <button className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-2 py-1 text-sm">Guardar</button>
              </form>
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 overflow-auto">
        <h3 className="text-lg font-bold">Consumos recientes</h3>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
              <th className="py-2">Fecha</th>
              <th className="py-2">Proyecto</th>
              <th className="py-2">Material</th>
              <th className="py-2">Cantidad</th>
              <th className="py-2">Merma %</th>
              <th className="py-2">Costo CLP</th>
              <th className="py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {recentConsumptions.map((entry) => (
              <tr key={entry.id} className="border-b border-zinc-100 dark:border-zinc-800/60">
                <td className="py-2">{new Date(entry.consumptionDate).toLocaleDateString("es-CL")}</td>
                <td className="py-2">{entry.projectName ?? "-"}</td>
                <td className="py-2">{entry.materialName ?? "-"}</td>
                <td className="py-2">{entry.qtyUsed.toFixed(2)}</td>
                <td className="py-2">{entry.wastePct.toFixed(2)}%</td>
                <td className="py-2">{formatCLP(entry.totalCostClp)}</td>
                <td className="py-2">
                  <form action={deleteConsumptionAction}>
                    <input type="hidden" name="consumptionId" value={entry.id} />
                    <button className="rounded-lg border border-red-200 text-red-700 dark:border-red-900/40 dark:text-red-300 px-2 py-1">Eliminar</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
