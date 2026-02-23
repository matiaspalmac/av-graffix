import { sql } from "drizzle-orm";
import { ModuleShell } from "@/components/erp/module-shell";
import { db } from "@/db/client";
import { formatCLP } from "@/lib/format";
import { invoices, payments } from "@/db/schema";

export default async function FinanzasPage() {
  const [invoiced, collected, pendingDocs] = await Promise.all([
    db.select({ v: sql<number>`coalesce(sum(${invoices.totalClp}),0)` }).from(invoices),
    db.select({ v: sql<number>`coalesce(sum(${payments.amountClp}),0)` }).from(payments),
    db.select({ v: sql<number>`count(*)` }).from(invoices).where(sql`${invoices.status} in ('issued','partial','overdue')`),
  ]);

  return (
    <ModuleShell
      title="Finanzas & Facturación"
      description="Control de emisión, cobranza y flujo de caja en CLP con referencia SII."
      kpis={[
        { label: "Facturado acumulado", value: formatCLP(Number(invoiced[0]?.v ?? 0)) },
        { label: "Cobrado acumulado", value: formatCLP(Number(collected[0]?.v ?? 0)) },
        { label: "Facturas pendientes", value: String(pendingDocs[0]?.v ?? 0) },
      ]}
    />
  );
}
