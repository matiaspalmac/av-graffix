"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export function ContactsListInput({
    initialContacts = []
}: {
    initialContacts?: { id?: number; name: string; phone?: string | null; email?: string | null }[]
}) {
    const [rows, setRows] = useState<{ id: string; dbId?: number; name: string; phone: string; email: string }[]>(
        initialContacts.length > 0
            ? initialContacts.map(c => ({
                id: Math.random().toString(36).slice(2),
                dbId: c.id,
                name: c.name,
                phone: c.phone || "",
                email: c.email || ""
            }))
            : [{ id: Math.random().toString(36).slice(2), name: "", phone: "", email: "" }]
    );

    const addRow = () => {
        setRows([...rows, { id: Math.random().toString(36).slice(2), name: "", phone: "", email: "" }]);
    };

    const removeRow = (id: string) => {
        setRows(rows.filter((row) => row.id !== id));
    };

    return (
        <div className="space-y-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-3.5 w-1 bg-amber-600 rounded-full"></div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Contactos</h4>
                </div>
                <button
                    type="button"
                    onClick={addRow}
                    className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
                >
                    <Plus className="w-3.5 h-3.5" />
                    AGREGAR CONTACTO
                </button>
            </div>

            <div className="space-y-4">
                {rows.map((row, index) => (
                    <div key={row.id} className="relative group p-4 sm:p-0 rounded-2xl bg-zinc-50 sm:bg-transparent dark:bg-zinc-900/40 sm:dark:bg-transparent border border-zinc-200 sm:border-0 dark:border-zinc-800 sm:dark:border-0 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
                            <div className="flex-none pb-2 hidden sm:block">
                                <button
                                    type="button"
                                    onClick={() => removeRow(row.id)}
                                    className="p-2.5 rounded-xl bg-white text-zinc-400 border border-zinc-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-red-900/20 transition-all shadow-sm"
                                    title="Eliminar fila"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 w-full">
                                <div className="sm:hidden absolute top-3 right-3">
                                    <button
                                        type="button"
                                        onClick={() => removeRow(row.id)}
                                        className="p-2 rounded-lg text-zinc-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <input type="hidden" name="contactId" value={row.dbId || ""} />
                                <label className="grid gap-1 text-sm">
                                    <span className="text-zinc-600 dark:text-zinc-300">Nombre Completo #{index + 1}</span>
                                    <input
                                        name="contactName"
                                        defaultValue={row.name}
                                        placeholder="Ej: Juan Pérez"
                                        required
                                        className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-brand-500/20 transition-all w-full"
                                    />
                                </label>
                                <label className="grid gap-1 text-sm">
                                    <span className="text-zinc-600 dark:text-zinc-300">Teléfono</span>
                                    <input
                                        name="contactPhone"
                                        defaultValue={row.phone}
                                        placeholder="+56 9 ..."
                                        className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-brand-500/20 transition-all w-full"
                                    />
                                </label>
                                <label className="grid gap-1 text-sm">
                                    <span className="text-zinc-600 dark:text-zinc-300">Correo Electrónico</span>
                                    <input
                                        name="contactEmail"
                                        type="email"
                                        defaultValue={row.email}
                                        placeholder="contacto@empresa.cl"
                                        className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-brand-500/20 transition-all w-full"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                ))}

                {rows.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl bg-zinc-50/30 dark:bg-zinc-900/20">
                        <p className="text-sm text-zinc-400 font-medium">No hay contactos registrados. Pulsa "Agregar Contacto" para comenzar.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
