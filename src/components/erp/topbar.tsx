"use client";

import Image from "next/image";
import { Menu, Sun, Moon } from "lucide-react";
import { UserAvatarMenu } from "./user-avatar-menu";
import { GlobalSearch } from "./global-search";
import { NotificationsBell } from "./notifications-bell";
import { QuickStatsTopbar } from "./quick-stats-topbar";
import { useSidebar } from "./sidebar-provider";
import { toggleThemeAction } from "./topbar-theme-actions";
import { useTransition } from "react";

type ErpTopbarProps = {
  userName?: string | null;
  role?: string | null;
  criticalStockCount?: number;
  overdueInvoicesCount?: number;
  delayedPurchaseOrdersCount?: number;
  monthlyRevenue?: number;
  activeProjects?: number;
};

export function ErpTopbar({
  userName,
  role,
  criticalStockCount = 0,
  overdueInvoicesCount = 0,
  delayedPurchaseOrdersCount = 0,
  monthlyRevenue = 0,
  activeProjects = 0,
}: ErpTopbarProps) {
  const { setMobileOpen, toggleCollapsed } = useSidebar();
  const [, startTransition] = useTransition();

  const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.classList.contains("dark");

    // Cambiar inmediatamente en el DOM
    if (isDark) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }

    // Guardar en BD
    startTransition(async () => {
      try {
        await toggleThemeAction();
      } catch (error) {
        console.error("Error guardando tema:", error);
      }
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="flex h-16 items-center">
        <div className="hidden lg:flex items-center justify-center w-[72px] flex-shrink-0 h-full">
          <button
            onClick={() => {
              if (window.innerWidth < 1024) {
                setMobileOpen(true);
              } else {
                toggleCollapsed();
              }
            }}
            className="inline-flex items-center justify-center rounded-full p-2.5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            aria-label="Menú"
            type="button"
          >
            <Menu size={20} />
          </button>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 sm:px-6 lg:px-4">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src="/avgraffix.png"
              alt="AV GRAFFIX"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-zinc-800 dark:text-zinc-100 leading-tight">AV GRAFFIX ERP</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Gestión interna de producción</p>
          </div>
        </div>
        <button
          onClick={() => {
            if (window.innerWidth < 1024) {
              setMobileOpen(true);
            } else {
              toggleCollapsed();
            }
          }}
          className="lg:hidden inline-flex items-center justify-center rounded-full p-2.5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors mx-2"
          aria-label="Menú"
          type="button"
        >
          <Menu size={20} />
        </button>
        <div className="flex-1 flex justify-center px-4">
          <div className="w-full max-w-2xl">
            <GlobalSearch role={role} />
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 px-4 sm:px-6 lg:px-4">
          <QuickStatsTopbar
            monthlyRevenue={monthlyRevenue}
            activeProjects={activeProjects}
          />

          <NotificationsBell
            criticalStockCount={criticalStockCount}
            overdueInvoicesCount={overdueInvoicesCount}
            delayedPurchaseOrdersCount={delayedPurchaseOrdersCount}
          />

          <button
            onClick={toggleTheme}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Cambiar tema"
            type="button"
          >
            <Sun size={18} className="dark:hidden" />
            <Moon size={18} className="hidden dark:block" />
          </button>

          <UserAvatarMenu userName={userName} role={role} />
        </div>
      </div>
    </header>
  );
}
