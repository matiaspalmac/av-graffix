"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, Download } from "lucide-react";
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
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-provider";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const menu = [
  { href: "/erp", label: "Dashboard", icon: LayoutDashboard },
  { href: "/erp/ventas", label: "CRM & Ventas", icon: Handshake },
  { href: "/erp/cotizaciones", label: "Cotizaciones", icon: FileText },
  { href: "/erp/proyectos", label: "Proyectos", icon: FolderKanban },
  { href: "/erp/produccion", label: "Producción", icon: Factory },
  { href: "/erp/inventario", label: "Inventario", icon: Boxes },
  { href: "/erp/compras", label: "Compras", icon: ShoppingCart },
  { href: "/erp/finanzas", label: "Finanzas", icon: Wallet },
  { href: "/erp/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/erp/admin", label: "Administración", icon: ShieldCheck },
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

  const menuItems = menu.filter((item) => (item.href === "/erp/admin" ? role === "admin" : true));

  return (
    <>
      {/* Desktop Sidebar - Estilo Gmail */}
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col lg:fixed lg:top-16 lg:left-0 lg:h-[calc(100vh-4rem)] border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all duration-300 overflow-hidden",
          isCollapsed ? "lg:w-[72px]" : "lg:w-64"
        )}
      >
        <div className="flex w-full flex-col h-full">
          <nav className={cn(
            "flex-1 overflow-y-auto py-2",
            isCollapsed ? "px-2" : "px-3"
          )}>
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl text-sm font-medium transition-colors",
                      isCollapsed
                        ? "justify-center p-3 min-h-[48px]"
                        : "px-3 py-2.5",
                      active
                        ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon size={18} className="flex-shrink-0" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Botón de instalación PWA - Desktop */}
          {deferredPrompt && !isInstalled && (
            <div className={cn(
              "border-t border-zinc-200 dark:border-zinc-800",
              isCollapsed ? "p-2" : "p-3"
            )}>
              {isCollapsed ? (
                <button
                  onClick={handleInstall}
                  className="w-full flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 transition-all shadow-lg shadow-brand-500/20"
                  title="Instalar App"
                >
                  <Download size={18} />
                </button>
              ) : (
                <button
                  onClick={handleInstall}
                  className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 transition-all shadow-lg shadow-brand-500/20"
                >
                  <Download size={18} className="flex-shrink-0" />
                  <span>Instalar App</span>
                </button>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
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

          <nav className="space-y-1">
            {menuItems.map((item) => {
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
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Botón de instalación PWA - Mobile */}
          {deferredPrompt && !isInstalled && (
            <button
              onClick={handleInstall}
              className="mt-4 w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 transition-all shadow-lg shadow-brand-500/20 border-t border-zinc-200 dark:border-zinc-800 pt-4"
            >
              <Download size={18} className="flex-shrink-0" />
              <span>Instalar App</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
