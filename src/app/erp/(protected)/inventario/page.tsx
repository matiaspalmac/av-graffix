import { sql } from "drizzle-orm";
import { db } from "@/db/client";
import { inventoryTransactions, materials, supplierMaterialPrices } from "@/db/schema";
import { formatCLP } from "@/lib/format";
import {
  createMaterialAction,
  createMaterialPriceAction,
  deleteMaterialAction,
  inventoryFormOptions,
  latestInventoryMovements,
  latestMaterialsWithStock,
  registerInventoryMoveAction,
  toggleMaterialActiveAction,
} from "@/app/erp/(protected)/inventario/actions";
import { DeleteMaterialForm } from "@/components/erp/delete-material-form";
import { SubmitButton } from "@/components/erp/submit-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Package, Activity } from "lucide-react";

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
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">SKU</span>
              <input name="sku" required placeholder="Ej: MAT-001" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Nombre</span>
              <input name="name" required placeholder="Ej: Vinilo adhesivo" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Categoría</span>
              <input name="category" required placeholder="Ej: Vinilos" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Unidad base</span>
              <input name="baseUnit" placeholder="Ej: m², ml, kg, un" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Stock mínimo</span>
              <input name="reorderPoint" type="number" step="0.01" defaultValue="0" placeholder="0" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Merma predeterminada (%)</span>
              <input name="defaultWastePct" type="number" step="0.01" defaultValue="5" placeholder="5" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
          </div>
          <SubmitButton>Guardar material</SubmitButton>
        </form>

        <form action={registerInventoryMoveAction} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
          <h3 className="text-lg font-bold">Movimiento manual de stock</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="grid gap-1 text-sm sm:col-span-2">
              <span className="text-zinc-600 dark:text-zinc-300">Material</span>
              <select name="materialId" required className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
                <option value="">Selecciona material</option>
                {materialOptions.map((material) => (
                  <option key={material.id} value={material.id}>{material.name} · {material.sku}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Tipo de movimiento</span>
              <select name="moveType" defaultValue="in" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
                <option value="in">Entrada</option>
                <option value="out">Salida</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Bodega</span>
              <input name="warehouse" defaultValue="principal" placeholder="Ej: principal, secundaria" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Cantidad</span>
              <input name="qty" type="number" step="0.01" defaultValue="0" required placeholder="0" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Costo unitario CLP</span>
              <input name="unitCostClp" type="number" step="1" defaultValue="0" placeholder="0" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
          </div>
          <SubmitButton variant="secondary">Registrar movimiento</SubmitButton>
        </form>

        <form action={createMaterialPriceAction} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
          <h3 className="text-lg font-bold">Precio vigente proveedor</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="grid gap-1 text-sm sm:col-span-2">
              <span className="text-zinc-600 dark:text-zinc-300">Proveedor</span>
              <select name="supplierId" required className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
                <option value="">Selecciona proveedor</option>
                {supplierOptions.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>{supplier.tradeName}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm sm:col-span-2">
              <span className="text-zinc-600 dark:text-zinc-300">Material</span>
              <select name="materialId" required className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
                <option value="">Selecciona material</option>
                {materialOptions.map((material) => (
                  <option key={material.id} value={material.id}>{material.name}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Precio CLP</span>
              <input name="priceClp" type="number" step="1" defaultValue="0" required placeholder="0" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Lead time (días)</span>
              <input name="leadTimeDays" type="number" step="1" defaultValue="5" placeholder="5" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
          </div>
          <SubmitButton>Guardar precio</SubmitButton>
        </form>
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 overflow-auto">
        <h3 className="text-lg font-bold mb-4">Materiales</h3>
        {materialRows.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Package}
              title="El catálogo está vacío"
              description="Aún no tienes materiales registrados."
              action={{
                label: "Crear desde el formulario",
                onClick: () => {
                  if (typeof document !== 'undefined') {
                    const skuInput = document.querySelector('input[name="sku"]') as HTMLInputElement;
                    if (skuInput) skuInput.focus();
                  }
                }
              }}
            />
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="sticky top-0 bg-white dark:bg-zinc-900 z-10">
                <tr className="text-left text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                  <th className="py-2">SKU</th>
                  <th className="py-2">Material</th>
                  <th className="py-2">Categoría</th>
                  <th className="py-2">Stock</th>
                  <th className="py-2">Mínimo</th>
                  <th className="py-2">Precio actual</th>
                  <th className="py-2">Acciones</th>
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
                      <div className="flex flex-wrap gap-2">
                        <form action={toggleMaterialActiveAction}>
                          <input type="hidden" name="materialId" value={material.id} />
                          <input type="hidden" name="isActive" value={material.isActive ? "1" : "0"} />
                          <button className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-2 py-1 text-xs">
                            {material.isActive ? "Desactivar" : "Activar"}
                          </button>
                        </form>
                        <DeleteMaterialForm materialId={material.id} action={deleteMaterialAction} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>        </div>)}
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 overflow-auto">
        <h3 className="text-lg font-bold mb-4">Últimos movimientos</h3>
        {movementRows.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Activity}
              title="Aún no hay movimientos de kardex"
              description="Los movimientos se generan automáticamente al recibir OC o registrar consumos."
            />
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="sticky top-0 bg-white dark:bg-zinc-900 z-10">
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
        )}
      </div>
    </div>
  );
}
