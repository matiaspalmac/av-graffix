import { auth } from "@/auth";
import { formatCLP } from "@/lib/format";
import {
    createExpenseAction,
    deleteExpenseAction,
    expenseFormOptions,
    latestExpenses,
    updateExpenseStatusAction,
} from "./actions";
import { ExpenseForm } from "@/components/erp/expense-form";
import { ExpenseStatusSelect } from "@/components/erp/expense-status-select";
import { SubmitButton } from "@/components/erp/submit-button";

export default async function GastosPage() {
    const session = await auth();
    const isAdmin = session?.user?.role === "admin";

    const [options, expenses] = await Promise.all([
        expenseFormOptions(),
        latestExpenses(),
    ]);

    const { projectOptions } = options;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">Gastos Extras</h2>
                <p className="mt-1 text-zinc-600 dark:text-zinc-400">Control de peajes, comida, combustible y gastos menores de terreno.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-1">
                    <ExpenseForm
                        projectOptions={projectOptions}
                        createAction={createExpenseAction}
                    />
                </div>

                <div className="xl:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                    <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
                        <h3 className="font-bold">Listado de Gastos</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-zinc-500 border-b border-zinc-100 dark:border-zinc-800">
                                    <th className="px-6 py-3 font-semibold">Fecha</th>
                                    <th className="px-6 py-3 font-semibold">Proyecto</th>
                                    <th className="px-6 py-3 font-semibold">Descripción</th>
                                    <th className="px-6 py-3 font-semibold">Monto</th>
                                    <th className="px-6 py-3 font-semibold">Estado</th>
                                    <th className="px-6 py-3 font-semibold text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                                {expenses.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                                            No hay gastos registrados aún.
                                        </td>
                                    </tr>
                                ) : (
                                    expenses.map((expense) => (
                                        <tr key={expense.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-zinc-600 dark:text-zinc-400">
                                                {new Date(expense.expenseDate).toLocaleDateString("es-CL")}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-zinc-900 dark:text-zinc-100">{expense.projectName ?? "General"}</div>
                                                <div className="text-xs text-zinc-400">{expense.userName}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 mr-2 uppercase tracking-tight">
                                                    {expense.category}
                                                </span>
                                                <div className="mt-1 line-clamp-1" title={expense.description}>{expense.description}</div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-zinc-900 dark:text-zinc-100">
                                                {formatCLP(expense.amountClp)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <ExpenseStatusSelect
                                                    expenseId={expense.id}
                                                    currentStatus={expense.status}
                                                    isAdmin={isAdmin}
                                                    updateAction={updateExpenseStatusAction}
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <form action={deleteExpenseAction}>
                                                    <input type="hidden" name="expenseId" value={expense.id} />
                                                    <button className="text-zinc-400 hover:text-red-600 transition-colors p-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
