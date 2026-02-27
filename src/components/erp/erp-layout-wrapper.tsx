"use client";

import { ReactNode } from "react";
import { SidebarProvider, useSidebar } from "./sidebar-provider";
import { ErpSidebar } from "./sidebar";
import { ErpTopbar } from "./topbar";
import { Breadcrumbs } from "./breadcrumbs";
import { OfflineIndicator } from "./offline-indicator";
import { cn } from "@/lib/utils";

interface ErpLayoutWrapperProps {
  children: ReactNode;
  userName?: string | null;
  role?: string | null;
  monthlyRevenue: number;
  activeProjects: number;
  criticalStock: number;
  overdueInvoices: number;
}

function ErpLayoutContent({
  children,
  userName,
  role,
  monthlyRevenue,
  activeProjects,
  criticalStock,
  overdueInvoices,
}: ErpLayoutWrapperProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="erp-theme min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <ErpTopbar
        userName={userName}
        role={role}
        monthlyRevenue={monthlyRevenue}
        activeProjects={activeProjects}
        criticalStockCount={criticalStock}
        overdueInvoicesCount={overdueInvoices}
      />
      <div className="flex pt-16">
        <ErpSidebar role={role} />
        <div
          className={cn(
            "flex-1 flex flex-col min-w-0 transition-all duration-300",
            isCollapsed ? "lg:ml-[72px]" : "lg:ml-64"
          )}
        >
          <div className="px-4 sm:px-6 lg:px-4 pt-4 pb-2">
            <Breadcrumbs />
          </div>
          <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
          <footer className="px-4 sm:px-6 lg:px-8 py-4 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center justify-center gap-4">
              <span>ERP v1.0</span>
              <span>•</span>
              <span>
                Creado por{" "}
                <a
                  href="https://www.linkedin.com/in/matiaspalmac/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Matías Palma
                </a>
              </span>
              <span>•</span>
              <span>© 2026 AV GRAFFIX</span>
            </div>
          </footer>
        </div>
      </div>

      <OfflineIndicator />
    </div>
  );
}

export function ErpLayoutWrapper(props: ErpLayoutWrapperProps) {
  return (
    <SidebarProvider>
      <ErpLayoutContent {...props} />
    </SidebarProvider>
  );
}
