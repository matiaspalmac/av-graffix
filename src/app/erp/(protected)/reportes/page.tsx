import { sql } from "drizzle-orm";
import { ModuleShell } from "@/components/erp/module-shell";
import { db } from "@/db/client";
import { materialConsumptions, projects, timesheets } from "@/db/schema";
import { formatCLP } from "@/lib/format";

export default async function ReportesPage() {
  const [projectCount, laborCost, materialCost] = await Promise.all([
    db.select({ v: sql<number>`count(*)` }).from(projects),
    db.select({ v: sql<number>`coalesce(sum(${timesheets.totalCostClp}),0)` }).from(timesheets),
    db.select({ v: sql<number>`coalesce(sum(${materialConsumptions.totalCostClp}),0)` }).from(materialConsumptions),
  ]);

  return (
    <ModuleShell
      title="Reportes & Rentabilidad"
      description="Análisis de costo real por proyecto: horas equipo + materiales consumidos."
      kpis={[
        { label: "Proyectos analizados", value: String(projectCount[0]?.v ?? 0) },
        { label: "Costo mano de obra", value: formatCLP(Number(laborCost[0]?.v ?? 0)) },
        { label: "Costo materiales", value: formatCLP(Number(materialCost[0]?.v ?? 0)) },
      ]}
    />
  );
}
