"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";

type Notification = {
  id: string;
  type: "warning" | "error" | "info";
  title: string;
  message: string;
};

type NotificationsBellProps = {
  criticalStockCount?: number;
  overdueInvoicesCount?: number;
  delayedPurchaseOrdersCount?: number;
};

export function NotificationsBell({
  criticalStockCount = 0,
  overdueInvoicesCount = 0,
  delayedPurchaseOrdersCount = 0,
}: NotificationsBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const notifications: Notification[] = [
    ...(criticalStockCount > 0
      ? [
        {
          id: "stock",
          type: "warning" as const,
          title: "Stock Crítico",
          message: `${criticalStockCount} material(es) bajo stock mínimo`,
        },
      ]
      : []),
    ...(overdueInvoicesCount > 0
      ? [
        {
          id: "invoices",
          type: "error" as const,
          title: "Facturas Vencidas",
          message: `${overdueInvoicesCount} factura(s) sin pagar`,
        },
      ]
      : []),
    ...(delayedPurchaseOrdersCount > 0
      ? [
        {
          id: "orders",
          type: "warning" as const,
          title: "Órdenes Atrasadas",
          message: `${delayedPurchaseOrdersCount} orden(es) de compra retrasada(s)`,
        },
      ]
      : []),
  ];

  const unreadCount = notifications.length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
        aria-label="Notificaciones"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 lg:hidden" />

          <div className="
            fixed inset-x-4 top-20 z-50 
            sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 
            erp-dropdown-surface rounded-2xl border shadow-2xl overflow-hidden animate-fade-in
          ">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">
                Notificaciones {unreadCount > 0 && `(${unreadCount})`}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-1 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                Cerrar
              </button>
            </div>
            <div className="max-h-[70vh] sm:max-h-96 overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                <div className="p-3 space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 rounded-xl border-l-4 transition-all hover:scale-[1.02] ${notif.type === "error"
                        ? "border-l-red-600 bg-red-50 dark:bg-red-950/20"
                        : "border-l-yellow-600 bg-yellow-50 dark:bg-yellow-950/20"
                        }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          {notif.title}
                        </p>
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${notif.type === "error" ? "bg-red-200 text-red-800 dark:bg-red-900/40 dark:text-red-300" : "bg-yellow-200 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
                          }`}>
                          {notif.type === "error" ? "Urgente" : "Atención"}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  <Bell size={24} className="mx-auto mb-3 opacity-20" />
                  <p>No tienes notificaciones pendientes</p>
                </div>
              )}
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800">
              <button className="w-full text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors uppercase tracking-widest py-1">
                Marcar todas como leídas
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
