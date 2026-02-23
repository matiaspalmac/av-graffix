import Link from "next/link";
import { LogOut, Menu, Shield } from "lucide-react";
import { roleLabels } from "@/lib/rbac";
import { signOut } from "@/auth";

type ErpTopbarProps = {
  userName?: string | null;
  role?: string | null;
};

export function ErpTopbar({ userName, role }: ErpTopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden inline-flex items-center justify-center rounded-lg border border-zinc-300 dark:border-zinc-700 p-2 text-zinc-600 dark:text-zinc-300"
            aria-label="Abrir menú"
            type="button"
          >
            <Menu size={18} />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">AV GRAFFIX ERP</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Gestión interna de producción y rentabilidad</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 bg-white dark:bg-zinc-900">
            <Shield size={14} className="text-brand-600" />
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{roleLabels[role ?? "ventas"] ?? "Equipo"}</span>
          </div>

          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{userName ?? "Usuario"}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Temuco, Chile</p>
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/erp/login" });
            }}
          >
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 px-3 py-2 text-xs font-semibold text-white dark:text-zinc-900 hover:opacity-90 transition"
            >
              <LogOut size={14} />
              Salir
            </button>
          </form>

          <Link
            href="/"
            className="hidden sm:inline-flex rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            Ver sitio
          </Link>
        </div>
      </div>
    </header>
  );
}
