"use client";

import { useRef } from "react";
import { SubmitButton } from "./submit-button";

interface ExpenseFormProps {
    projectOptions: Array<{ id: number; name: string }>;
    createAction: (formData: FormData) => Promise<void>;
}

export function ExpenseForm({ projectOptions, createAction }: ExpenseFormProps) {
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <form
            ref={formRef}
            action={async (formData) => {
                await createAction(formData);
                formRef.current?.reset();
            }}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Registrar Gasto Extra</h3>
                <span className="text-xs text-zinc-500">Boletas, peajes, colaciones</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="grid gap-1.5 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400 font-medium">Proyecto (Opcional)</span>
                    <select
                        name="projectId"
                        className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                    >
                        <option value="">Gasto General (Sin Proyecto)</option>
                        {projectOptions.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </label>

                <label className="grid gap-1.5 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400 font-medium">Categoría</span>
                    <select
                        name="category"
                        required
                        className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                    >
                        <option value="Peaje">Peaje</option>
                        <option value="Comida">Comida / Colación</option>
                        <option value="Bencina">Bencina / Combustible</option>
                        <option value="Estacionamiento">Estacionamiento</option>
                        <option value="Materiales Varios">Materiales Varios</option>
                        <option value="Otros">Otros</option>
                    </select>
                </label>

                <label className="grid gap-1.5 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400 font-medium">Monto (CLP)</span>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                        <input
                            name="amountClp"
                            type="number"
                            required
                            min="1"
                            placeholder="0"
                            className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent pl-8 pr-3 py-2 focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                        />
                    </div>
                </label>

                <label className="grid gap-1.5 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400 font-medium">Fecha</span>
                    <input
                        name="expenseDate"
                        type="date"
                        required
                        defaultValue={new Date().toISOString().split("T")[0]}
                        className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                    />
                </label>

                <label className="grid gap-1.5 text-sm md:col-span-2">
                    <span className="text-zinc-600 dark:text-zinc-400 font-medium">Descripción / Detalle</span>
                    <input
                        name="description"
                        required
                        placeholder="Ej: Peaje Ruta 68 - Camión 2"
                        className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                    />
                </label>
            </div>

            <div className="pt-2">
                <SubmitButton className="w-full">Guardar Gasto</SubmitButton>
            </div>
        </form>
    );
}
