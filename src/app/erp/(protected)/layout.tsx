import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ErpSidebar } from "@/components/erp/sidebar";
import { ErpTopbar } from "@/components/erp/topbar";
import { ToastProvider } from "@/components/toast-provider";
import { getCompanySettings } from "@/lib/company-config";

export default async function ProtectedErpLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const company = await getCompanySettings();

  if (!session?.user) {
    redirect("/erp/login");
  }

  return (
    <>
      <ToastProvider />
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col">
        <div className="flex flex-col lg:flex-row flex-1">
          <ErpSidebar />
          <div className="min-w-0 flex-1 flex flex-col">
            <ErpTopbar userName={session.user.name} role={session.user.role} />
            <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
            <footer className="px-4 sm:px-6 lg:px-8 py-4 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-600 dark:text-zinc-400">
              {company.nameCommercial} – {company.city} – {company.phone} | © 2026 ERP
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
