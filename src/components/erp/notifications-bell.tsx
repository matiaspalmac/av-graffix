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
        <div className="erp-dropdown-surface absolute right-0 mt-2 w-80 rounded-xl border backdrop-blur-sm z-50 overflow-hidden">
          <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Notificaciones {unreadCount > 0 && `(${unreadCount})`}
            </h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="p-2 space-y-2">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-lg border-l-4 ${
                      notif.type === "error"
                        ? "border-l-red-600 bg-red-50 dark:bg-red-950/30"
                        : "border-l-yellow-600 bg-yellow-50 dark:bg-yellow-950/30"
                    }`}
                  >
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {notif.title}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      {notif.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                Sin notificaciones
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
