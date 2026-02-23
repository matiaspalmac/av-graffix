import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ErpSidebar } from "@/components/erp/sidebar";
import { ErpTopbar } from "@/components/erp/topbar";

export default async function ProtectedErpLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/erp/login");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="flex">
        <ErpSidebar />
        <div className="min-w-0 flex-1">
          <ErpTopbar userName={session.user.name} role={session.user.role} />
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
