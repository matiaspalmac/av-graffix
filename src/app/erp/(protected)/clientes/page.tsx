import {
  allClientsWithDetails,
  updateClientAction,
  toggleClientStatusAction,
  deleteClientAction,
} from "./actions";
import { SubmitButton } from "@/components/erp/submit-button";
import { RegionCitySelector } from "@/components/erp/region-city-selector";
import { ContactsListInput } from "@/components/erp/contacts-list-input";
import { DeleteClientForm } from "@/components/erp/delete-client-form";
import { cn } from "@/lib/utils";

export default async function ClientesPage() {
  const clients = await allClientsWithDetails(100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">Clientes</h2>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">Gestiona y edita la información de tus clientes en un solo lugar.</p>
        </div>
      </div>

      <div className="space-y-4">
        {clients.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 text-sm text-zinc-500 dark:text-zinc-400">
            No hay clientes registrados.
          </div>
        ) : (
          clients.map((client) => (
            <details
              key={client.id}
              className={cn(
                "group rounded-2xl border overflow-hidden transition-colors",
                client.isActive
                  ? "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                  : "border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-900/50 opacity-75"
              )}
            >
              <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">{client.tradeName}</p>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        client.isActive
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      )}
                    >
                      {client.isActive ? "Activo" : "Inactivo"}
                    </span>
                    {client.isRetainer && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                        Retainer
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    {client.legalName} · RUT {client.rut} · {client.city}
                    {client.contactName ? ` · ${client.contactName}` : ""}
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
                <form action={updateClientAction} className="space-y-3">
                  <input type="hidden" name="clientId" value={client.id} />

                  {/* Datos de empresa */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <label className="grid gap-1 text-sm">
                      <span className="text-zinc-600 dark:text-zinc-300">Razón Social *</span>
                      <input
                        name="legalName"
                        defaultValue={client.legalName}
                        required
                        className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                      />
                    </label>

                    <label className="grid gap-1 text-sm">
                      <span className="text-zinc-600 dark:text-zinc-300">Nombre Fantasía *</span>
                      <input
                        name="tradeName"
                        defaultValue={client.tradeName}
                        required
                        className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                      />
                    </label>

                    <label className="grid gap-1 text-sm">
                      <span className="text-zinc-600 dark:text-zinc-300">RUT *</span>
                      <input
                        name="rut"
                        defaultValue={client.rut}
                        required
                        className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                      />
                    </label>

                    <label className="grid gap-1 text-sm sm:col-span-2 lg:col-span-2">
                      <span className="text-zinc-600 dark:text-zinc-300">Giro</span>
                      <input
                        name="giro"
                        defaultValue={client.giro || ""}
                        placeholder="Ej: Servicios de publicidad y rotulación"
                        className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                      />
                    </label>

                    <RegionCitySelector
                      defaultRegion={client.region || "Araucanía"}
                      defaultCity={client.city || "Temuco"}
                    />

                    <label className="grid gap-1 text-sm sm:col-span-2 lg:col-span-3">
                      <span className="text-zinc-600 dark:text-zinc-300">Dirección</span>
                      <input
                        name="address"
                        defaultValue={client.address || ""}
                        className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                      />
                    </label>
                  </div>

                  {/* Datos de contacto unificados */}
                  <ContactsListInput initialContacts={client.contacts} />

                  <div className="flex items-end gap-3 sm:col-span-2 lg:col-span-3 pt-4">
                    <SubmitButton className="flex-1 rounded-xl bg-brand-600 text-white px-4 py-2 font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      Guardar cambios del cliente
                    </SubmitButton>
                  </div>
                </form>

                {/* Acciones secundarias */}
                <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800/50 flex justify-end">
                  <form action={toggleClientStatusAction}>
                    <input type="hidden" name="clientId" value={client.id} />
                    <input type="hidden" name="isActive" value={client.isActive ? "true" : "false"} />
                    <SubmitButton
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium transition-colors border",
                        client.isActive
                          ? "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20"
                          : "border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                      )}
                    >
                      {client.isActive ? "Desactivar cliente" : "Activar cliente"}
                    </SubmitButton>
                  </form>
                  <DeleteClientForm clientId={client.id} action={deleteClientAction} />
                </div>
              </div>

            </details>
          ))
        )}
      </div>
    </div>
  );
}