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
import { RegionCitySelector } from "@/components/erp/region-city-selector";
import { ContactsListInput } from "@/components/erp/contacts-list-input";

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
        <form action={createClientAction} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-8">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Nuevo Cliente</h3>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Registro de datos comerciales</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Sección 1: Identificación del Cliente */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-3.5 w-1 bg-brand-600 rounded-full"></div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Identificación</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="grid gap-1 text-sm sm:col-span-2">
                  <span className="text-zinc-600 dark:text-zinc-300">Razón Social</span>
                  <input name="legalName" required placeholder="Ej: Importadora y Comercializadora AV Ltda." className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                </label>
                <label className="grid gap-1 text-sm">
                  <span className="text-zinc-600 dark:text-zinc-300">Nombre Comercial</span>
                  <input name="tradeName" required placeholder="Ej: AV GRAFFIX" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                </label>
                <label className="grid gap-1 text-sm">
                  <span className="text-zinc-600 dark:text-zinc-300">RUT</span>
                  <input name="rut" required placeholder="Ej: 12.345.678-9" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                </label>
                <label className="grid gap-1 text-sm sm:col-span-2">
                  <span className="text-zinc-600 dark:text-zinc-300">Giro / Actividad Económica</span>
                  <input name="giro" placeholder="Ej: Servicios de impresión y publicidad" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                </label>
              </div>
            </section>

            {/* Sección 2: Contactos */}
            <section>
              <ContactsListInput />
            </section>

            {/* Sección 3: Ubicación y Dirección */}
            <section className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-3.5 w-1 bg-blue-600 rounded-full"></div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Ubicación</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <RegionCitySelector defaultRegion="Araucanía" defaultCity="Temuco" />
                <label className="grid gap-1 text-sm sm:col-span-2">
                  <span className="text-zinc-600 dark:text-zinc-300">Dirección</span>
                  <input name="address" placeholder="Ej: Calle San Martín 456, Depto 201" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                </label>
              </div>
            </section>
          </div>

          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row gap-4">
            <SubmitButton>Guardar Cliente</SubmitButton>
            <button type="reset" className="hidden sm:block px-6 py-2.5 text-sm font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors uppercase tracking-widest leading-none">
              Limpiar Formulario
            </button>
          </div>
        </form>

        <form action={createQuoteAction} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-8">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Nueva Cotización</h3>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Ingreso de requerimientos y costos</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Sección 1: Cliente y Contacto */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-3.5 w-1 bg-brand-600 rounded-full"></div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Cliente y Contacto</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="grid gap-1 text-sm">
                  <span className="text-zinc-600 dark:text-zinc-300">Cliente *</span>
                  <select name="clientId" required className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all">
                    <option value="">Selecciona un cliente</option>
                    {clientOptions.map((c) => (
                      <option key={c.id} value={c.id}>{c.tradeName}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1 text-sm">
                  <span className="text-zinc-600 dark:text-zinc-300">Fecha de Levantamiento</span>
                  <input name="surveyDate" type="date" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:col-span-2">
                  <label className="grid gap-1 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-300">Contacto en Terreno</span>
                    <input name="siteContact" placeholder="Nombre completo" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                  </label>
                  <label className="grid gap-1 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-300">Teléfono Contacto</span>
                    <input name="sitePhone" placeholder="+56 9 ..." className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                  </label>
                </div>
                <label className="grid gap-1 text-sm sm:col-span-2">
                  <span className="text-zinc-600 dark:text-zinc-300">Técnico Asignado</span>
                  <input name="technician" placeholder="Nombre del técnico responsable" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                </label>
              </div>
            </section>

            {/* Sección 2: Detalles del Servicio */}
            <section className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-3.5 w-1 bg-orange-600 rounded-full"></div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Detalles del Servicio</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="grid gap-1 text-sm sm:col-span-2">
                  <span className="text-zinc-600 dark:text-zinc-300">Descripción General</span>
                  <input name="description" placeholder="Ej: Fabricación e instalación de letrero luminoso" required className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                </label>
                <label className="grid gap-1 text-sm">
                  <span className="text-zinc-600 dark:text-zinc-300">Categoría</span>
                  <input name="serviceCategory" placeholder="Ej: Corpóreos, Gráfica" required className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                </label>
                <WorkTypesSelector />
              </div>
            </section>

            {/* Sección 3: Especificaciones del Lugar */}
            <section className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-3.5 w-1 bg-blue-600 rounded-full"></div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Especificaciones del Lugar</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="grid gap-1 text-sm">
                  <span className="text-zinc-600 dark:text-zinc-300">Tipo de Lugar</span>
                  <select name="locationType" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all">
                    <option value="">Selecciona</option>
                    <option value="Local">Local</option>
                    <option value="Mall">Mall</option>
                    <option value="Oficina">Oficina</option>
                    <option value="Vía pública">Vía pública</option>
                    <option value="Vehículo">Vehículo</option>
                  </select>
                </label>
                <label className="grid gap-1 text-sm">
                  <span className="text-zinc-600 dark:text-zinc-300">Altura Inst. (m)</span>
                  <input name="installHeightMeters" type="number" step="0.1" defaultValue="0" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                </label>
                <label className="grid gap-1 text-sm">
                  <span className="text-zinc-600 dark:text-zinc-300">Nivel de Tránsito</span>
                  <select name="trafficLevel" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all">
                    <option value="">Selecciona</option>
                    <option value="Bajo">Bajo</option>
                    <option value="Medio">Medio</option>
                    <option value="Alto">Alto</option>
                  </select>
                </label>
                <label className="inline-flex items-center gap-3 text-sm font-semibold bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  <input type="checkbox" name="vehicleAccess" className="w-4 h-4 rounded text-brand-600 border-zinc-300 dark:border-zinc-700 focus:ring-brand-500" />
                  <span className="text-zinc-700 dark:text-zinc-300">Acceso Vehicular</span>
                </label>
                <label className="grid gap-1 text-sm sm:col-span-2">
                  <span className="text-zinc-600 dark:text-zinc-300">Observaciones del Entorno</span>
                  <textarea name="environmentNotes" rows={2} placeholder="Obstáculos, horarios, accesibilidad..." className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                </label>
              </div>
            </section>

            {/* Sección 4: Medidas y Superficie */}
            <section className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <MeasurementsInput />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <SurfaceTypeSelector />
                <label className="grid gap-1 text-sm">
                  <span className="text-zinc-600 dark:text-zinc-300">Estado de Superficie</span>
                  <select name="surfaceCondition" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all">
                    <option value="">Selecciona</option>
                    <option value="Bueno">Bueno</option>
                    <option value="Regular">Regular</option>
                    <option value="Malo">Malo</option>
                  </select>
                </label>
              </div>
            </section>

            {/* Sección 5: Condiciones Técnicas y Logística */}
            <section className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-3.5 w-1 bg-red-600 rounded-full"></div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Condiciones Técnicas y Logística</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <fieldset className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50/50 dark:bg-zinc-900/30">
                  <legend className="px-3 py-1 text-[10px] font-bold uppercase bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full text-zinc-600 dark:text-zinc-300">Requerimientos Especiales</legend>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {[
                      "Perforación", "Soldadura", "Refuerzo",
                      "Andamio", "Escalera", "Riesgo eléctrico",
                      "Zona tránsito", "Iluminación", "Trabajo en altura"
                    ].map((req) => (
                      <label key={req} className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer group">
                        <input type="checkbox" name="technicalRequirements" value={req} className="rounded text-brand-600 border-zinc-300 dark:border-zinc-700 focus:ring-brand-500" />
                        <span className="group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">{req}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="space-y-4">
                  <label className="grid gap-1 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-300">Tipo de Montaje</span>
                    <select name="mountType" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all">
                      <option value="">Selecciona</option>
                      <option value="Atornillado">Atornillado</option>
                      <option value="Pegado">Pegado</option>
                      <option value="Soldado">Soldado</option>
                      <option value="Suspendido">Suspendido</option>
                    </select>
                  </label>
                  <label className="inline-flex items-center gap-3 text-sm font-semibold bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 cursor-pointer w-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                    <input type="checkbox" name="prePreparationRequired" className="w-4 h-4 rounded text-brand-600 border-zinc-300 dark:border-zinc-700 focus:ring-brand-500" />
                    <span className="text-zinc-700 dark:text-zinc-300">Requiere Preparación Previa</span>
                  </label>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold text-zinc-500">
                  <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <input type="checkbox" name="specialSchedule" className="rounded text-brand-600" />
                    <span>Horario Especial</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <input type="checkbox" name="permitsRequired" className="rounded text-brand-600" />
                    <span>Permisos Req.</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <input type="checkbox" name="clientManagesPermits" className="rounded text-brand-600" />
                    <span>Cli. Gestiona Permisos</span>
                  </label>
                </div>
                <label className="grid gap-1 text-sm">
                  <span className="text-zinc-600 dark:text-zinc-300">Observaciones Logísticas</span>
                  <textarea name="logisticsObservations" rows={2} placeholder="Restricciones de carga, accesos, etc." className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                </label>
              </div>
            </section>

            {/* Sección 6: Presupuesto y Estimación */}
            <section className="space-y-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-3.5 w-1 bg-emerald-600 rounded-full"></div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Presupuesto y Estimación</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <label className="grid gap-1 text-sm">
                  <span className="text-zinc-600 dark:text-zinc-300">Cantidad</span>
                  <input name="qty" type="number" step="0.01" defaultValue="1" required className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-emerald-500/20 transition-all" />
                </label>
                <label className="grid gap-1 text-sm">
                  <span className="text-zinc-600 dark:text-zinc-300">Unidad</span>
                  <input name="unit" placeholder="m², un, ml..." className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                </label>
                <label className="grid gap-1 text-sm sm:col-span-2">
                  <span className="text-zinc-600 dark:text-zinc-300">Valor Unitario Neto CLP *</span>
                  <input name="unitPriceClp" type="number" step="1" defaultValue="0" required className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-lg font-bold text-brand-600 focus:ring-2 focus:ring-brand-500/20 transition-all" />
                </label>

                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/20 border border-zinc-100 dark:border-zinc-800 sm:col-span-2 space-y-3">
                  <p className="text-xs font-bold text-zinc-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                    Mano de obra estimada
                  </p>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                    <label className="grid gap-1 text-sm">
                      <span className="text-zinc-600 dark:text-zinc-300">Personal</span>
                      <input name="estimatedPersonnel" type="number" step="1" defaultValue="1" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all font-bold" />
                    </label>
                    <label className="grid gap-1 text-sm">
                      <span className="text-zinc-600 dark:text-zinc-300">Horas totales</span>
                      <input name="estimatedTimeHours" type="number" step="0.25" defaultValue="0" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all font-bold" />
                    </label>
                  </div>
                  <label className="grid gap-1 text-sm border-t border-zinc-200 dark:border-zinc-700 pt-3">
                    <span className="text-zinc-600 dark:text-zinc-300">Horas cotizadas</span>
                    <input name="hoursEstimated" type="number" step="0.25" defaultValue="0" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all font-bold text-brand-600" />
                  </label>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/20 border border-zinc-100 dark:border-zinc-800 sm:col-span-2 space-y-3">
                  <p className="text-xs font-bold text-zinc-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                    Materiales
                  </p>
                  <label className="grid gap-1 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-300">Costo Estimado Materiales CLP</span>
                    <input name="materialEstimatedCostClp" type="number" step="1" defaultValue="0" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all font-bold text-brand-600 text-lg" />
                  </label>
                </div>
              </div>
            </section>
          </div>

          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row gap-4">
            <SubmitButton>Guardar Cotización</SubmitButton>
            <button type="reset" className="hidden sm:block px-6 py-2.5 text-sm font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors uppercase tracking-widest leading-none">
              Limpiar Formulario
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Cotizaciones recientes</h3>
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
                      <p className="font-bold text-zinc-900 dark:text-zinc-100">Ficha técnica</p>
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
