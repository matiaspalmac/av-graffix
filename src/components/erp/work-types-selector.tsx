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
    <fieldset className="sm:col-span-2 rounded-xl border border-zinc-200 dark:border-zinc-800 p-3">
      <legend className="px-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200">Tipo de trabajo</legend>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {WORK_TYPES.map((workType) => (
          <label key={workType} className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              name="workTypes"
              value={workType}
              className="rounded border-zinc-300 dark:border-zinc-700"
              onChange={(e) => handleCheckboxChange(workType, e.target.checked)}
            />
            <span className="text-xs">{workType}</span>
          </label>
        ))}
      </div>
      {selectedTypes.has("Otros") && (
        <div className="mt-3">
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-300">Especifique otro tipo de trabajo</span>
            <input
              name="workTypeOther"
              placeholder="Describe el trabajo..."
              className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
            />
          </label>
        </div>
      )}
    </fieldset>
  );
}
