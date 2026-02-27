"use client";

import {
  CheckCircle2,
  Clock,
  X,
  AlertCircle,
  Archive,
  Eye,
  FileCheck,
  Zap,
  Square,
} from "lucide-react";

export type StatusType =
  | "completed"
  | "approved"
  | "accepted"
  | "received"
  | "invoiced"
  | "paid"
  | "active"
  | "draft"
  | "pending"
  | "sent"
  | "partial"
  | "todo"
  | "in_progress"
  | "done"
  | "planning"
  | "executing"
  | "reviewing"
  | "cancelled"
  | "rejected"
  | "closed"
  | "archived"
  | "on_hold"
  | "new"
  | "viewed";

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline" | "soft";
}

const statusConfig: Record<
  StatusType,
  {
    label: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
    icon: React.ReactNode;
  }
> = {
  completed: {
    label: "Completado",
    bgColor: "bg-emerald-100 dark:bg-emerald-950/30",
    textColor: "text-emerald-700 dark:text-emerald-300",
    borderColor: "border-emerald-300 dark:border-emerald-800",
    icon: <CheckCircle2 size={16} />,
  },
  approved: {
    label: "Aprobado",
    bgColor: "bg-emerald-100 dark:bg-emerald-950/30",
    textColor: "text-emerald-700 dark:text-emerald-300",
    borderColor: "border-emerald-300 dark:border-emerald-800",
    icon: <CheckCircle2 size={16} />,
  },
  accepted: {
    label: "Aceptado",
    bgColor: "bg-emerald-100 dark:bg-emerald-950/30",
    textColor: "text-emerald-700 dark:text-emerald-300",
    borderColor: "border-emerald-300 dark:border-emerald-800",
    icon: <CheckCircle2 size={16} />,
  },
  received: {
    label: "Recibido",
    bgColor: "bg-emerald-100 dark:bg-emerald-950/30",
    textColor: "text-emerald-700 dark:text-emerald-300",
    borderColor: "border-emerald-300 dark:border-emerald-800",
    icon: <CheckCircle2 size={16} />,
  },
  invoiced: {
    label: "Facturado",
    bgColor: "bg-teal-100 dark:bg-teal-950/30",
    textColor: "text-teal-700 dark:text-teal-300",
    borderColor: "border-teal-300 dark:border-teal-800",
    icon: <FileCheck size={16} />,
  },
  paid: {
    label: "Pagado",
    bgColor: "bg-emerald-100 dark:bg-emerald-950/30",
    textColor: "text-emerald-700 dark:text-emerald-300",
    borderColor: "border-emerald-300 dark:border-emerald-800",
    icon: <CheckCircle2 size={16} />,
  },

  active: {
    label: "Activo",
    bgColor: "bg-blue-100 dark:bg-blue-950/30",
    textColor: "text-blue-700 dark:text-blue-300",
    borderColor: "border-blue-300 dark:border-blue-800",
    icon: <Zap size={16} />,
  },
  in_progress: {
    label: "En progreso",
    bgColor: "bg-cyan-100 dark:bg-cyan-950/30",
    textColor: "text-cyan-700 dark:text-cyan-300",
    borderColor: "border-cyan-300 dark:border-cyan-800",
    icon: <Zap size={16} />,
  },
  executing: {
    label: "Ejecutando",
    bgColor: "bg-cyan-100 dark:bg-cyan-950/30",
    textColor: "text-cyan-700 dark:text-cyan-300",
    borderColor: "border-cyan-300 dark:border-cyan-800",
    icon: <Zap size={16} />,
  },

  pending: {
    label: "Pendiente",
    bgColor: "bg-amber-100 dark:bg-amber-950/30",
    textColor: "text-amber-700 dark:text-amber-300",
    borderColor: "border-amber-300 dark:border-amber-800",
    icon: <Clock size={16} />,
  },
  sent: {
    label: "Enviado",
    bgColor: "bg-blue-100 dark:bg-blue-950/30",
    textColor: "text-blue-700 dark:text-blue-300",
    borderColor: "border-blue-300 dark:border-blue-800",
    icon: <Eye size={16} />,
  },
  partial: {
    label: "Parcial",
    bgColor: "bg-amber-100 dark:bg-amber-950/30",
    textColor: "text-amber-700 dark:text-amber-300",
    borderColor: "border-amber-300 dark:border-amber-800",
    icon: <AlertCircle size={16} />,
  },
  on_hold: {
    label: "En suspenso",
    bgColor: "bg-orange-100 dark:bg-orange-950/30",
    textColor: "text-orange-700 dark:text-orange-300",
    borderColor: "border-orange-300 dark:border-orange-800",
    icon: <AlertCircle size={16} />,
  },

  draft: {
    label: "Borrador",
    bgColor: "bg-zinc-100 dark:bg-zinc-800/30",
    textColor: "text-zinc-700 dark:text-zinc-300",
    borderColor: "border-zinc-300 dark:border-zinc-700",
    icon: <Square size={16} />,
  },
  planning: {
    label: "Planificación",
    bgColor: "bg-slate-100 dark:bg-slate-950/30",
    textColor: "text-slate-700 dark:text-slate-300",
    borderColor: "border-slate-300 dark:border-slate-800",
    icon: <Clock size={16} />,
  },
  todo: {
    label: "Por hacer",
    bgColor: "bg-zinc-100 dark:bg-zinc-800/30",
    textColor: "text-zinc-700 dark:text-zinc-300",
    borderColor: "border-zinc-300 dark:border-zinc-700",
    icon: <Square size={16} />,
  },
  done: {
    label: "Hecho",
    bgColor: "bg-emerald-100 dark:bg-emerald-950/30",
    textColor: "text-emerald-700 dark:text-emerald-300",
    borderColor: "border-emerald-300 dark:border-emerald-800",
    icon: <CheckCircle2 size={16} />,
  },
  new: {
    label: "Nuevo",
    bgColor: "bg-blue-100 dark:bg-blue-950/30",
    textColor: "text-blue-700 dark:text-blue-300",
    borderColor: "border-blue-300 dark:border-blue-800",
    icon: <Eye size={16} />,
  },
  viewed: {
    label: "Visto",
    bgColor: "bg-blue-100 dark:bg-blue-950/30",
    textColor: "text-blue-700 dark:text-blue-300",
    borderColor: "border-blue-300 dark:border-blue-800",
    icon: <Eye size={16} />,
  },

  cancelled: {
    label: "Cancelado",
    bgColor: "bg-red-100 dark:bg-red-950/30",
    textColor: "text-red-700 dark:text-red-300",
    borderColor: "border-red-300 dark:border-red-800",
    icon: <X size={16} />,
  },
  rejected: {
    label: "Rechazado",
    bgColor: "bg-red-100 dark:bg-red-950/30",
    textColor: "text-red-700 dark:text-red-300",
    borderColor: "border-red-300 dark:border-red-800",
    icon: <X size={16} />,
  },
  closed: {
    label: "Cerrado",
    bgColor: "bg-gray-100 dark:bg-gray-800/30",
    textColor: "text-gray-700 dark:text-gray-300",
    borderColor: "border-gray-300 dark:border-gray-700",
    icon: <X size={16} />,
  },
  archived: {
    label: "Archivado",
    bgColor: "bg-gray-100 dark:bg-gray-800/30",
    textColor: "text-gray-700 dark:text-gray-300",
    borderColor: "border-gray-300 dark:border-gray-700",
    icon: <Archive size={16} />,
  },
  reviewing: {
    label: "Revisión",
    bgColor: "bg-purple-100 dark:bg-purple-950/30",
    textColor: "text-purple-700 dark:text-purple-300",
    borderColor: "border-purple-300 dark:border-purple-800",
    icon: <AlertCircle size={16} />,
  },
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-1.5 text-base",
};

export function StatusBadge({
  status,
  label: customLabel,
  size = "md",
  variant = "soft",
}: StatusBadgeProps) {
  const config = statusConfig[status as StatusType] || {
    label: status,
    bgColor: "bg-zinc-100 dark:bg-zinc-800/30",
    textColor: "text-zinc-700 dark:text-zinc-300",
    borderColor: "border-zinc-300 dark:border-zinc-700",
    icon: <Square size={16} />,
  };

  const displayLabel = customLabel || config.label;

  if (variant === "outline") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-lg border ${config.borderColor} ${config.textColor} ${sizeClasses[size]} font-semibold`}
      >
        {config.icon}
        {displayLabel}
      </span>
    );
  }

  if (variant === "solid") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-lg ${config.bgColor} ${config.textColor} ${sizeClasses[size]} font-semibold`}
      >
        {config.icon}
        {displayLabel}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg ${config.bgColor} ${config.textColor} ${sizeClasses[size]} font-semibold`}
    >
      {config.icon}
      {displayLabel}
    </span>
  );
}
