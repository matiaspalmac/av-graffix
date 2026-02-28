import { formatCLP } from "@/lib/format";
import { FileText, MoreVertical, FileDown, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { allQuotesWithDetails, updateQuoteAction, updateQuoteItemAction, exportQuotesExcelAction, deleteQuoteAction } from "./actions";
import { SubmitButton } from "@/components/erp/submit-button";
import { ExportButton } from "@/components/erp/export-button";
import { DeleteQuoteForm } from "@/components/erp/delete-quote-form";

type TechnicalSheet = {
  general?: { siteContact?: string; sitePhone?: string; technician?: string };
  jobSpecs?: { workTypes?: string[]; workTypeOther?: string; locationType?: string };
  measurements?: {
    items?: Array<{ row: number; support: string; width: number; height: number; depth: number }>;
    surfaceType?: string;
    surfaceTypeOther?: string;
    observations?: string;
  };
  technicalConditions?: { requirements?: string[]; estimatedPersonnel?: number; estimatedTimeHours?: number };
  logistics?: { specialSchedule?: boolean; permitsRequired?: boolean; clientManagesPermits?: boolean; observations?: string };
};

function parseTechnicalSheet(rawSpecs: string | null | undefined): TechnicalSheet | null {
  if (!rawSpecs) {
    return null;
  }

  try {
    return JSON.parse(rawSpecs) as TechnicalSheet;
  } catch {
    return null;
  }
}

export default async function CotizacionesPage() {
  const quotesWithDetails = await allQuotesWithDetails();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">Cotizaciones</h2>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">Gestiona y edita todas tus cotizaciones en un solo lugar.</p>
        </div>
        {quotesWithDetails.length > 0 && (
          <ExportButton
            action={exportQuotesExcelAction}
            label="Exportar Excel"
            variant="primary"
            size="md"
          />
        )}
      </div>

      <div className="space-y-4">
        {quotesWithDetails.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={FileText}
              title="No hay cotizaciones registradas"
              description="Aún no se ha emitido ninguna cotización a los clientes."
              action={{
                label: "Crear Cotización",
                href: "/erp/cotizaciones/nueva"
              }}
            />
          </div>
        ) : (
          quotesWithDetails.map((quote) => {
            const technicalSheet = parseTechnicalSheet(quote.items[0]?.specsJson);

            return (
              <details
                key={quote.id}
                className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-bold text-zinc-900 dark:text-zinc-100">{quote.quoteNumber}</p>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${quote.status === "draft"
                          ? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                          : quote.status === "sent"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            : quote.status === "approved"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                          }`}
                      >
                        {quote.status === "draft" ? "Borrador" : quote.status === "sent" ? "Enviada" : quote.status === "approved" ? "Aprobada" : "Rechazada"}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                      {quote.clientName} · {new Date(quote.issueDate).toLocaleDateString("es-CL")} · Total {formatCLP(quote.totalClp)}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-zinc-400 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>

                <div className="border-t border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
                  <form action={updateQuoteAction} className="space-y-3">
                    <input type="hidden" name="quoteId" value={quote.id} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <label className="grid gap-1 text-sm">
                        <span className="text-zinc-600 dark:text-zinc-300">Estado</span>
                        <select
                          name="status"
                          defaultValue={quote.status}
                          className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                        >
                          <option value="draft">Borrador</option>
                          <option value="sent">Enviada</option>
                          <option value="approved">Aprobada</option>
                          <option value="rejected">Rechazada</option>
                        </select>
                      </label>

                      <label className="grid gap-1 text-sm">
                        <span className="text-zinc-600 dark:text-zinc-300">Válida hasta</span>
                        <input
                          type="date"
                          name="validUntil"
                          defaultValue={quote.validUntil ? new Date(quote.validUntil).toISOString().slice(0, 10) : ""}
                          className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                        />
                      </label>

                      <label className="grid gap-1 text-sm">
                        <span className="text-zinc-600 dark:text-zinc-300">Descuento CLP</span>
                        <input
                          type="number"
                          name="discountClp"
                          defaultValue={quote.discountClp}
                          step="1"
                          className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                        />
                      </label>

                      <div className="flex items-end gap-3">
                        <SubmitButton className="flex-1 rounded-xl bg-brand-600 text-white px-4 py-2 font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                          Guardar cambios
                        </SubmitButton>
                        <DeleteQuoteForm quoteId={quote.id} action={deleteQuoteAction} />
                      </div>
                    </div>

                    <label className="grid gap-1 text-sm">
                      <span className="text-zinc-600 dark:text-zinc-300">Términos y condiciones</span>
                      <textarea
                        name="termsText"
                        defaultValue={quote.termsText || ""}
                        rows={2}
                        placeholder="Ej: Validez 15 días. Valores en CLP + IVA."
                        className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                      />
                    </label>
                  </form>
                  <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-900/50">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-zinc-500 dark:text-zinc-400">Subtotal</p>
                        <p className="font-semibold">{formatCLP(quote.subtotalClp)}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500 dark:text-zinc-400">Descuento</p>
                        <p className="font-semibold">{formatCLP(quote.discountClp)}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500 dark:text-zinc-400">IVA (19%)</p>
                        <p className="font-semibold">{formatCLP(quote.taxClp)}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500 dark:text-zinc-400">Total</p>
                        <p className="font-bold text-brand-600">{formatCLP(quote.totalClp)}</p>
                      </div>
                    </div>
                  </div>
                  {technicalSheet && (
                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3 text-sm space-y-2">
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100">Ficha técnica</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-zinc-600 dark:text-zinc-300">
                        {technicalSheet.general?.siteContact && <p><strong>Contacto:</strong> {technicalSheet.general.siteContact}</p>}
                        {technicalSheet.general?.sitePhone && <p><strong>Teléfono:</strong> {technicalSheet.general.sitePhone}</p>}
                        {technicalSheet.general?.technician && <p><strong>Técnico:</strong> {technicalSheet.general.technician}</p>}
                        {technicalSheet.jobSpecs?.workTypes && technicalSheet.jobSpecs.workTypes.length > 0 && (
                          <p className="sm:col-span-2"><strong>Tipos trabajo:</strong> {technicalSheet.jobSpecs.workTypes.join(", ")}</p>
                        )}
                        {technicalSheet.jobSpecs?.workTypeOther && (
                          <p className="sm:col-span-2"><strong>Otro tipo:</strong> {technicalSheet.jobSpecs.workTypeOther}</p>
                        )}
                        {technicalSheet.jobSpecs?.locationType && <p><strong>Lugar:</strong> {technicalSheet.jobSpecs.locationType}</p>}
                        {technicalSheet.measurements?.surfaceType && <p><strong>Superficie:</strong> {technicalSheet.measurements.surfaceType}</p>}
                        {technicalSheet.measurements?.surfaceTypeOther && (
                          <p className="sm:col-span-2"><strong>Otro tipo superficie:</strong> {technicalSheet.measurements.surfaceTypeOther}</p>
                        )}
                        {technicalSheet.technicalConditions?.estimatedPersonnel != null && (
                          <p><strong>Personal:</strong> {technicalSheet.technicalConditions.estimatedPersonnel}</p>
                        )}
                        {technicalSheet.technicalConditions?.estimatedTimeHours != null && (
                          <p><strong>Tiempo:</strong> {technicalSheet.technicalConditions.estimatedTimeHours} h</p>
                        )}
                      </div>
                      {technicalSheet.measurements?.items && technicalSheet.measurements.items.length > 0 && (
                        <div className="pt-2">
                          <p className="font-semibold mb-1">Medidas:</p>
                          <div className="space-y-1">
                            {technicalSheet.measurements.items.map((m) => (
                              <p key={m.row} className="text-xs text-zinc-600 dark:text-zinc-400">
                                #{m.row}: {m.support || "-"} · {m.width}×{m.height}×{m.depth}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Ítems de la cotización</h4>
                    {quote.items.map((item) => (
                      <form
                        key={item.id}
                        action={updateQuoteItemAction}
                        className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3 space-y-3"
                      >
                        <input type="hidden" name="itemId" value={item.id} />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <label className="grid gap-1 text-sm lg:col-span-2">
                            <span className="text-zinc-600 dark:text-zinc-300">Descripción</span>
                            <input
                              name="description"
                              defaultValue={item.description}
                              required
                              className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                            />
                          </label>

                          <label className="grid gap-1 text-sm">
                            <span className="text-zinc-600 dark:text-zinc-300">Categoría</span>
                            <input
                              name="serviceCategory"
                              defaultValue={item.serviceCategory}
                              required
                              className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                            />
                          </label>

                          <label className="grid gap-1 text-sm">
                            <span className="text-zinc-600 dark:text-zinc-300">Cantidad</span>
                            <input
                              name="qty"
                              type="number"
                              step="0.01"
                              defaultValue={item.qty}
                              required
                              className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                            />
                          </label>

                          <label className="grid gap-1 text-sm">
                            <span className="text-zinc-600 dark:text-zinc-300">Precio unitario CLP</span>
                            <input
                              name="unitPriceClp"
                              type="number"
                              step="1"
                              defaultValue={item.unitPriceClp}
                              required
                              className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                            />
                          </label>

                          <label className="grid gap-1 text-sm">
                            <span className="text-zinc-600 dark:text-zinc-300">Horas estimadas</span>
                            <input
                              name="hoursEstimated"
                              type="number"
                              step="0.5"
                              defaultValue={item.hoursEstimated}
                              className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                            />
                          </label>

                          <label className="grid gap-1 text-sm">
                            <span className="text-zinc-600 dark:text-zinc-300">Costo material CLP</span>
                            <input
                              name="materialEstimatedCostClp"
                              type="number"
                              step="1"
                              defaultValue={item.materialEstimatedCostClp}
                              className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                            />
                          </label>

                          <div className="flex items-end lg:col-span-2">
                            <div className="flex-1 text-sm">
                              <p className="text-zinc-600 dark:text-zinc-300">Total línea</p>
                              <p className="font-bold text-lg">{formatCLP(item.lineTotalClp)}</p>
                            </div>
                          </div>

                          <div className="flex items-end">
                            <SubmitButton className="w-full rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-4 py-2 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                              Guardar ítem
                            </SubmitButton>
                          </div>
                        </div>
                      </form>
                    ))}
                  </div>
                </div>
              </details>
            );
          })
        )}
      </div>
    </div>
  );
}
