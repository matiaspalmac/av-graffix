import { sql } from "drizzle-orm";
import { ModuleShell } from "@/components/erp/module-shell";
import { db } from "@/db/client";
import { purchaseOrders, suppliers } from "@/db/schema";

export default async function ComprasPage() {
  const [suppliersTotal, openOrders, delayedOrders] = await Promise.all([
    db.select({ v: sql<number>`count(*)` }).from(suppliers).where(sql`${suppliers.isActive} = 1`),
    db.select({ v: sql<number>`count(*)` }).from(purchaseOrders).where(sql`${purchaseOrders.status} in ('sent','partial')`),
    db
      .select({ v: sql<number>`count(*)` })
      .from(purchaseOrders)
      .where(sql`${purchaseOrders.status} in ('sent','partial') and ${purchaseOrders.expectedDate} < datetime('now')`),
  ]);

  return (
    <ModuleShell
      title="Compras & Proveedores"
      description="Órdenes de compra, lead time y control de costos de abastecimiento."
      kpis={[
        { label: "Proveedores activos", value: String(suppliersTotal[0]?.v ?? 0) },
        { label: "OC abiertas", value: String(openOrders[0]?.v ?? 0) },
        { label: "OC atrasadas", value: String(delayedOrders[0]?.v ?? 0) },
      ]}
    />
  );
}
