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
        <div className="sm:col-span-2 lg:col-span-3 space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Contactos</h4>
                <button
                    type="button"
                    onClick={addRow}
                    className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
                >
                    <Plus className="w-3.5 h-3.5" />
                    AGREGAR CONTACTO
                </button>
            </div>

            <div className="space-y-3">
                {rows.map((row, index) => (
                    <div key={row.id} className="flex flex-col sm:flex-row items-start sm:items-end gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="flex-none pb-2 hidden sm:block">
                            <button
                                type="button"
                                onClick={() => removeRow(row.id)}
                                className="p-2 rounded-full bg-zinc-50 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:bg-zinc-900/50 dark:hover:bg-red-900/20 transition-colors"
                                title="Eliminar fila"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 w-full">
                            <input type="hidden" name="contactId" value={row.dbId || ""} />
                            <label className="grid gap-1 text-[10px] uppercase font-bold text-zinc-400">
                                <span>Nombre</span>
                                <input
                                    name="contactName"
                                    defaultValue={row.name}
                                    placeholder="Ej: Juan Pérez"
                                    required
                                    className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100"
                                />
                            </label>
                            <label className="grid gap-1 text-[10px] uppercase font-bold text-zinc-400">
                                <span>Teléfono</span>
                                <input
                                    name="contactPhone"
                                    defaultValue={row.phone}
                                    placeholder="+56 9 ..."
                                    className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100"
                                />
                            </label>
                            <label className="grid gap-1 text-[10px] uppercase font-bold text-zinc-400">
                                <span>Email</span>
                                <input
                                    name="contactEmail"
                                    type="email"
                                    defaultValue={row.email}
                                    placeholder="contacto@empresa.cl"
                                    className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100"
                                />
                            </label>
                        </div>

                        <div className="sm:hidden w-full flex justify-end">
                            <button
                                type="button"
                                onClick={() => removeRow(row.id)}
                                className="text-xs text-red-600 font-medium py-1 px-2"
                            >
                                Quitar contacto
                            </button>
                        </div>
                    </div>
                ))}

                {rows.length === 0 && (
                    <div className="text-center py-6 border-2 border-dashed border-zinc-100 dark:border-zinc-800/50 rounded-2xl">
                        <p className="text-sm text-zinc-500 italic">No hay contactos definidos. Usa el botón superior para agregar uno.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
