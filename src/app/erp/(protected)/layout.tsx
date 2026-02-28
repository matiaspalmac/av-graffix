import { redirect } from "next/navigation";
import { Metadata, Viewport } from "next";
import { auth } from "@/auth";
import { sql, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { invoices, projects, materials, inventoryTransactions, users, userPreferences } from "@/db/schema";
import { ToastProvider } from "@/components/toast-provider";
import { ErpLayoutWrapper } from "@/components/erp/erp-layout-wrapper";
import { PwaSetup } from "@/components/erp/pwa-setup";
import { ErpPreferencesLoader } from "@/components/erp/preferences-loader";
import { Suspense } from "react";
import { Bell } from "lucide-react";
import { NotificationsBellWrapper } from "@/components/erp/notifications-bell-wrapper";

export const metadata: Metadata = {
  title: "AV GRAFFIX ERP",
  description: "Sistema de gestión inteligente de inventario, ventas y producción",
  manifest: "/erp-manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AV GRAFFIX",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#dc2626",
};

function monthStartISO() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}

export default async function ProtectedErpLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/erp/login");
  }

  const monthStart = monthStartISO();

  // Obtener preferencias y registrar último acceso
  const userRecord = await db
    .select({ id: users.id, lastLoginAt: users.lastLoginAt })
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  let userPrefs = {
    themeDarkMode: false,
    themeHighContrast: false,
  };

  if (userRecord.length) {
    const user = userRecord[0];

    // Actualizar último acceso si han pasado más de 30 minutos
    const now = new Date();
    const lastLogin = user.lastLoginAt ? new Date(user.lastLoginAt) : new Date(0);
    if (now.getTime() - lastLogin.getTime() > 30 * 60 * 1000) {
      await db.update(users)
        .set({ lastLoginAt: now.toISOString(), updatedAt: now.toISOString() })
        .where(eq(users.id, user.id));
    }

    const prefs = await db
      .select({
        themeDarkMode: userPreferences.themeDarkMode,
        themeHighContrast: userPreferences.themeHighContrast,
      })
      .from(userPreferences)
      .where(eq(userPreferences.userId, userRecord[0].id))
      .limit(1);

    if (prefs.length) {
      userPrefs = prefs[0];
    }
  }

  const [
    monthlyRevenueResult,
    activeProjectsResult,
  ] = await Promise.all([
    db
      .select({ value: sql<number>`coalesce(sum(${invoices.totalClp}),0)` })
      .from(invoices)
      .where(sql`${invoices.issueDate} >= ${monthStart}`),
    db
      .select({ value: sql<number>`count(*)` })
      .from(projects)
      .where(sql`${projects.status} = 'in_progress'`),
  ]);

  const monthlyRevenue = monthlyRevenueResult[0]?.value || 0;
  const activeProjects = activeProjectsResult[0]?.value || 0;

  return (
    <>
      <ToastProvider />
      <PwaSetup />
      <ErpPreferencesLoader {...userPrefs} />
      <ErpLayoutWrapper
        userName={session.user?.name}
        role={session.user?.role}
        monthlyRevenue={monthlyRevenue}
        activeProjects={activeProjects}
        notificationsSlot={
          <Suspense fallback={
            <button className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition animate-pulse" aria-label="Cargando Notificaciones">
              <Bell size={18} />
            </button>
          }>
            <NotificationsBellWrapper />
          </Suspense>
        }
      >
        {children}
      </ErpLayoutWrapper>
    </>
  );
}
