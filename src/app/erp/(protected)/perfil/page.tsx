import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ArrowLeft, Mail, Shield } from "lucide-react";
import Link from "next/link";

export default async function PerfilPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/erp/login");
  }

  const user = session.user;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/erp"
          className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-4"
        >
          <ArrowLeft size={16} />
          Volver al Dashboard
        </Link>
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100">Mi Perfil</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Gestiona tu información personal</p>
      </div>

      {/* Perfil Card */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8">
        {/* Avatar Section */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
          <div className="w-20 h-20 rounded-full bg-brand-600 text-white font-semibold text-xl flex items-center justify-center">
            {(user.name || "U")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{user.name || "Usuario"}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{user.role || "Empleado"}</p>
          </div>
        </div>

        {/* Información Personal */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">Información Personal</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-zinc-600 dark:text-zinc-400 font-semibold">
                  Nombre Completo
                </label>
                <p className="text-sm text-zinc-900 dark:text-zinc-100 mt-1">{user.name || "No especificado"}</p>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-zinc-600 dark:text-zinc-400 font-semibold flex items-center gap-2">
                  <Mail size={14} />
                  Correo Electrónico
                </label>
                <p className="text-sm text-zinc-900 dark:text-zinc-100 mt-1">{user.email || "No especificado"}</p>
              </div>
            </div>
          </div>

          {/* Rol y Permisos */}
          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">Rol y Permisos</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-zinc-600 dark:text-zinc-400 font-semibold flex items-center gap-2">
                  <Shield size={14} />
                  Rol Actual
                </label>
                <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400">
                  {user.role || "Sin rol"}
                </div>
              </div>
            </div>
          </div>

          {/* Info adicional */}
          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4">
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              <span className="font-semibold">Nota:</span> Para cambiar tu contraseña o información personal, contacta con el administrador del sistema.
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          Última actualización: {new Date().toLocaleDateString("es-CL")}
        </p>
      </div>
    </div>
  );
}
