"use client";

import { useState } from "react";

const WORK_TYPES = [
  "Letrero ext.",
  "Letrero int.",
  "Gráfica muro",
  "Branding vehicular",
  "Tela / lona",
  "Señalética",
  "Empavonado esmerilado",
  "Empavonado impreso",
  "Vinilo adhesivo impreso",
  "Vinilo adhesivo de corte (Plotter)",
  "Roller/Pendon publicitario",
  "Fondo de prensa (backing publicitario)",
  "Lona mesh",
  "Letras, logos y figuras corpóreas (3D)",
  "Window Vision",
  "Flyer/Triptico publicitario",
  "Merch",
  "Merch Campaña",
  "Insumos internos",
  "Otros",
];

export function WorkTypesSelector() {
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());

  const handleCheckboxChange = (workType: string, checked: boolean) => {
    const newSet = new Set(selectedTypes);
    if (checked) {
      newSet.add(workType);
    } else {
      newSet.delete(workType);
    }
    setSelectedTypes(newSet);
  };

  return (
    <fieldset className="sm:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 bg-zinc-50/50 dark:bg-zinc-900/30">
      <legend className="px-3 py-1 text-[10px] font-bold uppercase bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full text-zinc-600 dark:text-zinc-300">Tipo de trabajo</legend>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
        {WORK_TYPES.map((workType) => (
          <label key={workType} className="inline-flex items-center gap-2.5 text-xs font-semibold cursor-pointer group">
            <input
              type="checkbox"
              name="workTypes"
              value={workType}
              className="w-4 h-4 rounded text-brand-600 border-zinc-300 dark:border-zinc-700 focus:ring-brand-500"
              onChange={(e) => handleCheckboxChange(workType, e.target.checked)}
            />
            <span className="group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">{workType}</span>
          </label>
        ))}
      </div>
      {selectedTypes.has("Otros") && (
        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-300">Especifique otro tipo de trabajo</span>
            <input
              name="workTypeOther"
              placeholder="Ej: Bordado, Grabado láser..."
              className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
          </label>
        </div>
      )}
    </fieldset>
  );
}
