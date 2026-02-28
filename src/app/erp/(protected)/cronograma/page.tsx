import { Suspense } from "react";
import { sql } from "drizzle-orm";
import { db } from "@/db/client";
import { projects, clients } from "@/db/schema";
import { GanttChart } from "@/components/erp/cronograma/gantt-chart";

export const dynamic = 'force-dynamic';

export default async function CronogramaPage() {
    const activeProjects = await db
        .select({
            id: projects.id,
            name: projects.name,
            status: projects.status,
            startDate: projects.startDate,
            dueDate: projects.dueDate,
            clientName: clients.tradeName,
        })
        .from(projects)
        .leftJoin(clients, sql`${projects.clientId} = ${clients.id}`)
        .where(sql`${projects.status} in ('planning', 'in_progress')`)
        .orderBy(sql`coalesce(${projects.startDate}, '9999-12-31') asc`);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1 mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">Cronograma de Producción</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Vista Gantt de todos los proyectos activos.</p>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                <Suspense fallback={
                    <div className="p-10 flex flex-col items-center justify-center space-y-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                        <p className="text-sm text-zinc-500">Cargando cronograma...</p>
                    </div>
                }>
                    <GanttChart projects={activeProjects} />
                </Suspense>
            </div>
        </div>
    );
}
