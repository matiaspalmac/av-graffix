"use client";

import { useState } from "react";

const SURFACE_TYPES = [
  "Hormigón",
  "Metal",
  "Vidrio",
  "Madera",
  "Muro cortina",
  "Otro",
];

export function SurfaceTypeSelector() {
  const [selectedType, setSelectedType] = useState("");

  return (
    <div className="space-y-3">
      <label className="grid gap-1 text-sm">
        <span className="text-zinc-600 dark:text-zinc-300">Superficie</span>
        <select
          name="surfaceType"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all"
        >
          <option value="">Selecciona</option>
          {SURFACE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      {selectedType === "Otro" && (
        <label className="grid gap-1 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <span className="text-zinc-600 dark:text-zinc-300">Especifique tipo de superficie</span>
          <input
            name="surfaceTypeOther"
            placeholder="Ej: Piedra, Fibra de vidrio..."
            className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
        </label>
      )}
    </div>
  );
}
