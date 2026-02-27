import { sql } from "drizzle-orm";
import { db } from "@/db/client";
import { materialConsumptions, projects, timesheets } from "@/db/schema";
import { formatCLP } from "@/lib/format";
import {
  createConsumptionAction,
  createWorkOrderAction,
  deleteConsumptionAction,
  deleteWorkOrderAction,
  latestConsumptions,
  latestWorkOrders,
  productionOptions,
  updateProjectStatusAction,
  updateWorkOrderStatusAction,
} from "@/app/erp/(protected)/produccion/actions";
import { SubmitButton } from "@/components/erp/submit-button";
import { WorkOrderForm } from "@/components/erp/work-order-form";
import { WorkOrderStatusSelect } from "@/components/erp/work-order-status-select";

export default async function ProduccionPage() {
  const [productionProjects, hoursEntries, consumptions] = await Promise.all([
    db.select({ v: sql<number>`count(*)` }).from(projects).where(sql`${projects.status} = 'in_progress'`),
    db.select({ v: sql<number>`count(*)` }).from(timesheets),
    db.select({ v: sql<number>`count(*)` }).from(materialConsumptions),
  ]);

  const [options, recentConsumptions, recentWorkOrders] = await Promise.all([
    productionOptions(),
    latestConsumptions(),
    latestWorkOrders(),
  ]);

  const { projectOptions, materialOptions, operatorOptions } = options;

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
        <WorkOrderForm
          projectOptions={projectOptions as any}
          operatorOptions={operatorOptions}
          createAction={createWorkOrderAction}
        />

        <form action={createConsumptionAction} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
          <h3 className="text-lg font-bold">Registrar consumo</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Proyecto</span>
              <select name="projectId" required className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
                <option value="">Selecciona proyecto</option>
                {projectOptions.map((project) => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Material</span>
              <select name="materialId" required className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
                <option value="">Selecciona material</option>
                {materialOptions.map((material) => (
                  <option key={material.id} value={material.id}>{material.name} ({material.unit})</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Cantidad planificada</span>
              <input name="qtyPlanned" type="number" step="0.01" defaultValue="0" placeholder="0" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Cantidad usada</span>
              <input name="qtyUsed" type="number" step="0.01" defaultValue="0" required placeholder="0" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Merma (%)</span>
              <input name="wastePct" type="number" step="0.01" defaultValue="0" placeholder="0" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Notas</span>
              <input name="notes" placeholder="Ej: Fallo en máquina X" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
          </div>
          <SubmitButton>Guardar consumo</SubmitButton>
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
                <SubmitButton className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-2 py-1 text-sm transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">Guardar</SubmitButton>
              </form>
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 overflow-auto">
        <h3 className="text-lg font-bold mb-4">Órdenes de Trabajo recientes</h3>
        {recentWorkOrders.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">No hay órdenes de trabajo abiertas.</div>
        ) : (
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="text-left text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                  <th className="py-2">OT #</th>
                  <th className="py-2">Proyecto</th>
                  <th className="py-2">Descripción</th>
                  <th className="py-2">Operador</th>
                  <th className="py-2">Entrega</th>
                  <th className="py-2">Estado</th>
                  <th className="py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {recentWorkOrders.map((ot) => {
                  let technicalSheet = null;
                  if (ot.technicalSheet) {
                    try { technicalSheet = JSON.parse(ot.technicalSheet as string); } catch { }
                  }

                  return (
                    <tr key={ot.id} className="border-b border-zinc-100 dark:border-zinc-800/60 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
                      <td className="py-3 font-bold">{ot.orderNumber}</td>
                      <td className="py-3">
                        <div className="font-medium">{ot.projectName}</div>
                        {technicalSheet && (
                          <div className="text-[10px] text-zinc-500 mt-1 space-x-2">
                            <span>📍 {technicalSheet.jobSpecs?.locationType || "S/I"}</span>
                            <span>👷 {technicalSheet.technicalConditions?.estimatedPersonnel || 1}p</span>
                            <span>⏱️ {technicalSheet.technicalConditions?.estimatedTimeHours || 0}h</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="max-w-xs truncate" title={ot.description}>{ot.description}</div>
                        {technicalSheet?.logistics?.requiredPermits && (
                          <div className="text-[10px] text-orange-600 dark:text-orange-400 mt-0.5">⚠️ Permisos: {technicalSheet.logistics.requiredPermits}</div>
                        )}
                      </td>
                      <td className="py-3">{ot.operatorName ?? "Sin asignar"}</td>
                      <td className="py-3">{ot.dueDate ? new Date(ot.dueDate).toLocaleDateString("es-CL") : "-"}</td>
                      <td className="py-3">
                        <WorkOrderStatusSelect
                          workOrderId={ot.id}
                          currentStatus={ot.status}
                          updateAction={updateWorkOrderStatusAction}
                        />
                      </td>
                      <td className="py-3">
                        <form action={deleteWorkOrderAction}>
                          <input type="hidden" name="workOrderId" value={ot.id} />
                          <button className="text-zinc-400 hover:text-red-600 transition-colors p-1" title="Eliminar OT">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 overflow-auto">
        <h3 className="text-lg font-bold mb-4">Consumos recientes</h3>
        {recentConsumptions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-zinc-500 dark:text-zinc-400">No hay consumos de materiales registrados aún.</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">Registra el primer consumo usando el formulario de arriba.</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="sticky top-0 bg-white dark:bg-zinc-900 z-10">
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
                        <button className="rounded-lg border border-red-200 text-red-700 dark:border-red-900/40 dark:text-red-300 px-2 py-1 hover:bg-red-50 dark:hover:bg-red-900/20">Eliminar</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
