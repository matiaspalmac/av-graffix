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
    <div className="grid gap-1 text-sm">
      <label className="grid gap-1 text-sm">
        <span className="text-zinc-600 dark:text-zinc-300">Superficie</span>
        <select
          name="surfaceType"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
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
        <label className="grid gap-1 text-sm mt-2">
          <span className="text-zinc-600 dark:text-zinc-300">Especifique tipo de superficie</span>
          <input
            name="surfaceTypeOther"
            placeholder="Describe la superficie..."
            className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
          />
        </label>
      )}
    </div>
  );
}
