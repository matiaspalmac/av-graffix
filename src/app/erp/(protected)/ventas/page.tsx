import { sql } from "drizzle-orm";
import { db } from "@/db/client";
import { clients, leads, quotes } from "@/db/schema";
import { formatCLP } from "@/lib/format";
import {
  addQuoteItemAction,
  availableClients,
  convertQuoteToProjectAction,
  createClientAction,
  createQuoteAction,
  deleteQuoteAction,
  deleteQuoteItemAction,
  latestQuotesWithItems,
  updateQuoteStatusAction,
} from "@/app/erp/(protected)/ventas/actions";
import { SubmitButton } from "@/components/erp/submit-button";

export default async function VentasPage() {
  const [leadsOpen, clientsTotal, quotesOpen] = await Promise.all([
    db.select({ v: sql<number>`count(*)` }).from(leads).where(sql`${leads.status} not in ('won','lost')`),
    db.select({ v: sql<number>`count(*)` }).from(clients),
    db.select({ v: sql<number>`count(*)` }).from(quotes).where(sql`${quotes.status} in ('draft','sent','approved')`),
  ]);

  const [clientOptions, recentQuotes] = await Promise.all([availableClients(), latestQuotesWithItems()]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">CRM & Ventas</h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">Cotizaciones reales para etiquetas, folletería, papelería y soportes gráficos.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Leads activos</p>
          <p className="mt-2 text-2xl font-black">{String(leadsOpen[0]?.v ?? 0)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Clientes</p>
          <p className="mt-2 text-2xl font-black">{String(clientsTotal[0]?.v ?? 0)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Cotizaciones abiertas</p>
          <p className="mt-2 text-2xl font-black">{String(quotesOpen[0]?.v ?? 0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <form action={createClientAction} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
          <h3 className="text-lg font-bold">Nuevo cliente</h3>
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
              <span className="text-zinc-600 dark:text-zinc-300">Giro</span>
              <input name="giro" placeholder="Ej: Importación" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Contacto</span>
              <input name="contactName" placeholder="Ej: Juan Pérez" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Email de contacto</span>
              <input name="contactEmail" placeholder="contacto@empresa.cl" type="email" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
          </div>
          <SubmitButton>Guardar cliente</SubmitButton>
        </form>

        <form action={createQuoteAction} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
          <h3 className="text-lg font-bold">Nueva cotización</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Cliente</span>
              <select name="clientId" required className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
                <option value="">Selecciona cliente</option>
                {clientOptions.map((client) => (
                  <option key={client.id} value={client.id}>{client.tradeName} · {client.rut}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Categoría</span>
              <input name="serviceCategory" placeholder="Categoría (ej. etiquetas)" required className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm sm:col-span-2">
              <span className="text-zinc-600 dark:text-zinc-300">Descripción del servicio</span>
              <input name="description" placeholder="Ej: Diseño de etiqueta" required className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Cantidad</span>
              <input name="qty" type="number" step="0.01" defaultValue="1" required className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Unidad</span>
              <input name="unit" placeholder="Ej: m², ml, un" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Valor unitario CLP</span>
              <input name="unitPriceClp" type="number" step="1" defaultValue="0" required placeholder="0" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Horas estimadas</span>
              <input name="hoursEstimated" type="number" step="0.25" defaultValue="0" placeholder="0" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm sm:col-span-2">
              <span className="text-zinc-600 dark:text-zinc-300">Costo material estimado CLP</span>
              <input name="materialEstimatedCostClp" type="number" step="1" defaultValue="0" placeholder="0" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
          </div>
          <SubmitButton>Guardar cotización</SubmitButton>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold">Cotizaciones recientes (detalle multiproducto)</h3>
        {recentQuotes.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 text-sm text-zinc-500 dark:text-zinc-400">
            Aún no hay cotizaciones registradas.
          </div>
        ) : (
          recentQuotes.map((quote) => (
          <div key={quote.id} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-4">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
              <div>
                <p className="font-bold text-zinc-900 dark:text-zinc-100">{quote.quoteNumber} · {quote.clientName ?? "-"}</p>
                <p className="text-sm text-zinc-500">{new Date(quote.issueDate).toLocaleDateString("es-CL")} · Subtotal {formatCLP(quote.subtotalClp)} · IVA {formatCLP(quote.taxClp)} · Total {formatCLP(quote.totalClp)}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <form action={updateQuoteStatusAction} className="inline-flex gap-2">
                  <input type="hidden" name="quoteId" value={quote.id} />
                  <select name="status" defaultValue={quote.status} className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1 text-sm">
                    <option value="draft">Borrador</option>
                    <option value="sent">Enviada</option>
                    <option value="approved">Aprobada</option>
                    <option value="rejected">Rechazada</option>
                  </select>
                  <SubmitButton className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-2 py-1 text-sm transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">Guardar</SubmitButton>
                </form>

                <form action={deleteQuoteAction}>
                  <input type="hidden" name="quoteId" value={quote.id} />
                  <button className="rounded-lg border border-red-200 text-red-700 dark:border-red-900/40 dark:text-red-300 px-2 py-1 text-sm hover:bg-red-50 dark:hover:bg-red-900/20">Eliminar</button>
                </form>

                {quote.status === "approved" && !quote.projectId ? (
                  <form action={convertQuoteToProjectAction}>
                    <input type="hidden" name="quoteId" value={quote.id} />
                    <SubmitButton className="rounded-lg bg-brand-600 text-white px-3 py-1.5 text-sm font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">Crear proyecto</SubmitButton>
                  </form>
                ) : null}

                {quote.projectId ? (
                  <span className="rounded-lg border border-emerald-300 dark:border-emerald-800 px-3 py-1.5 text-sm text-emerald-700 dark:text-emerald-300">
                    Proyecto #{quote.projectId} creado
                  </span>
                ) : null}
              </div>
            </div>

            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                    <th className="py-2">#</th>
                    <th className="py-2">Descripción</th>
                    <th className="py-2">Categoría</th>
                    <th className="py-2">Cantidad</th>
                    <th className="py-2">Unitario</th>
                    <th className="py-2">Total</th>
                    <th className="py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.items.map((item) => (
                    <tr key={item.id} className="border-b border-zinc-100 dark:border-zinc-800/60">
                      <td className="py-2">{item.lineNo}</td>
                      <td className="py-2">{item.description}</td>
                      <td className="py-2">{item.serviceCategory}</td>
                      <td className="py-2">{item.qty} {item.unit}</td>
                      <td className="py-2">{formatCLP(item.unitPriceClp)}</td>
                      <td className="py-2">{formatCLP(item.lineTotalClp)}</td>
                      <td className="py-2">
                        <form action={deleteQuoteItemAction}>
                          <input type="hidden" name="quoteItemId" value={item.id} />
                          <input type="hidden" name="quoteId" value={quote.id} />
                          <button className="rounded-lg border border-red-200 text-red-700 dark:border-red-900/40 dark:text-red-300 px-2 py-1 text-xs hover:bg-red-50 dark:hover:bg-red-900/20">Eliminar ítem</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <form action={addQuoteItemAction} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-2">
              <input type="hidden" name="quoteId" value={quote.id} />
              <input name="description" required placeholder="Nuevo ítem" className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1.5 xl:col-span-2" />
              <input name="serviceCategory" required placeholder="Categoría" className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1.5" />
              <input name="qty" type="number" step="0.01" required defaultValue="1" className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1.5" />
              <input name="unitPriceClp" type="number" step="1" required defaultValue="0" placeholder="Unitario CLP" className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1.5" />
              <SubmitButton className="rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-3 py-1.5 text-sm font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">Agregar ítem</SubmitButton>
            </form>
          </div>
          ))
        )}
      </div>
    </div>
  );
}
