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
  exportProjectsExcelAction,
} from "@/app/erp/(protected)/proyectos/actions";
import { SubmitButton } from "@/components/erp/submit-button";
import { ExportButton } from "@/components/erp/export-button";
import { ProjectForm } from "@/components/erp/project-form";

type TechnicalSheet = {
  general?: { siteContact?: string; sitePhone?: string; technician?: string; date?: string };
  jobSpecs?: {
    workTypes?: string[];
    workTypeOther?: string;
    locationType?: string;
    installHeightMeters?: number;
    vehicleAccess?: boolean;
    trafficLevel?: string;
    environmentNotes?: string;
  };
  measurements?: {
    items?: Array<{ row: number; support: string; width: number; height: number; depth: number }>;
    surfaceType?: string;
    surfaceTypeOther?: string;
    surfaceCondition?: string;
    observations?: string;
  };
  technicalConditions?: {
    requirements?: string[];
    mountType?: string;
    estimatedPersonnel?: number;
    estimatedTimeHours?: number;
    prePreparationRequired?: boolean;
  };
  logistics?: {
    specialSchedule?: boolean;
    permitsRequired?: boolean;
    clientManagesPermits?: boolean;
    observations?: string;
  };
};

function parseTechnicalSheet(rawSpecs: string | null | undefined): TechnicalSheet | null {
  if (!rawSpecs) {
    return null;
  }

  try {
    return JSON.parse(rawSpecs) as TechnicalSheet;
  } catch {
    return null;
  }
}

import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = 'force-dynamic';
export default async function ProyectosPage() {
  const [activeProjects, activePhases, openTasks] = await Promise.all([
    db.select({ v: sql<number>`count(*)` }).from(projects).where(sql`${projects.status} in ('planning','in_progress')`),
    db.select({ v: sql<number>`count(*)` }).from(projectPhases).where(sql`${projectPhases.status} in ('pending','in_progress')`),
    db.select({ v: sql<number>`count(*)` }).from(tasks).where(sql`${tasks.status} in ('todo','in_progress')`),
  ]);

  const [{ clientOptions, quoteOptions }, projectList] = await Promise.all([projectFormOptions(), latestProjects()]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">Proyectos</h2>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">Control de proyectos de diseño y producción con margen esperado en CLP.</p>
        </div>
        {projectList.length > 0 && (
          <ExportButton
            action={exportProjectsExcelAction}
            label="Exportar Excel"
            variant="primary"
            size="md"
          />
        )}
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

      <ProjectForm
        clientOptions={clientOptions}
        quoteOptions={quoteOptions as any}
        createAction={createProjectAction}
      />

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 overflow-auto">
        <h3 className="text-lg font-bold mb-4">Proyectos recientes</h3>
        {projectList.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-zinc-500 dark:text-zinc-400">No hay proyectos registrados aún.</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">Crea tu primer proyecto usando el formulario de arriba.</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-sm min-w-[1000px]">
              <thead className="sticky top-0 bg-white dark:bg-zinc-900 z-10">
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
                {projectList.map((project) => {
                  const technicalSheet = parseTechnicalSheet(project.technicalSheetJson);

                  return (
                    <tr key={project.id} className="border-b border-zinc-100 dark:border-zinc-800/60 align-top">
                      <td className="py-2 font-semibold">{project.code}</td>
                      <td className="py-2">
                        <p className="font-medium">{project.name}</p>
                        <p className="text-xs text-zinc-500">{project.serviceType}</p>
                        {technicalSheet && (
                          <details className="mt-2 text-xs">
                            <summary className="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline">
                              Ver ficha técnica
                            </summary>
                            <div className="mt-2 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-900/50 space-y-2">
                              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-zinc-600 dark:text-zinc-400">
                                {technicalSheet.general?.siteContact && (
                                  <p><strong>Contacto:</strong> {technicalSheet.general.siteContact}</p>
                                )}
                                {technicalSheet.general?.sitePhone && (
                                  <p><strong>Teléfono:</strong> {technicalSheet.general.sitePhone}</p>
                                )}
                                {technicalSheet.general?.technician && (
                                  <p><strong>Técnico:</strong> {technicalSheet.general.technician}</p>
                                )}
                                {technicalSheet.jobSpecs?.workTypes && technicalSheet.jobSpecs.workTypes.length > 0 && (
                                  <p className="col-span-2"><strong>Tipos de trabajo:</strong> {technicalSheet.jobSpecs.workTypes.join(", ")}</p>
                                )}
                                {technicalSheet.jobSpecs?.workTypeOther && (
                                  <p className="col-span-2"><strong>Otro tipo:</strong> {technicalSheet.jobSpecs.workTypeOther}</p>
                                )}
                                {technicalSheet.jobSpecs?.locationType && (
                                  <p><strong>Tipo lugar:</strong> {technicalSheet.jobSpecs.locationType}</p>
                                )}
                                {technicalSheet.jobSpecs?.installHeightMeters != null && (
                                  <p><strong>Altura:</strong> {technicalSheet.jobSpecs.installHeightMeters} m</p>
                                )}
                                {technicalSheet.jobSpecs?.vehicleAccess != null && (
                                  <p><strong>Acceso vehicular:</strong> {technicalSheet.jobSpecs.vehicleAccess ? "Sí" : "No"}</p>
                                )}
                                {technicalSheet.jobSpecs?.trafficLevel && (
                                  <p><strong>Tránsito:</strong> {technicalSheet.jobSpecs.trafficLevel}</p>
                                )}
                                {technicalSheet.measurements?.surfaceType && (
                                  <p><strong>Superficie:</strong> {technicalSheet.measurements.surfaceType}</p>
                                )}
                                {technicalSheet.measurements?.surfaceTypeOther && (
                                  <p className="col-span-2"><strong>Otro tipo superficie:</strong> {technicalSheet.measurements.surfaceTypeOther}</p>
                                )}
                                {technicalSheet.measurements?.surfaceCondition && (
                                  <p><strong>Estado:</strong> {technicalSheet.measurements.surfaceCondition}</p>
                                )}
                                {technicalSheet.technicalConditions?.requirements && technicalSheet.technicalConditions.requirements.length > 0 && (
                                  <p className="col-span-2"><strong>Requerimientos:</strong> {technicalSheet.technicalConditions.requirements.join(", ")}</p>
                                )}
                                {technicalSheet.technicalConditions?.estimatedPersonnel != null && (
                                  <p><strong>Personal:</strong> {technicalSheet.technicalConditions.estimatedPersonnel}</p>
                                )}
                                {technicalSheet.technicalConditions?.estimatedTimeHours != null && (
                                  <p><strong>Tiempo:</strong> {technicalSheet.technicalConditions.estimatedTimeHours} h</p>
                                )}
                              </div>
                              {technicalSheet.measurements?.items && technicalSheet.measurements.items.length > 0 && (
                                <div>
                                  <p className="font-semibold mb-1">Medidas:</p>
                                  {technicalSheet.measurements.items.map((m) => (
                                    <p key={m.row} className="text-xs text-zinc-600 dark:text-zinc-400">
                                      #{m.row}: {m.support || "-"} - {m.width}×{m.height}×{m.depth}
                                    </p>
                                  ))}
                                </div>
                              )}
                              {(technicalSheet.jobSpecs?.environmentNotes || technicalSheet.measurements?.observations || technicalSheet.logistics?.observations) && (
                                <div className="space-y-1">
                                  {technicalSheet.jobSpecs?.environmentNotes && (
                                    <p className="text-xs"><strong>Obs. entorno:</strong> {technicalSheet.jobSpecs.environmentNotes}</p>
                                  )}
                                  {technicalSheet.measurements?.observations && (
                                    <p className="text-xs"><strong>Obs. medidas:</strong> {technicalSheet.measurements.observations}</p>
                                  )}
                                  {technicalSheet.logistics?.observations && (
                                    <p className="text-xs"><strong>Obs. logística:</strong> {technicalSheet.logistics.observations}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          </details>
                        )}
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
                          <SubmitButton className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-2 py-1 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">Guardar</SubmitButton>
                        </form>
                        <form action={archiveProjectAction}>
                          <input type="hidden" name="projectId" value={project.id} />
                          <SubmitButton className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-2 py-1 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">Archivar</SubmitButton>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>        </div>)}
      </div>
    </div>
  );
}
