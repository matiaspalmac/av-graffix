"use client";

import { useState } from "react";

type Measurement = {
  id: number;
  row: number;
};

export function MeasurementsInput() {
  const [measurements, setMeasurements] = useState<Measurement[]>([{ id: 1, row: 1 }]);
  const [nextId, setNextId] = useState(2);

  const addMeasurement = () => {
    if (measurements.length >= 10) return;
    
    const newRow = measurements.length + 1;
    setMeasurements([...measurements, { id: nextId, row: newRow }]);
    setNextId(nextId + 1);
  };

  const removeMeasurement = (id: number) => {
    if (measurements.length === 1) return; // Mantener al menos uno
    
    const filtered = measurements.filter((m) => m.id !== id);
    // Renumerar las filas
    const renumbered = filtered.map((m, index) => ({ ...m, row: index + 1 }));
    setMeasurements(renumbered);
  };

  return (
    <div className="sm:col-span-2 space-y-2 rounded-xl border border-zinc-200 dark:border-zinc-800 p-3">
      <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Medidas y Soporte</p>
      <div className="grid grid-cols-6 gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span>#</span>
        <span>Descripción/Soporte</span>
        <span>Ancho</span>
        <span>Alto</span>
        <span>Prof.</span>
        <span></span>
      </div>
      {measurements.map((measurement) => (
        <div key={measurement.id} className="grid grid-cols-6 gap-2">
          <span className="text-sm text-zinc-500 dark:text-zinc-400 py-2">#{measurement.row}</span>
          <input
            name={`measureSupport_${measurement.row}`}
            placeholder="Ej: placa, letrero..."
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1.5 text-sm"
          />
          <input
            name={`measureWidth_${measurement.row}`}
            type="number"
            step="0.01"
            placeholder="0"
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1.5"
          />
          <input
            name={`measureHeight_${measurement.row}`}
            type="number"
            step="0.01"
            placeholder="0"
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1.5"
          />
          <input
            name={`measureDepth_${measurement.row}`}
            type="number"
            step="0.01"
            placeholder="0"
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1.5"
          />
          {measurements.length > 1 && (
            <button
              type="button"
              onClick={() => removeMeasurement(measurement.id)}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs"
            >
              Quitar
            </button>
          )}
        </div>
      ))}
      {measurements.length < 10 && (
        <button
          type="button"
          onClick={addMeasurement}
          className="mt-2 rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          + Agregar medida
        </button>
      )}
      <label className="grid gap-1 text-sm mt-2">
        <span className="text-zinc-600 dark:text-zinc-300">Observaciones</span>
        <textarea name="measurementsObservations" rows={2} className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
      </label>
    </div>
  );
}
