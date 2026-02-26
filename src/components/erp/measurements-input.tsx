"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export function MeasurementsInput() {
  const [rows, setRows] = useState<{ id: string }[]>([
    { id: Math.random().toString(36).slice(2) }
  ]);

  const addRow = () => {
    setRows([...rows, { id: Math.random().toString(36).slice(2) }]);
  };

  const removeRow = (id: string) => {
    if (rows.length === 1) return;
    setRows(rows.filter((row) => row.id !== id));
  };

  return (
    <div className="sm:col-span-2 space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Medidas y Soporte</h4>
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          AGREGAR MEDIDA
        </button>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
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

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 flex-1 w-full">
              <label className="grid gap-1 text-[10px] uppercase font-bold text-zinc-400 sm:col-span-6">
                <span>Descripción/Soporte</span>
                <input
                  name="measureSupport"
                  placeholder="Ej: placa, letrero..."
                  className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100"
                />
              </label>
              <label className="grid gap-1 text-[10px] uppercase font-bold text-zinc-400 sm:col-span-2">
                <span>Ancho</span>
                <input
                  name="measureWidth"
                  type="number"
                  step="0.01"
                  placeholder="0"
                  className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100"
                />
              </label>
              <label className="grid gap-1 text-[10px] uppercase font-bold text-zinc-400 sm:col-span-2">
                <span>Alto</span>
                <input
                  name="measureHeight"
                  type="number"
                  step="0.01"
                  placeholder="0"
                  className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100"
                />
              </label>
              <label className="grid gap-1 text-[10px] uppercase font-bold text-zinc-400 sm:col-span-2">
                <span>Prof.</span>
                <input
                  name="measureDepth"
                  type="number"
                  step="0.01"
                  placeholder="0"
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
                Quitar fila
              </button>
            </div>
          </div>
        ))}
      </div>

      <label className="grid gap-1 text-sm mt-4">
        <span className="text-zinc-600 dark:text-zinc-300">Observaciones de medidas</span>
        <textarea name="measurementsObservations" rows={2} className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
      </label>
    </div>
  );
}
