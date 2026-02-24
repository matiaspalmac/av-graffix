"use client";

import { useState, useTransition } from "react";
import { Bell, Eye } from "lucide-react";
import { updateUserPreferences } from "@/app/erp/(protected)/config-actions";

interface UserPreferences {
  themeDarkMode: boolean;
  themeHighContrast: boolean;
  notifyInventoryAlerts: boolean;
  notifySalesAlerts: boolean;
  notifyDailySummary: boolean;
}

interface ConfigSettingsPanelProps {
  initialPreferences: UserPreferences | null;
}

export default function ConfigSettingsPanel({ initialPreferences }: ConfigSettingsPanelProps) {
  const [prefs, setPrefs] = useState<UserPreferences>(
    initialPreferences || {
      themeDarkMode: false,
      themeHighContrast: false,
      notifyInventoryAlerts: true,
      notifySalesAlerts: true,
      notifyDailySummary: true,
    }
  );
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const handleToggle = (key: keyof UserPreferences) => {
    const newPrefs = { ...prefs, [key]: !prefs[key] };
    setPrefs(newPrefs);
    setSaved(false);

    // Aplicar cambios inmediatamente al DOM
    if (key === "themeDarkMode") {
      if (newPrefs.themeDarkMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }

    if (key === "themeHighContrast") {
      if (newPrefs.themeHighContrast) {
        document.documentElement.classList.add("high-contrast");
        localStorage.setItem("highContrast", "true");
      } else {
        document.documentElement.classList.remove("high-contrast");
        localStorage.setItem("highContrast", "false");
      }
    }

    // Guardar automáticamente en BD
    startTransition(async () => {
      const formData = new FormData();
      formData.append("themeDarkMode", newPrefs.themeDarkMode ? "on" : "off");
      formData.append("themeHighContrast", newPrefs.themeHighContrast ? "on" : "off");
      formData.append("notifyInventoryAlerts", newPrefs.notifyInventoryAlerts ? "on" : "off");
      formData.append("notifySalesAlerts", newPrefs.notifySalesAlerts ? "on" : "off");
      formData.append("notifyDailySummary", newPrefs.notifyDailySummary ? "on" : "off");

      try {
        await updateUserPreferences(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (error) {
        console.error("Error guardando preferencias", error);
      }
    });
  };

  const ToggleSwitch = ({ checked }: { checked: boolean }) => (
    <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${
      checked ? "bg-brand-600" : "bg-zinc-300 dark:bg-zinc-700"
    }`}>
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
        checked ? "right-0.5" : "left-0.5"
      }`}></div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Sección Interfaz */}
      <div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
          <Eye size={20} />
          Interfaz
        </h2>
        <div className="space-y-4 pl-8">
          <button
            onClick={() => handleToggle("themeDarkMode")}
            disabled={isPending}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition disabled:opacity-50"
          >
            <div className="text-left">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Tema Oscuro</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Cambia entre modo claro y oscuro</p>
            </div>
            <ToggleSwitch checked={prefs.themeDarkMode} />
          </button>

          <button
            onClick={() => handleToggle("themeHighContrast")}
            disabled={isPending}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition disabled:opacity-50"
          >
            <div className="text-left">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Contraste Alto</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Aumenta el contraste para mejor legibilidad</p>
            </div>
            <ToggleSwitch checked={prefs.themeHighContrast} />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-zinc-200 dark:border-zinc-800"></div>

      {/* Sección Notificaciones */}
      <div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
          <Bell size={20} />
          Notificaciones
        </h2>
        <div className="space-y-4 pl-8">
          <button
            onClick={() => handleToggle("notifyInventoryAlerts")}
            disabled={isPending}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition disabled:opacity-50"
          >
            <div className="text-left">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Alertas de Inventario</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Notifica cuando el stock es bajo</p>
            </div>
            <ToggleSwitch checked={prefs.notifyInventoryAlerts} />
          </button>

          <button
            onClick={() => handleToggle("notifySalesAlerts")}
            disabled={isPending}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition disabled:opacity-50"
          >
            <div className="text-left">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Alertas de Venta</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Notifica nuevas ventas y proyectos</p>
            </div>
            <ToggleSwitch checked={prefs.notifySalesAlerts} />
          </button>

          <button
            onClick={() => handleToggle("notifyDailySummary")}
            disabled={isPending}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition disabled:opacity-50"
          >
            <div className="text-left">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Resumen Diario</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Recibe un resumen de actividades al final del día</p>
            </div>
            <ToggleSwitch checked={prefs.notifyDailySummary} />
          </button>
        </div>
      </div>

      {/* Estado de guardado */}
      {saved && (
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-400">✓ Cambios guardados correctamente</p>
        </div>
      )}

      {isPending && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-400">Guardando cambios...</p>
        </div>
      )}
    </div>
  );
}
