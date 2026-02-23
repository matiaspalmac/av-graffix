import { sql } from "drizzle-orm";
import { db } from "@/db/client";
import { formatCLP } from "@/lib/format";
import { invoices, payments } from "@/db/schema";
import {
  createInvoiceAction,
  deleteInvoiceAction,
  deletePaymentAction,
  financeFormOptions,
  latestInvoicesWithPayments,
  registerPaymentAction,
  updateInvoiceStatusAction,
} from "@/app/erp/(protected)/finanzas/actions";

export default async function FinanzasPage() {
  const [invoiced, collected, pendingDocs, overdueDocs] = await Promise.all([
    db.select({ v: sql<number>`coalesce(sum(${invoices.totalClp}),0)` }).from(invoices),
    db.select({ v: sql<number>`coalesce(sum(${payments.amountClp}),0)` }).from(payments),
    db.select({ v: sql<number>`count(*)` }).from(invoices).where(sql`${invoices.status} in ('issued','partial','overdue')`),
    db.select({ v: sql<number>`count(*)` }).from(invoices).where(sql`${invoices.status} = 'overdue'`),
  ]);

  const [{ clientOptions, projectOptions, quoteOptions, invoiceOptions }, recentInvoices] = await Promise.all([
    financeFormOptions(),
    latestInvoicesWithPayments(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">Finanzas & Facturación</h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">Emisión de facturas, registro de pagos y control de cobranza en CLP.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Facturado acumulado</p>
          <p className="mt-2 text-2xl font-black">{formatCLP(Number(invoiced[0]?.v ?? 0))}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Cobrado acumulado</p>
          <p className="mt-2 text-2xl font-black">{formatCLP(Number(collected[0]?.v ?? 0))}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Facturas pendientes</p>
          <p className="mt-2 text-2xl font-black">{String(pendingDocs[0]?.v ?? 0)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Facturas vencidas</p>
          <p className="mt-2 text-2xl font-black">{String(overdueDocs[0]?.v ?? 0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <form action={createInvoiceAction} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
          <h3 className="text-lg font-bold">Emitir factura</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select name="clientId" required className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 sm:col-span-2">
              <option value="">Cliente</option>
              {clientOptions.map((client) => (
                <option key={client.id} value={client.id}>{client.tradeName}</option>
              ))}
            </select>
            <select name="projectId" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
              <option value="">Proyecto (opcional)</option>
              {projectOptions.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
            <select name="quoteId" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
              <option value="">Cotización (opcional)</option>
              {quoteOptions.map((quote) => (
                <option key={quote.id} value={quote.id}>{quote.quoteNumber}</option>
              ))}
            </select>
            <input name="subtotalClp" type="number" step="1" required defaultValue="0" placeholder="Subtotal CLP" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            <input name="siiFolio" placeholder="Folio SII (opcional)" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            <input name="dueDate" type="date" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            <input name="paymentTermsDays" type="number" step="1" defaultValue="30" placeholder="Plazo días" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
          </div>
          <button className="rounded-xl bg-brand-600 text-white px-4 py-2 font-semibold">Emitir factura</button>
        </form>

        <form action={registerPaymentAction} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
          <h3 className="text-lg font-bold">Registrar pago</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select name="invoiceId" required className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 sm:col-span-2">
              <option value="">Factura</option>
              {invoiceOptions.map((invoice) => (
                <option key={invoice.id} value={invoice.id}>{invoice.invoiceNumber} · {formatCLP(invoice.totalClp)}</option>
              ))}
            </select>
            <input name="amountClp" type="number" step="1" required defaultValue="0" placeholder="Monto CLP" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            <select name="method" defaultValue="transfer" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
              <option value="transfer">Transferencia</option>
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
              <option value="cheque">Cheque</option>
            </select>
            <input name="paymentDate" type="date" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            <input name="bankReference" placeholder="Referencia bancaria" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
          </div>
          <button className="rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-4 py-2 font-semibold">Registrar pago</button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold">Facturas recientes</h3>
        {recentInvoices.map((invoice) => (
          <div key={invoice.id} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-4">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
              <div>
                <p className="font-bold text-zinc-900 dark:text-zinc-100">{invoice.invoiceNumber} · {invoice.clientName ?? "-"}</p>
                <p className="text-sm text-zinc-500">
                  Emisión {new Date(invoice.issueDate).toLocaleDateString("es-CL")} · Vence {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString("es-CL") : "-"}
                </p>
                <p className="text-sm text-zinc-500">
                  Total {formatCLP(invoice.totalClp)} · Cobrado {formatCLP(invoice.paidClp)} · Pendiente {formatCLP(invoice.pendingClp)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <form action={updateInvoiceStatusAction} className="inline-flex gap-2">
                  <input type="hidden" name="invoiceId" value={invoice.id} />
                  <select name="status" defaultValue={invoice.status} className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1 text-sm">
                    <option value="issued">Emitida</option>
                    <option value="partial">Parcial</option>
                    <option value="paid">Pagada</option>
                    <option value="overdue">Vencida</option>
                    <option value="cancelled">Anulada</option>
                  </select>
                  <button className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-2 py-1 text-sm">Guardar</button>
                </form>

                <form action={deleteInvoiceAction}>
                  <input type="hidden" name="invoiceId" value={invoice.id} />
                  <button className="rounded-lg border border-red-200 text-red-700 dark:border-red-900/40 dark:text-red-300 px-2 py-1 text-sm">Eliminar</button>
                </form>
              </div>
            </div>

            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                    <th className="py-2">Fecha</th>
                    <th className="py-2">Monto</th>
                    <th className="py-2">Método</th>
                    <th className="py-2">Referencia</th>
                    <th className="py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.payments.map((payment) => (
                    <tr key={payment.id} className="border-b border-zinc-100 dark:border-zinc-800/60">
                      <td className="py-2">{new Date(payment.paymentDate).toLocaleDateString("es-CL")}</td>
                      <td className="py-2">{formatCLP(payment.amountClp)}</td>
                      <td className="py-2">{payment.method}</td>
                      <td className="py-2">{payment.bankReference ?? "-"}</td>
                      <td className="py-2">
                        <form action={deletePaymentAction}>
                          <input type="hidden" name="paymentId" value={payment.id} />
                          <input type="hidden" name="invoiceId" value={invoice.id} />
                          <button className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-2 py-1 text-xs">Eliminar pago</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
