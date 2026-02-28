"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, Download } from "lucide-react";
import {
  LayoutDashboard,
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-provider";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const menuGroups = [
  {
    label: "Principal",
    items: [
      { href: "/erp", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Operaciones",
    items: [
      { href: "/erp/ventas", label: "CRM & Ventas", icon: TrendingUp },
      { href: "/erp/proyectos", label: "Proyectos", icon: FolderKanban },
      { href: "/erp/produccion", label: "Producción", icon: Printer },
      { href: "/erp/cronograma", label: "Cronograma", icon: CalendarDays },
    ],
  },
  {
    label: "Suministro",
    items: [
      { href: "/erp/inventario", label: "Inventario", icon: Package },
      { href: "/erp/compras", label: "Compras", icon: ShoppingCart }
    ],
  },
  {
    label: "Administración",
    items: [
      { href: "/erp/finanzas", label: "Finanzas", icon: Landmark },
      { href: "/erp/finanzas/gastos", label: "Gastos Extras", icon: ShoppingCart },
      { href: "/erp/reportes", label: "Reportes", icon: BarChart3 },
    ],
  },
  {
    label: "Gestión & Datos",
    items: [
      { href: "/erp/cotizaciones", label: "Cotizaciones", icon: FileText },
      { href: "/erp/clientes", label: "Clientes", icon: Users },
      { href: "/erp/proveedores", label: "Proveedores", icon: Building2 },
      { href: "/erp/admin", label: "Configuración", icon: ShieldCheck },
    ],
  }
];

type ErpSidebarProps = {
  role?: string | null;
};

export function ErpSidebar({ role }: ErpSidebarProps) {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapsed, isMobileOpen, setMobileOpen } = useSidebar();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar si ya está instalado
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIosStandalone = 'standalone' in navigator && (navigator as any).standalone === true;
      setIsInstalled(isStandalone || isIosStandalone);
    };

    checkInstalled();

    // Capturar evento de instalación
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Detectar cuando la app se instala
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA instalada desde el sidebar');
    }

    setDeferredPrompt(null);
  };

  const filteredGroups = menuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => (item.href === "/erp/admin" ? role === "admin" : true)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col lg:fixed lg:top-16 lg:left-0 lg:h-[calc(100vh-4rem)] border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 z-20",
          "transition-[width] duration-300 ease-in-out overflow-x-hidden",
          isCollapsed ? "lg:w-[72px]" : "lg:w-64"
        )}
      >
        <div className="flex w-full flex-col h-full overflow-hidden">
          <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 custom-scrollbar">
            <div className="space-y-6">
              {filteredGroups.map((group, groupIdx) => (
                <div key={group.label} className="space-y-1 relative">
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      isCollapsed ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
                    )}
                  >
                    <p className="px-6 pb-2 pt-2 text-[11px] font-bold text-zinc-500 uppercase tracking-wider whitespace-nowrap">
                      {group.label}
                    </p>
                  </div>
                  {groupIdx > 0 && (
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-300 ease-in-out",
                        isCollapsed ? "max-h-4 opacity-100 mt-2 mb-2" : "max-h-0 opacity-0 mt-0 mb-0 pointer-events-none"
                      )}
                    >
                      <div className="mx-4 border-t border-zinc-200 dark:border-zinc-800" />
                    </div>
                  )}

                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "relative flex items-center h-[52px] text-sm font-medium transition-all duration-300",
                          isCollapsed
                            ? "w-[52px] ml-[10px] rounded-full"
                            : "w-[calc(100%-16px)] ml-0 mr-4 rounded-r-full",
                          active
                            ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                            : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                        )}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <span className={cn(
                          "flex items-center justify-center flex-shrink-0 transition-all duration-300",
                          isCollapsed ? "w-[52px]" : "w-[72px]"
                        )}>
                          <Icon size={18} />
                        </span>
                        <span
                          className={cn(
                            "absolute flex items-center h-full whitespace-nowrap transition-all duration-300 ease-in-out",
                            isCollapsed
                              ? "opacity-0 left-[52px] pointer-events-none"
                              : "opacity-100 left-[72px]"
                          )}
                        >
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </nav>
          {deferredPrompt && !isInstalled && (
            <div className="border-t border-zinc-200 dark:border-zinc-800 py-2">
              <button
                onClick={handleInstall}
                className={cn(
                  "relative flex items-center h-[52px] text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-900/20 dark:text-brand-300 dark:hover:bg-brand-900/40 transition-all duration-300",
                  isCollapsed
                    ? "w-[52px] ml-[10px] rounded-full"
                    : "w-[calc(100%-16px)] ml-0 mr-4 rounded-r-full"
                )}
                title={isCollapsed ? "Instalar App" : undefined}
              >
                <span className={cn(
                  "flex items-center justify-center flex-shrink-0 transition-all duration-300",
                  isCollapsed ? "w-[52px]" : "w-[72px]"
                )}>
                  <Download size={18} />
                </span>
                <span
                  className={cn(
                    "absolute flex items-center h-full whitespace-nowrap transition-all duration-300 ease-in-out",
                    isCollapsed
                      ? "opacity-0 left-[52px] pointer-events-none"
                      : "opacity-100 left-[72px]"
                  )}
                >
                  Instalar App
                </span>
              </button>
            </div>
          )}
        </div>
      </aside>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 z-50 lg:hidden transition-transform duration-300 overflow-y-auto",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex w-full flex-col p-4">
          <div className="flex items-center justify-between mb-5">
            <div className="relative w-32 h-16 flex-1">
              <Image
                src="/avgraffix.png"
                alt="AV GRAFFIX"
                fill
                className="object-contain"
              />
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-6">
            {filteredGroups.map((group) => (
              <div key={group.label} className="space-y-1">
                <p className="px-6 pb-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  {group.label}
                </p>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center h-[52px] rounded-r-full text-sm font-medium transition-colors w-[calc(100%-16px)] ml-0 mr-4",
                        active
                          ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                      )}
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className="flex items-center justify-center w-[72px] flex-shrink-0">
                        <Icon size={18} />
                      </span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
          {deferredPrompt && !isInstalled && (
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-4">
              <button
                onClick={handleInstall}
                className="w-[calc(100%-16px)] ml-0 mr-4 flex items-center h-[52px] rounded-r-full text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors dark:bg-brand-900/20 dark:text-brand-300 dark:hover:bg-brand-900/40"
              >
                <span className="flex items-center justify-center w-[72px] flex-shrink-0">
                  <Download size={18} />
                </span>
                <span className="font-medium">Instalar App</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
