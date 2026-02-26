import { ReactNode } from "react";

type KpiCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  tone?: "brand" | "green" | "orange" | "violet" | "zinc";
};

const toneIconClass: Record<NonNullable<KpiCardProps["tone"]>, string> = {
  brand: "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10",
  green: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10",
  orange: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10",
  violet: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10",
  zinc: "text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800",
};

export function KpiCard({ label, value, hint, icon, tone = "zinc" }: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{label}</p>
        {icon ? (
          <span className={`flex h-8 w-8 items-center justify-center rounded-full ${toneIconClass[tone]}`}>
            {icon}
          </span>
        ) : null}
      </div>
      <p className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">{value}</p>
      {hint ? <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">{hint}</p> : null}
    </div>
  );
}
