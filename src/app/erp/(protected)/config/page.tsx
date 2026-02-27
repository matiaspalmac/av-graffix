import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ArrowLeft, Lock, Monitor } from "lucide-react";
import Link from "next/link";
import { getUserPreferences, getActiveSessions } from "../config-actions";
import ConfigSettingsPanel from "@/components/erp/config-settings-panel";
import ChangePasswordForm from "@/components/erp/change-password-form";
import ActiveSessionsList from "@/components/erp/active-sessions-list";

export default async function ConfigPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/erp/login");
  }

  const [preferences, sessions] = await Promise.all([
    getUserPreferences(),
    getActiveSessions(),
  ]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/erp"
          className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-4"
        >
          <ArrowLeft size={16} />
          Volver al Dashboard
        </Link>
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100">Configuración</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Personaliza tu experiencia en el ERP</p>
      </div>
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8">
        <ConfigSettingsPanel initialPreferences={preferences} />
      </div>
      <div className="mt-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Lock size={20} className="text-zinc-900 dark:text-zinc-100" />
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Cambiar Contraseña</h2>
        </div>
        <ChangePasswordForm />
      </div>
      <div className="mt-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Monitor size={20} className="text-zinc-900 dark:text-zinc-100" />
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Sesiones Activas</h2>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
          Historial de sesiones iniciadas en los últimos 30 días
        </p>
        <ActiveSessionsList sessions={sessions} />
      </div>
      <div className="mt-8 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          <span className="font-semibold">💡 Nota:</span> Tus preferencias se guardan automáticamente en la base de datos. Los cambios surtirán efecto inmediatamente.
        </p>
      </div>
    </div>
  );
}
