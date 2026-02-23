import { sql } from "drizzle-orm";
import { ModuleShell } from "@/components/erp/module-shell";
import { db } from "@/db/client";
import { inventoryTransactions, materials, supplierMaterialPrices } from "@/db/schema";

export default async function InventarioPage() {
  const [materialsTotal, stockMovements, currentPrices] = await Promise.all([
    db.select({ v: sql<number>`count(*)` }).from(materials).where(sql`${materials.isActive} = 1`),
    db.select({ v: sql<number>`count(*)` }).from(inventoryTransactions),
    db.select({ v: sql<number>`count(*)` }).from(supplierMaterialPrices).where(sql`${supplierMaterialPrices.isCurrent} = 1`),
  ]);

  return (
    <ModuleShell
      title="Inventario & Materiales"
      description="Catálogo técnico, kardex y alertas de stock para vinilos, tintas, telas y papeles."
      kpis={[
        { label: "Materiales activos", value: String(materialsTotal[0]?.v ?? 0) },
        { label: "Movimientos kardex", value: String(stockMovements[0]?.v ?? 0) },
        { label: "Precios vigentes", value: String(currentPrices[0]?.v ?? 0) },
      ]}
    />
  );
}
