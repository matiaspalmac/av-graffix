import { sql } from "drizzle-orm";
import { db } from "@/db/client";
import { purchaseOrders, suppliers } from "@/db/schema";
import { formatCLP } from "@/lib/format";
import {
  addPurchaseOrderItemAction,
  cancelPurchaseOrderAction,
  createPurchaseOrderAction,
  createSupplierAction,
  deletePurchaseOrderAction,
  deletePurchaseOrderItemAction,
  latestPurchaseOrdersWithItems,
  purchaseFormOptions,
  receivePurchaseOrderItemAction,
  updatePurchaseOrderStatusAction,
} from "@/app/erp/(protected)/compras/actions";
import { SubmitButton } from "@/components/erp/submit-button";
import { DeletePurchaseOrderForm } from "@/components/erp/delete-purchase-order-form";
import { CancelPurchaseOrderForm } from "@/components/erp/cancel-purchase-order-form";
import { DeletePurchaseOrderItemForm } from "@/components/erp/delete-purchase-order-item-form";

export default async function ComprasPage() {
  const [suppliersTotal, openOrders, delayedOrders] = await Promise.all([
    db.select({ v: sql<number>`count(*)` }).from(suppliers).where(sql`${suppliers.isActive} = 1`),
    db.select({ v: sql<number>`count(*)` }).from(purchaseOrders).where(sql`${purchaseOrders.status} in ('sent','partial')`),
    db
      .select({ v: sql<number>`count(*)` })
      .from(purchaseOrders)
      .where(sql`${purchaseOrders.status} in ('sent','partial') and ${purchaseOrders.expectedDate} < datetime('now')`),
  ]);

  const [{ supplierOptions, materialOptions }, recentOrders] = await Promise.all([
    purchaseFormOptions(),
    latestPurchaseOrdersWithItems(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">Compras & Proveedores</h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">Creación de proveedores, órdenes de compra, recepción parcial y cierre de OC.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Proveedores activos</p>
          <p className="mt-2 text-2xl font-black">{String(suppliersTotal[0]?.v ?? 0)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">OC abiertas</p>
          <p className="mt-2 text-2xl font-black">{String(openOrders[0]?.v ?? 0)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">OC atrasadas</p>
          <p className="mt-2 text-2xl font-black">{String(delayedOrders[0]?.v ?? 0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <form action={createSupplierAction} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
          <h3 className="text-lg font-bold">Nuevo proveedor</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Razón social</span>
              <input name="legalName" required placeholder="Ej: Empresa Ltda." className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Nombre comercial</span>
              <input name="tradeName" required placeholder="Ej: Empresa" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">RUT</span>
              <input name="rut" required placeholder="Ej: 12.345.678-9" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Nombre contacto</span>
              <input name="contactName" placeholder="Ej: Juan Pérez" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Email contacto</span>
              <input name="contactEmail" type="email" placeholder="contacto@empresa.cl" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Teléfono</span>
              <input name="contactPhone" placeholder="+56 9 1234 5678" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
          </div>
          <SubmitButton>Guardar proveedor</SubmitButton>
        </form>

        <form action={createPurchaseOrderAction} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
          <h3 className="text-lg font-bold">Nueva orden de compra</h3>
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
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Fecha esperada</span>
              <input name="expectedDate" type="date" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Estado</span>
              <select name="status" defaultValue="draft" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
                <option value="draft">Borrador</option>
                <option value="sent">Enviada</option>
                <option value="partial">Parcial</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Despacho CLP</span>
              <input name="shippingClp" type="number" step="1" defaultValue="0" placeholder="0" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Descuento CLP</span>
              <input name="discountClp" type="number" step="1" defaultValue="0" placeholder="0" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
          </div>
          <SubmitButton variant="secondary">Crear OC</SubmitButton>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold">Órdenes de compra recientes</h3>
        {recentOrders.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 text-center">
            <p className="text-zinc-500 dark:text-zinc-400">No hay órdenes de compra registradas aún.</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">Crea tu primera orden usando el formulario de arriba.</p>
          </div>
        ) : (
          recentOrders.map((order) => (
          <div key={order.id} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-4">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
              <div>
                <p className="font-bold text-zinc-900 dark:text-zinc-100">{order.poNumber} · {order.supplierName ?? "-"}</p>
                <p className="text-sm text-zinc-500">
                  {new Date(order.issueDate).toLocaleDateString("es-CL")} · Subtotal {formatCLP(order.subtotalClp)} · IVA {formatCLP(order.taxClp)} · Total {formatCLP(order.totalClp)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <form action={updatePurchaseOrderStatusAction} className="inline-flex gap-2">
                  <input type="hidden" name="purchaseOrderId" value={order.id} />
                  <select name="status" defaultValue={order.status} className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1 text-sm">
                    <option value="draft">Borrador</option>
                    <option value="sent">Enviada</option>
                    <option value="partial">Parcial</option>
                    <option value="received">Recibida</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                  <SubmitButton className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-2 py-1 text-sm transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">Guardar</SubmitButton>
                </form>

                <DeletePurchaseOrderForm purchaseOrderId={order.id} action={deletePurchaseOrderAction} />

                {order.status !== "cancelled" ? (
                  <CancelPurchaseOrderForm purchaseOrderId={order.id} action={cancelPurchaseOrderAction} />
                ) : null}
              </div>
            </div>

            <div className="overflow-x-auto -mx-5 px-5">
              <table className="w-full text-sm min-w-[900px]">
                <thead className="sticky top-0 bg-white dark:bg-zinc-900">
                  <tr className="text-left text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                    <th className="py-2">#</th>
                    <th className="py-2">Material</th>
                    <th className="py-2">Cant.</th>
                    <th className="py-2">Recibido</th>
                    <th className="py-2">Unitario</th>
                    <th className="py-2">Total</th>
                    <th className="py-2">Recepción</th>
                    <th className="py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b border-zinc-100 dark:border-zinc-800/60">
                      <td className="py-2">{item.lineNo}</td>
                      <td className="py-2">{item.materialName ?? "-"}</td>
                      <td className="py-2">{Number(item.qty).toFixed(2)} {item.unit}</td>
                      <td className="py-2">{Number(item.receivedQty).toFixed(2)}</td>
                      <td className="py-2">{formatCLP(item.unitPriceClp)}</td>
                      <td className="py-2">{formatCLP(item.lineTotalClp)}</td>
                      <td className="py-2">
                        <form action={receivePurchaseOrderItemAction} className="flex items-center gap-2">
                          <input type="hidden" name="poItemId" value={item.id} />
                          <input name="receivedNow" type="number" step="0.01" defaultValue="0" className="w-24 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1" />
                          <button className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-2 py-1 text-xs">Recibir</button>
                        </form>
                      </td>
                      <td className="py-2">
                        <DeletePurchaseOrderItemForm
                          poItemId={item.id}
                          purchaseOrderId={order.id}
                          action={deletePurchaseOrderItemAction}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <form action={addPurchaseOrderItemAction} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-2">
              <input type="hidden" name="purchaseOrderId" value={order.id} />
              <select name="materialId" required className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1.5 xl:col-span-2">
                <option value="">Material</option>
                {materialOptions.map((material) => (
                  <option key={material.id} value={material.id}>{material.name}</option>
                ))}
              </select>
              <input name="qty" type="number" step="0.01" required defaultValue="1" className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1.5" />
              <input name="unitPriceClp" type="number" step="1" required defaultValue="0" placeholder="Unitario CLP" className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1.5" />
              <input name="lineDiscountClp" type="number" step="1" defaultValue="0" placeholder="Desc. CLP" className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1.5" />
              <SubmitButton className="rounded-lg bg-brand-600 text-white px-3 py-1.5 text-sm font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">Agregar ítem</SubmitButton>
            </form>
          </div>
        ))  
        )}
      </div>
    </div>
  );
}
