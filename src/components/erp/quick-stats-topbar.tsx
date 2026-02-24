"use client";

import { TrendingUp, DollarSign, FolderKanban } from "lucide-react";

type QuickStatsTopbarProps = {
  monthlyRevenue?: number;
  activeProjects?: number;
  completedThisMonth?: number;
};

export function QuickStatsTopbar({
  monthlyRevenue = 0,
  activeProjects = 0,
  completedThisMonth = 0,
}: QuickStatsTopbarProps) {
  const formatCLP = (value: number) => {
    const formatter = new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    });
    return formatter.format(value);
  };

  return (
    <div className="hidden md:flex items-center gap-4">
      <div className="text-right">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Ingresos (Mes)</p>
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {formatCLP(monthlyRevenue)}
        </p>
      </div>
      <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800"></div>
      <div className="text-right">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Proyectos Activos</p>
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {activeProjects}
        </p>
      </div>
    </div>
  );
}
