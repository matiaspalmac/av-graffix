import { redirect } from "next/navigation";
import { sql } from "drizzle-orm";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/rbac";
import { db } from "@/db/client";
import { roles, users } from "@/db/schema";
import {
  adminFormOptions,
  createUserAction,
  latestUsersWithRole,
  resetUserPasswordAction,
  toggleUserActiveAction,
  deleteUserAction,
} from "@/app/erp/(protected)/admin/actions";
import { DeleteUserForm } from "@/components/erp/delete-user-form";
import { SubmitButton } from "@/components/erp/submit-button";

export default async function AdminPage() {
  const session = await auth();

  if (!isAdmin(session?.user?.role)) {
    redirect("/erp");
  }

  const [usersCount, rolesCount, activeUsersCount] = await Promise.all([
    db.select({ v: sql<number>`count(*)` }).from(users),
    db.select({ v: sql<number>`count(*)` }).from(roles),
    db.select({ v: sql<number>`count(*)` }).from(users).where(sql`${users.isActive} = 1`),
  ]);

  const [{ roleOptions }, userRows] = await Promise.all([
    adminFormOptions(),
    latestUsersWithRole(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">Administración</h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">Gestión de usuarios internos y control de acceso por rol.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Usuarios</p>
          <p className="mt-2 text-2xl font-black">{String(usersCount[0]?.v ?? 0)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Roles</p>
          <p className="mt-2 text-2xl font-black">{String(rolesCount[0]?.v ?? 0)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Usuarios activos</p>
          <p className="mt-2 text-2xl font-black">{String(activeUsersCount[0]?.v ?? 0)}</p>
        </div>
      </div>

      <form action={createUserAction} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
        <h3 className="text-lg font-bold">Crear usuario ERP</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-300">Nombre completo</span>
            <input name="fullName" required placeholder="Ej: Juan Pérez González" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-300">Email</span>
            <input name="email" required type="email" placeholder="usuario@avgraffix.cl" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-300">Teléfono</span>
            <input name="phone" placeholder="+56 9 1234 5678" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-300">Rol</span>
            <select name="roleId" required className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
              <option value="">Selecciona rol</option>
              {roleOptions.map((role) => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-300">Contraseña inicial</span>
            <input name="password" required type="password" placeholder="Mín. 8 caracteres" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
          </label>
        </div>
        <SubmitButton>Crear usuario</SubmitButton>
      </form>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 overflow-auto">
        <h3 className="text-lg font-bold mb-4">Usuarios internos</h3>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="sticky top-0 bg-white dark:bg-zinc-900 z-10">
              <tr className="text-left text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
              <th className="py-2">Nombre</th>
              <th className="py-2">Email</th>
              <th className="py-2">Rol</th>
              <th className="py-2">Último acceso</th>
              <th className="py-2">Estado</th>
              <th className="py-2">Seguridad</th>
            </tr>
          </thead>
          <tbody>
            {userRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  No hay usuarios registrados todavía.
                </td>
              </tr>
            ) : (
              userRows.map((user) => (
              <tr key={user.id} className="border-b border-zinc-100 dark:border-zinc-800/60">
                <td className="py-2">{user.fullName}</td>
                <td className="py-2">{user.email}</td>
                <td className="py-2">{user.roleName ?? user.roleCode ?? "-"}</td>
                <td className="py-2">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString("es-CL") : "-"}</td>
                <td className="py-2">
                  <form action={toggleUserActiveAction}>
                    <input type="hidden" name="userId" value={user.id} />
                    <input type="hidden" name="isActive" value={user.isActive ? "1" : "0"} />
                    <button className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-2 py-1 text-xs">
                      {user.isActive ? "Desactivar" : "Activar"}
                    </button>
                  </form>
                </td>
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <form action={resetUserPasswordAction} className="flex items-center gap-2">
                      <input type="hidden" name="userId" value={user.id} />
                      <input
                        name="newPassword"
                        required
                        type="password"
                        placeholder="Nueva contraseña"
                        className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1 text-xs"
                      />
                      <button className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-2 py-1 text-xs">Reset</button>
                    </form>
                    <DeleteUserForm userId={user.id} action={deleteUserAction} />
                  </div>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
