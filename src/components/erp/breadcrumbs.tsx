"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

const breadcrumbLabels: Record<string, string> = {
  "": "Dashboard",
  erp: "ERP",
  ventas: "Ventas",
  proyectos: "Proyectos",
  produccion: "Producción",
  inventario: "Inventario",
  compras: "Compras",
  finanzas: "Finanzas",
  reportes: "Reportes",
  admin: "Administración",
  protected: "",
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
    const label = breadcrumbLabels[segment] || segment;
    return { href, label };
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-2 border-b border-zinc-200 dark:border-zinc-800 text-sm">
      <div className="flex items-center gap-1">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center gap-1">
            {index > 0 && <ChevronRight size={16} className="text-zinc-400" />}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-zinc-600 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-500 transition"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
