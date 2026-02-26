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
    <div className="space-y-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-1 bg-violet-600 rounded-full"></div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Medidas y Soporte</h4>
        </div>
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          AGREGAR MEDIDA
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

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 flex-1 w-full">
                <div className="sm:hidden absolute top-3 right-3">
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <label className="grid gap-1 text-sm sm:col-span-6">
                  <span className="text-zinc-600 dark:text-zinc-300">Descripción / Soporte #{index + 1}</span>
                  <input
                    name="measureSupport"
                    required
                    placeholder="Ej: Placa de PVC 3mm, Letrero Frontlight..."
                    className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-brand-500/20 transition-all w-full"
                  />
                </label>

                <div className="grid grid-cols-3 gap-3 sm:col-span-6">
                  <label className="grid gap-1 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-300">Ancho</span>
                    <input
                      name="measureWidth"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-brand-500/20 transition-all w-full"
                    />
                  </label>
                  <label className="grid gap-1 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-300">Alto</span>
                    <input
                      name="measureHeight"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-brand-500/20 transition-all w-full"
                    />
                  </label>
                  <label className="grid gap-1 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-300">Prof.</span>
                    <input
                      name="measureDepth"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-brand-500/20 transition-all w-full"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <label className="grid gap-1 text-sm mt-4">
        <span className="text-zinc-600 dark:text-zinc-300">Observaciones de Medidas</span>
        <textarea name="measurementsObservations" rows={2} placeholder="Detalles de cortes, terminaciones, etc." className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all" />
      </label>
    </div>
  );
}
