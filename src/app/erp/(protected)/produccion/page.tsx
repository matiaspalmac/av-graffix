import { sql } from "drizzle-orm";
import { ModuleShell } from "@/components/erp/module-shell";
import { db } from "@/db/client";
import { materialConsumptions, projects, timesheets } from "@/db/schema";

export default async function ProduccionPage() {
  const [productionProjects, hoursEntries, consumptions] = await Promise.all([
    db.select({ v: sql<number>`count(*)` }).from(projects).where(sql`${projects.status} = 'in_progress'`),
    db.select({ v: sql<number>`count(*)` }).from(timesheets),
    db.select({ v: sql<number>`count(*)` }).from(materialConsumptions),
  ]);

  return (
    <ModuleShell
      title="Producción"
      description="Control de órdenes, tiempos y consumo real de materiales (m², ml, kg, rollos y unidades)."
      kpis={[
        { label: "Proyectos en producción", value: String(productionProjects[0]?.v ?? 0) },
        { label: "Registros de horas", value: String(hoursEntries[0]?.v ?? 0) },
        { label: "Registros de consumo", value: String(consumptions[0]?.v ?? 0) },
      ]}
    />
  );
}
