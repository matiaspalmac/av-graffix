import { redirect } from "next/navigation";
import { sql } from "drizzle-orm";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/rbac";
import { ModuleShell } from "@/components/erp/module-shell";
import { db } from "@/db/client";
import { roles, users } from "@/db/schema";

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

  return (
    <ModuleShell
      title="Administración"
      description="Gestión de usuarios, roles y parámetros base del ERP."
      kpis={[
        { label: "Usuarios", value: String(usersCount[0]?.v ?? 0) },
        { label: "Roles", value: String(rolesCount[0]?.v ?? 0) },
        { label: "Usuarios activos", value: String(activeUsersCount[0]?.v ?? 0) },
      ]}
    />
  );
}
