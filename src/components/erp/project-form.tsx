"use client";

import { useState } from "react";
import { SubmitButton } from "@/components/erp/submit-button";

interface ClientOption {
    id: number;
    tradeName: string;
}

interface QuoteOption {
    id: number;
    quoteNumber: string;
    clientId: number;
}

interface ProjectFormProps {
    clientOptions: ClientOption[];
    quoteOptions: QuoteOption[];
    createAction: (formData: FormData) => Promise<void>;
}

export function ProjectForm({ clientOptions, quoteOptions, createAction }: ProjectFormProps) {
    const [selectedClientId, setSelectedClientId] = useState<string>("");

    // Filter quotes based on selected client
    const filteredQuotes = selectedClientId
        ? quoteOptions.filter(q => q.clientId.toString() === selectedClientId)
        : [];

    return (
        <form action={createAction} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
            <h3 className="text-lg font-bold">Nuevo proyecto</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                <label className="grid gap-1 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-300">Cliente</span>
                    <select
                        name="clientId"
                        required
                        value={selectedClientId}
                        onChange={(e) => setSelectedClientId(e.target.value)}
                        className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all"
                    >
                        <option value="">Selecciona cliente</option>
                        {clientOptions.map((client) => (
                            <option key={client.id} value={client.id}>{client.tradeName}</option>
                        ))}
                    </select>
                </label>

                <label className="grid gap-1 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-300">Cotización (opcional)</span>
                    <select
                        name="quoteId"
                        className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all disabled:opacity-50"
                        disabled={!selectedClientId}
                    >
                        <option value="">{selectedClientId ? "Selecciona cotización" : "Selecciona cliente primero"}</option>
                        {filteredQuotes.map((quote) => (
                            <option key={quote.id} value={quote.id}>{quote.quoteNumber}</option>
                        ))}
                    </select>
                    {selectedClientId && filteredQuotes.length === 0 && (
                        <p className="text-[10px] text-orange-600 dark:text-orange-400 mt-0.5">⚠️ No hay cotizaciones aprobadas/enviadas para este cliente.</p>
                    )}
                </label>

                <label className="grid gap-1 text-sm xl:col-span-2">
                    <span className="text-zinc-600 dark:text-zinc-300">Nombre proyecto</span>
                    <input name="name" required placeholder="Ej: Diseño packaging" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                </label>

                <label className="grid gap-1 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-300">Tipo de servicio</span>
                    <input name="serviceType" required placeholder="Ej: Diseño gráfico" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                </label>

                <label className="grid gap-1 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-300">Fecha inicio</span>
                    <input name="startDate" type="date" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                </label>

                <label className="grid gap-1 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-300">Fecha vencimiento</span>
                    <input name="dueDate" type="date" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                </label>

                <label className="grid gap-1 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-300">Estado</span>
                    <select name="status" defaultValue="planning" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all">
                        <option value="planning">Planning</option>
                        <option value="in_progress">En progreso</option>
                        <option value="delivered">Entregado</option>
                    </select>
                </label>

                <label className="grid gap-1 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-300">Prioridad</span>
                    <select name="priority" defaultValue="normal" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all">
                        <option value="low">Baja</option>
                        <option value="normal">Normal</option>
                        <option value="high">Alta</option>
                    </select>
                </label>

                <label className="grid gap-1 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-300">Ingreso estimado CLP</span>
                    <input name="budgetRevenueClp" type="number" step="1" defaultValue="0" placeholder="0" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                </label>

                <label className="grid gap-1 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-300">Costo estimado CLP</span>
                    <input name="budgetCostClp" type="number" step="1" defaultValue="0" placeholder="0" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                </label>
            </div>
            <SubmitButton>Crear proyecto</SubmitButton>
        </form>
    );
}
