export default function Loading() {
  return (
    <div className="min-h-[60vh] bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center transition-colors duration-500">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-zinc-200 dark:border-zinc-800" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-600 animate-spin" />
        </div>
        <p className="text-sm font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
          Cargando...
        </p>
      </div>
    </div>
  )
}
