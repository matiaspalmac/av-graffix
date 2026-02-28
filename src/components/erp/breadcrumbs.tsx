"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  Home,
  TrendingUp,
  FolderKanban,
  Printer,
  Package,
  ShoppingCart,
  Landmark,
  BarChart3,
  ShieldCheck,
  FileText,
  Users,
  Building2,
  CalendarDays,
  LayoutDashboard
} from "lucide-react";

// Helper para capitalizar la primera letra
const capitalize = (s: string) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const breadcrumbConfig: Record<string, { label: string, icon: any }> = {
  "": { label: "Dashboard", icon: LayoutDashboard },
  erp: { label: "ERP", icon: Home },
  ventas: { label: "Ventas", icon: TrendingUp },
  proyectos: { label: "Proyectos", icon: FolderKanban },
  produccion: { label: "Producción", icon: Printer },
  inventario: { label: "Inventario", icon: Package },
  compras: { label: "Compras", icon: ShoppingCart },
  finanzas: { label: "Finanzas", icon: Landmark },
  reportes: { label: "Reportes", icon: BarChart3 },
  admin: { label: "Administración", icon: ShieldCheck },
  cotizaciones: { label: "Cotizaciones", icon: FileText },
  clientes: { label: "Clientes", icon: Users },
  proveedores: { label: "Proveedores", icon: Building2 },
  cronograma: { label: "Cronograma", icon: CalendarDays },
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname
    .split("/")
    .filter((segment) => segment && segment !== "protected");

  if (segments.length === 0 || segments.length === 1) {
    return null;
  }

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const config = breadcrumbConfig[segment];
    const label = config ? config.label : capitalize(segment.replace(/-/g, ' '));
    const Icon = config ? config.icon : null;

    return { href, label, Icon };
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-3 dark:bg-zinc-950/40 text-sm overflow-x-auto custom-scrollbar">
      <nav aria-label="Breadcrumb" className="flex items-center min-w-max">
        <ol role="list" className="flex items-center gap-1.5 sm:gap-2">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const Icon = crumb.Icon;

            return (
              <li key={crumb.href} className="flex items-center">
                {index > 0 && (
                  <ChevronRight size={14} className="text-zinc-300 dark:text-zinc-700 mx-0.5 sm:mx-1 flex-shrink-0" strokeWidth={2.5} />
                )}

                {isLast ? (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 font-semibold shadow-sm border border-brand-100 dark:border-brand-900/50">
                    {Icon && <Icon size={14} strokeWidth={2.5} />}
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-zinc-500 bg-transparent hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-all font-medium"
                  >
                    {Icon && <Icon size={14} />}
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
