import { sql } from "drizzle-orm";
import { db } from "@/db/client";
import { inventoryTransactions, materials, supplierMaterialPrices } from "@/db/schema";
import { formatCLP } from "@/lib/format";
import {
  createMaterialAction,
  createMaterialPriceAction,
  inventoryFormOptions,
  latestInventoryMovements,
  latestMaterialsWithStock,
  registerInventoryMoveAction,
  toggleMaterialActiveAction,
} from "@/app/erp/(protected)/inventario/actions";

export default async function InventarioPage() {
  const [materialsTotal, stockMovements, currentPrices, lowStock] = await Promise.all([
    db.select({ v: sql<number>`count(*)` }).from(materials).where(sql`${materials.isActive} = 1`),
    db.select({ v: sql<number>`count(*)` }).from(inventoryTransactions),
    db.select({ v: sql<number>`count(*)` }).from(supplierMaterialPrices).where(sql`${supplierMaterialPrices.isCurrent} = 1`),
    db
      .select({ v: sql<number>`count(*)` })
      .from(materials)
      .where(
        sql`coalesce((select sum(${inventoryTransactions.qtyIn} - ${inventoryTransactions.qtyOut}) from ${inventoryTransactions} where ${inventoryTransactions.materialId} = ${materials.id}),0) <= ${materials.reorderPoint}`
      ),
  ]);

  const [{ materialOptions, supplierOptions }, materialRows, movementRows] = await Promise.all([
    inventoryFormOptions(),
    latestMaterialsWithStock(),
    latestInventoryMovements(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">Inventario & Materiales</h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">Catálogo técnico, kardex y precios de proveedores con control de stock mínimo.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Materiales activos</p>
          <p className="mt-2 text-2xl font-black">{String(materialsTotal[0]?.v ?? 0)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Movimientos kardex</p>
          <p className="mt-2 text-2xl font-black">{String(stockMovements[0]?.v ?? 0)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Precios vigentes</p>
          <p className="mt-2 text-2xl font-black">{String(currentPrices[0]?.v ?? 0)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">En punto de reposición</p>
          <p className="mt-2 text-2xl font-black">{String(lowStock[0]?.v ?? 0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <form action={createMaterialAction} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
          <h3 className="text-lg font-bold">Nuevo material</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input name="sku" required placeholder="SKU" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            <input name="name" required placeholder="Nombre" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            <input name="category" required placeholder="Categoría" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            <input name="baseUnit" defaultValue="unit" placeholder="Unidad base" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            <input name="reorderPoint" type="number" step="0.01" defaultValue="0" placeholder="Stock mínimo" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            <input name="defaultWastePct" type="number" step="0.01" defaultValue="5" placeholder="Merma %" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
          </div>
          <button className="rounded-xl bg-brand-600 text-white px-4 py-2 font-semibold">Guardar material</button>
        </form>

        <form action={registerInventoryMoveAction} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
          <h3 className="text-lg font-bold">Movimiento manual de stock</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select name="materialId" required className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 sm:col-span-2">
              <option value="">Material</option>
              {materialOptions.map((material) => (
                <option key={material.id} value={material.id}>{material.name} · {material.sku}</option>
              ))}
            </select>
            <select name="moveType" defaultValue="in" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
              <option value="in">Entrada</option>
              <option value="out">Salida</option>
            </select>
            <input name="warehouse" defaultValue="principal" placeholder="Bodega" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            <input name="qty" type="number" step="0.01" defaultValue="0" required placeholder="Cantidad" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            <input name="unitCostClp" type="number" step="1" defaultValue="0" placeholder="Costo unitario CLP" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
          </div>
          <button className="rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-4 py-2 font-semibold">Registrar movimiento</button>
        </form>

        <form action={createMaterialPriceAction} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
          <h3 className="text-lg font-bold">Precio vigente proveedor</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select name="supplierId" required className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 sm:col-span-2">
              <option value="">Proveedor</option>
              {supplierOptions.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>{supplier.tradeName}</option>
              ))}
            </select>
            <select name="materialId" required className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 sm:col-span-2">
              <option value="">Material</option>
              {materialOptions.map((material) => (
                <option key={material.id} value={material.id}>{material.name}</option>
              ))}
            </select>
            <input name="priceClp" type="number" step="1" defaultValue="0" required placeholder="Precio CLP" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            <input name="leadTimeDays" type="number" step="1" defaultValue="5" placeholder="Lead time días" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
          </div>
          <button className="rounded-xl bg-brand-600 text-white px-4 py-2 font-semibold">Guardar precio</button>
        </form>
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 overflow-auto">
        <h3 className="text-lg font-bold">Materiales</h3>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
              <th className="py-2">SKU</th>
              <th className="py-2">Material</th>
              <th className="py-2">Categoría</th>
              <th className="py-2">Stock</th>
              <th className="py-2">Mínimo</th>
              <th className="py-2">Precio actual</th>
              <th className="py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {materialRows.map((material) => (
              <tr key={material.id} className="border-b border-zinc-100 dark:border-zinc-800/60">
                <td className="py-2">{material.sku}</td>
                <td className="py-2">{material.name}</td>
                <td className="py-2">{material.category}</td>
                <td className="py-2">{Number(material.stock).toFixed(2)} {material.baseUnit}</td>
                <td className="py-2">{Number(material.reorderPoint).toFixed(2)}</td>
                <td className="py-2">{formatCLP(material.currentPriceClp)}</td>
                <td className="py-2">
                  <form action={toggleMaterialActiveAction}>
                    <input type="hidden" name="materialId" value={material.id} />
                    <input type="hidden" name="isActive" value={material.isActive ? "1" : "0"} />
                    <button className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-2 py-1 text-xs">
                      {material.isActive ? "Desactivar" : "Activar"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 overflow-auto">
        <h3 className="text-lg font-bold">Últimos movimientos</h3>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
              <th className="py-2">Fecha</th>
              <th className="py-2">Material</th>
              <th className="py-2">Tipo</th>
              <th className="py-2">Entrada</th>
              <th className="py-2">Salida</th>
              <th className="py-2">Costo</th>
              <th className="py-2">Stock final</th>
            </tr>
          </thead>
          <tbody>
            {movementRows.map((row) => (
              <tr key={row.id} className="border-b border-zinc-100 dark:border-zinc-800/60">
                <td className="py-2">{new Date(row.txnDate).toLocaleDateString("es-CL")}</td>
                <td className="py-2">{row.materialName ?? "-"}</td>
                <td className="py-2">{row.txnType}</td>
                <td className="py-2">{Number(row.qtyIn).toFixed(2)}</td>
                <td className="py-2">{Number(row.qtyOut).toFixed(2)}</td>
                <td className="py-2">{formatCLP(row.totalCostClp)}</td>
                <td className="py-2">{Number(row.stockAfter).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
