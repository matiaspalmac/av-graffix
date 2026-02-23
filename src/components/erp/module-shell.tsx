type ModuleShellProps = {
  title: string;
  description: string;
  kpis?: Array<{ label: string; value: string; hint?: string }>;
};

export function ModuleShell({ title, description, kpis = [] }: ModuleShellProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">{title}</h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">{description}</p>
      </div>

      {kpis.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
              <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold">{kpi.label}</p>
              <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-2">{kpi.value}</p>
              {kpi.hint ? <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{kpi.hint}</p> : null}
            </div>
          ))}
        </div>
      ) : null}

      <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-100/60 dark:bg-zinc-900/30 p-5">
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          Módulo listo para extender con listados, formularios y acciones de negocio (crear cotización, registrar consumo, emitir factura, etc.).
        </p>
      </div>
    </div>
  );
}
