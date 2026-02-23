import { ReactNode } from "react";

type KpiCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  tone?: "brand" | "green" | "orange" | "violet" | "zinc";
};

const toneClass: Record<NonNullable<KpiCardProps["tone"]>, string> = {
  brand: "border-brand-200 dark:border-brand-900/40",
  green: "border-emerald-200 dark:border-emerald-900/40",
  orange: "border-orange-200 dark:border-orange-900/40",
  violet: "border-violet-200 dark:border-violet-900/40",
  zinc: "border-zinc-200 dark:border-zinc-800",
};

export function KpiCard({ label, value, hint, icon, tone = "zinc" }: KpiCardProps) {
  return (
    <div className={`rounded-2xl border bg-white dark:bg-zinc-900 p-5 ${toneClass[tone]}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold">{label}</p>
        {icon ? <span className="text-zinc-500 dark:text-zinc-400">{icon}</span> : null}
      </div>
      <p className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">{value}</p>
      {hint ? <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{hint}</p> : null}
    </div>
  );
}
