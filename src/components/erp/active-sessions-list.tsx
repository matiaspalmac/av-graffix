"use client";

import { Monitor, Smartphone, Tablet, MapPin, Globe } from "lucide-react";
import { logoutSessionAction } from "@/app/erp/(protected)/config-actions";
import { useTransition } from "react";

interface LoginSession {
  id: number;
  ipAddress: string | null;
  userAgent: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  city: string | null;
  country: string | null;
  loginAt: string;
  lastActivityAt: string;
  isActive: boolean;
}

interface ActiveSessionsListProps {
  sessions: LoginSession[];
}

export default function ActiveSessionsList({ sessions }: ActiveSessionsListProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = (sessionId: number) => {
    if (!confirm("¿Estás seguro de que deseas cerrar esta sesión?")) {
      return;
    }

    startTransition(async () => {
      await logoutSessionAction(sessionId);
    });
  };

  const getDeviceIcon = (device: string | null) => {
    if (!device) return <Monitor size={18} />;
    if (device.toLowerCase().includes("mobile") || device.toLowerCase() === "mobile") {
      return <Smartphone size={18} />;
    }
    if (device.toLowerCase().includes("tablet")) {
      return <Tablet size={18} />;
    }
    return <Monitor size={18} />;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Hace un momento";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    if (diffDays === 1) return "Hace 1 día";
    if (diffDays < 30) return `Hace ${diffDays} días`;
    
    return date.toLocaleDateString("es-CL", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
        No hay sesiones registradas
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <div
          key={session.id}
          className={`p-4 rounded-xl border transition ${
            session.isActive
              ? "border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20"
              : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="text-zinc-600 dark:text-zinc-400 mt-1">
                {getDeviceIcon(session.device)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {session.browser || "Navegador desconocido"}
                  </p>
                  {session.isActive && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      Activa
                    </span>
                  )}
                </div>
                
                <div className="mt-1 space-y-1">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    <span className="font-medium">{session.device || "Desconocido"}</span>
                    {session.os && ` • ${session.os}`}
                  </p>
                  
                  {(session.city || session.country) && (
                    <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                      <MapPin size={12} />
                      {session.city && session.country
                        ? `${session.city}, ${session.country}`
                        : session.country || session.city}
                    </div>
                  )}
                  
                  {session.ipAddress && (
                    <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                      <Globe size={12} />
                      {session.ipAddress}
                    </div>
                  )}
                  
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">
                    {formatDate(session.loginAt)}
                  </p>
                </div>
              </div>
            </div>

            {session.isActive && (
              <button
                onClick={() => handleLogout(session.id)}
                disabled={isPending}
                className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50 whitespace-nowrap"
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
