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
import { WorkTypesSelector } from "@/components/erp/work-types-selector";
import { MeasurementsInput } from "@/components/erp/measurements-input";
import { SurfaceTypeSelector } from "@/components/erp/surface-type-selector";

type TechnicalSheet = {
  general?: { siteContact?: string; sitePhone?: string; technician?: string };
  jobSpecs?: { workTypes?: string[]; workTypeOther?: string; locationType?: string; installHeightMeters?: number; vehicleAccess?: boolean; trafficLevel?: string };
  measurements?: { surfaceType?: string; surfaceTypeOther?: string; surfaceCondition?: string };
  technicalConditions?: { mountType?: string; estimatedPersonnel?: number; estimatedTimeHours?: number };
  logistics?: { requiredPermits?: string };
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

      <div className="space-y-4">
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
              <span className="text-zinc-600 dark:text-zinc-300">Fecha</span>
              <input name="surveyDate" type="date" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Contacto en terreno</span>
              <input name="siteContact" placeholder="Nombre de contacto" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Teléfono</span>
              <input name="sitePhone" placeholder="+56 9 ..." className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm sm:col-span-2">
              <span className="text-zinc-600 dark:text-zinc-300">Técnico</span>
              <input name="technician" placeholder="Nombre del técnico" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Categoría</span>
              <input name="serviceCategory" placeholder="Categoría (ej. etiquetas)" required className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm sm:col-span-2">
              <span className="text-zinc-600 dark:text-zinc-300">Descripción del servicio</span>
              <input name="description" placeholder="Ej: Diseño de etiqueta" required className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <WorkTypesSelector />
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Tipo de lugar</span>
              <select name="locationType" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
                <option value="">Selecciona</option>
                <option value="Local">Local</option>
                <option value="Mall">Mall</option>
                <option value="Oficina">Oficina</option>
                <option value="Vía pública">Vía pública</option>
                <option value="Vehículo">Vehículo</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Altura instalación (m)</span>
              <input name="installHeightMeters" type="number" step="0.1" defaultValue="0" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Nivel de tránsito</span>
              <select name="trafficLevel" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
                <option value="">Selecciona</option>
                <option value="Bajo">Bajo</option>
                <option value="Medio">Medio</option>
                <option value="Alto">Alto</option>
              </select>
            </label>
            <label className="inline-flex items-center gap-2 text-sm sm:mt-7">
              <input type="checkbox" name="vehicleAccess" className="rounded border-zinc-300 dark:border-zinc-700" />
              <span>Acceso vehicular</span>
            </label>
            <label className="grid gap-1 text-sm sm:col-span-2">
              <span className="text-zinc-600 dark:text-zinc-300">Observaciones de entorno</span>
              <textarea name="environmentNotes" rows={2} className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <MeasurementsInput />
            <SurfaceTypeSelector />
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Estado de superficie</span>
              <select name="surfaceCondition" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
                <option value="">Selecciona</option>
                <option value="Bueno">Bueno</option>
                <option value="Regular">Regular</option>
                <option value="Malo">Malo</option>
              </select>
            </label>
            <fieldset className="sm:col-span-2 rounded-xl border border-zinc-200 dark:border-zinc-800 p-3">
              <legend className="px-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200">Condiciones técnicas</legend>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                {[
                  "Perforación",
                  "Soldadura",
                  "Refuerzo",
                  "Trabajo en altura",
                  "Andamio",
                  "Escalera",
                  "Riesgo eléctrico",
                  "Zona tránsito",
                  "Iluminación",
                ].map((req) => (
                  <label key={req} className="inline-flex items-center gap-2">
                    <input type="checkbox" name="technicalRequirements" value={req} className="rounded border-zinc-300 dark:border-zinc-700" />
                    <span>{req}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Tipo de montaje</span>
              <select name="mountType" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
                <option value="">Selecciona</option>
                <option value="Atornillado">Atornillado</option>
                <option value="Pegado">Pegado</option>
                <option value="Soldado">Soldado</option>
                <option value="Suspendido">Suspendido</option>
              </select>
            </label>
            <label className="inline-flex items-center gap-2 text-sm sm:mt-7">
              <input type="checkbox" name="prePreparationRequired" className="rounded border-zinc-300 dark:border-zinc-700" />
              <span>Preparación previa requerida</span>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Personal estimado</span>
              <input name="estimatedPersonnel" type="number" step="1" defaultValue="1" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Tiempo estimado (horas)</span>
              <input name="estimatedTimeHours" type="number" step="0.25" defaultValue="0" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
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
            <fieldset className="sm:col-span-2 rounded-xl border border-zinc-200 dark:border-zinc-800 p-3">
              <legend className="px-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200">Logística / Permisos</legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" name="specialSchedule" className="rounded border-zinc-300 dark:border-zinc-700" />
                  <span>Horario especial</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" name="permitsRequired" className="rounded border-zinc-300 dark:border-zinc-700" />
                  <span>Permisos requeridos</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" name="clientManagesPermits" className="rounded border-zinc-300 dark:border-zinc-700" />
                  <span>Cliente gestiona permisos</span>
                </label>
              </div>
              <label className="grid gap-1 text-sm mt-3">
                <span className="text-zinc-600 dark:text-zinc-300">Observaciones</span>
                <textarea name="logisticsObservations" rows={2} placeholder="Detalles adicionales" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
              </label>
            </fieldset>
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
          (() => {
            const technicalSheet = parseTechnicalSheet(quote.items[0]?.specsJson);

            return (
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

            {technicalSheet ? (
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3 text-sm space-y-2">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">Ficha técnica</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-zinc-600 dark:text-zinc-300">
                  <p>Contacto terreno: {technicalSheet.general?.siteContact || "-"}</p>
                  <p>Teléfono: {technicalSheet.general?.sitePhone || "-"}</p>
                  <p>Técnico: {technicalSheet.general?.technician || "-"}</p>
                  {technicalSheet.jobSpecs?.workTypes && technicalSheet.jobSpecs.workTypes.length > 0 ? (
                    <p className="sm:col-span-2">Tipos de trabajo: {technicalSheet.jobSpecs.workTypes.join(", ")}</p>
                  ) : null}
                  {technicalSheet.jobSpecs?.workTypeOther ? (
                    <p className="sm:col-span-2">Otro tipo: {technicalSheet.jobSpecs.workTypeOther}</p>
                  ) : null}
                  <p>Tipo lugar: {technicalSheet.jobSpecs?.locationType || "-"}</p>
                  <p>Altura instalación: {technicalSheet.jobSpecs?.installHeightMeters ?? 0} m</p>
                  <p>Acceso vehicular: {technicalSheet.jobSpecs?.vehicleAccess ? "Sí" : "No"}</p>
                  <p>Tránsito: {technicalSheet.jobSpecs?.trafficLevel || "-"}</p>
                  <p>Superficie: {technicalSheet.measurements?.surfaceType || "-"}</p>
                  {technicalSheet.measurements?.surfaceTypeOther ? (
                    <p className="sm:col-span-2">Otro tipo superficie: {technicalSheet.measurements.surfaceTypeOther}</p>
                  ) : null}
                  <p>Estado superficie: {technicalSheet.measurements?.surfaceCondition || "-"}</p>
                  <p>Montaje: {technicalSheet.technicalConditions?.mountType || "-"}</p>
                  <p>Personal estimado: {technicalSheet.technicalConditions?.estimatedPersonnel ?? 0}</p>
                  <p>Tiempo estimado: {technicalSheet.technicalConditions?.estimatedTimeHours ?? 0} h</p>
                  <p className="sm:col-span-2">Permisos: {technicalSheet.logistics?.requiredPermits || "-"}</p>
                </div>
              </div>
            ) : null}

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
            );
          })()
          ))
        )}
      </div>
    </div>
  );
}
