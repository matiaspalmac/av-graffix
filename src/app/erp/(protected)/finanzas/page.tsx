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
import { SubmitButton } from "@/components/erp/submit-button";

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
            <label className="grid gap-1 text-sm sm:col-span-2">
              <span className="text-zinc-600 dark:text-zinc-300">Cliente</span>
              <select name="clientId" required className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
                <option value="">Cliente</option>
                {clientOptions.map((client) => (
                  <option key={client.id} value={client.id}>{client.tradeName}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Proyecto (opcional)</span>
              <select name="projectId" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
                <option value="">Proyecto (opcional)</option>
                {projectOptions.map((project) => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Cotización (opcional)</span>
              <select name="quoteId" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
                <option value="">Cotización (opcional)</option>
                {quoteOptions.map((quote) => (
                  <option key={quote.id} value={quote.id}>{quote.quoteNumber}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Subtotal CLP</span>
              <input name="subtotalClp" type="number" step="1" required defaultValue="0" placeholder="0" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Folio SII (opcional)</span>
              <input name="siiFolio" placeholder="Ej: 123456789" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Fecha de vencimiento</span>
              <input name="dueDate" type="date" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Plazo en días</span>
              <input name="paymentTermsDays" type="number" step="1" defaultValue="30" placeholder="30" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
          </div>
          <SubmitButton>Emitir factura</SubmitButton>
        </form>

        <form action={registerPaymentAction} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
          <h3 className="text-lg font-bold">Registrar pago</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="grid gap-1 text-sm sm:col-span-2">
              <span className="text-zinc-600 dark:text-zinc-300">Factura</span>
              <select name="invoiceId" required className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
                <option value="">Factura</option>
                {invoiceOptions.map((invoice) => (
                  <option key={invoice.id} value={invoice.id}>{invoice.invoiceNumber} · {formatCLP(invoice.totalClp)}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Monto CLP</span>
              <input name="amountClp" type="number" step="1" required defaultValue="0" placeholder="0" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Método</span>
              <select name="method" defaultValue="transfer" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
                <option value="transfer">Transferencia</option>
                <option value="cash">Efectivo</option>
                <option value="card">Tarjeta</option>
                <option value="cheque">Cheque</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Fecha de pago</span>
              <input name="paymentDate" type="date" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Referencia bancaria</span>
              <input name="bankReference" placeholder="Ej: TRX-123456" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
          </div>
          <SubmitButton variant="secondary">Registrar pago</SubmitButton>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold">Facturas recientes</h3>
        {recentInvoices.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 text-sm text-zinc-500 dark:text-zinc-400">
            Aún no hay facturas registradas.
          </div>
        ) : (
          recentInvoices.map((invoice) => (
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
                  <SubmitButton className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-2 py-1 text-sm transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">Guardar</SubmitButton>
                </form>

                <form action={deleteInvoiceAction}>
                  <input type="hidden" name="invoiceId" value={invoice.id} />
                  <button className="rounded-lg border border-red-200 text-red-700 dark:border-red-900/40 dark:text-red-300 px-2 py-1 text-sm hover:bg-red-50 dark:hover:bg-red-900/20">Eliminar</button>
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
                          <button className="rounded-lg border border-red-200 text-red-700 dark:border-red-900/40 dark:text-red-300 px-2 py-1 text-xs hover:bg-red-50 dark:hover:bg-red-900/20">Eliminar pago</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
}
