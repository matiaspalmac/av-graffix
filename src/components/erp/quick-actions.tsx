"use client";

import Link from "next/link";
import {
  FileText,
  Briefcase,
  Package,
  ReceiptText,
  Zap,
} from "lucide-react";

export interface QuickAction {
  icon: React.ReactNode;
  label: string;
  description: string;
  href: string;
  bgColor: string;
  iconColor: string;
}

interface QuickActionsProps {
  actions?: QuickAction[];
}

const defaultActions: QuickAction[] = [
  {
    icon: <FileText className="w-6 h-6" />,
    label: "Nueva Cotización",
    description: "Crear una cotización para cliente",
    href: "/erp/ventas?action=new-quote",
    bgColor: "bg-blue-100 dark:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-300",
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    label: "Nuevo Proyecto",
    description: "Iniciar un nuevo proyecto",
    href: "/erp/proyectos?action=new-project",
    bgColor: "bg-purple-100 dark:bg-purple-900",
    iconColor: "text-purple-600 dark:text-purple-300",
  },
  {
    icon: <Package className="w-6 h-6" />,
    label: "Registrar Consumo",
    description: "Registrar consumo de materiales",
    href: "/erp/produccion?action=new-consumption",
    bgColor: "bg-orange-100 dark:bg-orange-900",
    iconColor: "text-orange-600 dark:text-orange-300",
  },
  {
    icon: <ReceiptText className="w-6 h-6" />,
    label: "Nueva Factura",
    description: "Crear una factura para cliente",
    href: "/erp/finanzas?action=new-invoice",
    bgColor: "bg-green-100 dark:bg-green-900",
    iconColor: "text-green-600 dark:text-green-300",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    label: "Crear OC",
    description: "Nueva orden de compra a proveedor",
    href: "/erp/compras?action=new-po",
    bgColor: "bg-red-100 dark:bg-red-900",
    iconColor: "text-red-600 dark:text-red-300",
  },
];

export default function QuickActions({ actions = defaultActions }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {actions.map((action, index) => (
        <Link
          key={index}
          href={action.href}
          className="group relative overflow-hidden rounded-lg border border-transparent transition-all hover:border-current hover:shadow-lg"
        >
          <div
            className={`absolute inset-0 ${action.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          />
          <div className="relative p-5 flex flex-col items-center text-center space-y-3">
            <div className={`${action.iconColor} transition-transform group-hover:scale-110`}>
              {action.icon}
            </div>
            <div>
              <h3 className="font-semibold text-sm">{action.label}</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                {action.description}
              </p>
            </div>
          </div>
          <div className="absolute inset-0 border border-current opacity-0 group-hover:opacity-10 rounded-lg transition-opacity pointer-events-none" />
        </Link>
      ))}
    </div>
  );
}
