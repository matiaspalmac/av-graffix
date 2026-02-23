import { sql } from "drizzle-orm";
import { ModuleShell } from "@/components/erp/module-shell";
import { db } from "@/db/client";
import { projectPhases, projects, tasks } from "@/db/schema";

export default async function ProyectosPage() {
  const [activeProjects, activePhases, openTasks] = await Promise.all([
    db.select({ v: sql<number>`count(*)` }).from(projects).where(sql`${projects.status} in ('planning','in_progress')`),
    db.select({ v: sql<number>`count(*)` }).from(projectPhases).where(sql`${projectPhases.status} in ('pending','in_progress')`),
    db.select({ v: sql<number>`count(*)` }).from(tasks).where(sql`${tasks.status} in ('todo','in_progress')`),
  ]);

  return (
    <ModuleShell
      title="Proyectos"
      description="Gestión de briefs, fases y tareas para proyectos puntuales y retainers."
      kpis={[
        { label: "Proyectos activos", value: String(activeProjects[0]?.v ?? 0) },
        { label: "Fases en curso", value: String(activePhases[0]?.v ?? 0) },
        { label: "Tareas abiertas", value: String(openTasks[0]?.v ?? 0) },
      ]}
    />
  );
}
