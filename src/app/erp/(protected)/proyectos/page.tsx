import { sql } from "drizzle-orm";
import { db } from "@/db/client";
import { projectPhases, projects, tasks } from "@/db/schema";
import { formatCLP, formatPercent } from "@/lib/format";
import {
  archiveProjectAction,
  createProjectAction,
  latestProjects,
  projectFormOptions,
  updateProjectAction,
} from "@/app/erp/(protected)/proyectos/actions";

export default async function ProyectosPage() {
  const [activeProjects, activePhases, openTasks] = await Promise.all([
    db.select({ v: sql<number>`count(*)` }).from(projects).where(sql`${projects.status} in ('planning','in_progress')`),
    db.select({ v: sql<number>`count(*)` }).from(projectPhases).where(sql`${projectPhases.status} in ('pending','in_progress')`),
    db.select({ v: sql<number>`count(*)` }).from(tasks).where(sql`${tasks.status} in ('todo','in_progress')`),
  ]);

  const [{ clientOptions, quoteOptions }, projectList] = await Promise.all([projectFormOptions(), latestProjects()]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">Proyectos</h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">Control de proyectos de diseño y producción con margen esperado en CLP.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Proyectos activos</p>
          <p className="mt-2 text-2xl font-black">{String(activeProjects[0]?.v ?? 0)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Fases en curso</p>
          <p className="mt-2 text-2xl font-black">{String(activePhases[0]?.v ?? 0)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Tareas abiertas</p>
          <p className="mt-2 text-2xl font-black">{String(openTasks[0]?.v ?? 0)}</p>
        </div>
      </div>

      <form action={createProjectAction} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
        <h3 className="text-lg font-bold">Nuevo proyecto</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <select name="clientId" required className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
            <option value="">Cliente</option>
            {clientOptions.map((client) => (
              <option key={client.id} value={client.id}>{client.tradeName}</option>
            ))}
          </select>
          <select name="quoteId" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
            <option value="">Cotización aprobada (opcional)</option>
            {quoteOptions.map((quote) => (
              <option key={quote.id} value={quote.id}>{quote.quoteNumber}</option>
            ))}
          </select>
          <input name="name" required placeholder="Nombre proyecto" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 xl:col-span-2" />
          <input name="serviceType" required placeholder="Tipo servicio" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
          <input name="startDate" type="date" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
          <input name="dueDate" type="date" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
          <select name="status" defaultValue="planning" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
            <option value="planning">Planning</option>
            <option value="in_progress">En progreso</option>
            <option value="delivered">Entregado</option>
          </select>
          <select name="priority" defaultValue="normal" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
            <option value="low">Baja</option>
            <option value="normal">Normal</option>
            <option value="high">Alta</option>
          </select>
          <input name="budgetRevenueClp" type="number" step="1" defaultValue="0" placeholder="Ingreso estimado CLP" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
          <input name="budgetCostClp" type="number" step="1" defaultValue="0" placeholder="Costo estimado CLP" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
        </div>
        <button className="rounded-xl bg-brand-600 text-white px-4 py-2 font-semibold">Crear proyecto</button>
      </form>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 overflow-auto">
        <h3 className="text-lg font-bold">Proyectos recientes</h3>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
              <th className="py-2">Código</th>
              <th className="py-2">Proyecto</th>
              <th className="py-2">Cliente</th>
              <th className="py-2">Estado</th>
              <th className="py-2">Presupuesto</th>
              <th className="py-2">Margen</th>
              <th className="py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {projectList.map((project) => (
              <tr key={project.id} className="border-b border-zinc-100 dark:border-zinc-800/60 align-top">
                <td className="py-2 font-semibold">{project.code}</td>
                <td className="py-2">
                  <p className="font-medium">{project.name}</p>
                  <p className="text-xs text-zinc-500">{project.serviceType}</p>
                </td>
                <td className="py-2">{project.clientName ?? "-"}</td>
                <td className="py-2">{project.status}</td>
                <td className="py-2">{formatCLP(project.budgetRevenueClp)}</td>
                <td className="py-2">{formatPercent(project.expectedMarginPct)}</td>
                <td className="py-2 space-y-2 min-w-[260px]">
                  <form action={updateProjectAction} className="grid grid-cols-2 gap-2">
                    <input type="hidden" name="projectId" value={project.id} />
                    <select name="status" defaultValue={project.status} className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1">
                      <option value="planning">Planning</option>
                      <option value="in_progress">En progreso</option>
                      <option value="on_hold">Pausado</option>
                      <option value="delivered">Entregado</option>
                    </select>
                    <select name="priority" defaultValue={project.priority} className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1">
                      <option value="low">Baja</option>
                      <option value="normal">Normal</option>
                      <option value="high">Alta</option>
                    </select>
                    <input type="number" name="budgetRevenueClp" defaultValue={project.budgetRevenueClp} className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1" />
                    <input type="number" name="budgetCostClp" defaultValue={project.budgetCostClp} className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1" />
                    <input type="date" name="dueDate" defaultValue={project.dueDate ? String(project.dueDate).slice(0, 10) : ""} className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1" />
                    <button className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-2 py-1">Guardar</button>
                  </form>
                  <form action={archiveProjectAction}>
                    <input type="hidden" name="projectId" value={project.id} />
                    <button className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-2 py-1">Archivar</button>
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
