import { sql } from "drizzle-orm";
import { db } from "@/db/client";
import { tasks } from "@/db/schema";
import { updateTaskStatusQuickAction } from "@/app/erp/(protected)/dashboard-actions";
import { auth } from "@/auth";

export async function MyWorkTasks() {
    const session = await auth();
    const currentUserId = Number(session?.user?.id ?? 0);

    const userTasks = currentUserId
        ? await db
            .select({
                id: tasks.id,
                title: tasks.title,
                status: tasks.status,
                dueAt: tasks.dueAt,
                priority: tasks.priority,
            })
            .from(tasks)
            .where(sql`${tasks.assigneeUserId} = ${currentUserId} and ${tasks.status} in ('todo','in_progress')`)
            .orderBy(sql`
          case ${tasks.priority}
            when 'high' then 1
            when 'normal' then 2
            else 3
          end,
          coalesce(${tasks.dueAt}, '9999-12-31') asc,
          ${tasks.id} desc
        `)
            .limit(8)
        : [];

    return (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Mi trabajo hoy</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Tareas asignadas para avanzar en operación diaria.</p>

            {userTasks.length === 0 ? (
                <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">No tienes tareas pendientes asignadas.</p>
            ) : (
                <div className="mt-4 space-y-2">
                    {userTasks.map((task) => (
                        <form key={task.id} action={updateTaskStatusQuickAction} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center rounded-xl border border-zinc-200 dark:border-zinc-800 p-3">
                            <input type="hidden" name="taskId" value={task.id} />
                            <div className="md:col-span-6">
                                <p className="font-medium text-zinc-900 dark:text-zinc-100">{task.title}</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    Prioridad: {task.priority ?? "normal"}
                                    {task.dueAt ? ` · Vence: ${new Date(task.dueAt).toLocaleDateString("es-CL")}` : ""}
                                </p>
                            </div>
                            <div className="md:col-span-4">
                                <select name="status" defaultValue={task.status} className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-2 text-sm">
                                    <option value="todo">Por hacer</option>
                                    <option value="in_progress">En progreso</option>
                                    <option value="done">Hecha</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <button className="w-full rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-2 py-2 text-sm font-semibold transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    ))}
                </div>
            )}
        </div>
    );
}
