"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Handshake,
  FolderKanban,
  Factory,
  Boxes,
  ShoppingCart,
  Wallet,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menu = [
  { href: "/erp", label: "Dashboard", icon: LayoutDashboard },
  { href: "/erp/ventas", label: "CRM & Ventas", icon: Handshake },
  { href: "/erp/proyectos", label: "Proyectos", icon: FolderKanban },
  { href: "/erp/produccion", label: "Producción", icon: Factory },
  { href: "/erp/inventario", label: "Inventario", icon: Boxes },
  { href: "/erp/compras", label: "Compras", icon: ShoppingCart },
  { href: "/erp/finanzas", label: "Finanzas", icon: Wallet },
  { href: "/erp/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/erp/admin", label: "Administración", icon: ShieldCheck },
];

export function ErpSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-72 xl:w-80 h-screen sticky top-0 border-r border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl">
      <div className="flex w-full flex-col p-4">
        <div className="mb-5 rounded-2xl border border-brand-200/70 dark:border-brand-900/50 bg-brand-50/70 dark:bg-brand-950/20 p-4">
          <p className="text-xs uppercase tracking-widest text-brand-700 dark:text-brand-400 font-semibold">AV GRAFFIX</p>
        </div>

        <nav className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                )}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
