import { getSuppliers, updateSupplierAction, toggleSupplierStatusAction, deleteSupplierAction } from "./actions";
import { SubmitButton } from "@/components/erp/submit-button";
import { DeleteSupplierForm } from "@/components/erp/delete-supplier-form";

export default async function ProveedoresPage() {
    // getSuppliers() returns all suppliers (ordered by active status and name)
    const suppliers = await getSuppliers("");

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">Proveedores</h2>
                    <p className="mt-1 text-zinc-600 dark:text-zinc-400">Gestiona y edita la información de tus proveedores en un solo lugar.</p>
                </div>
            </div>

            <div className="space-y-4">
                {suppliers.length === 0 ? (
                    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 text-sm text-zinc-500 dark:text-zinc-400">
                        No hay proveedores registrados.
                    </div>
                ) : (
                    suppliers.map((supplier) => (
                        <details
                            key={supplier.id}
                            className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
                        >
                            <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <p className="font-bold text-zinc-900 dark:text-zinc-100">{supplier.tradeName}</p>
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${supplier.isActive
                                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                                : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                                                }`}
                                        >
                                            {supplier.isActive ? "Activo" : "Inactivo"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                        {supplier.legalName} · RUT {supplier.rut} · {supplier.city}
                                        {supplier.contactName ? ` · Contacto: ${supplier.contactName}` : ""}
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
                                <form action={updateSupplierAction} className="space-y-3">
                                    <input type="hidden" name="supplierId" value={supplier.id} />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        <label className="grid gap-1 text-sm">
                                            <span className="text-zinc-600 dark:text-zinc-300">Razón Social *</span>
                                            <input
                                                name="legalName"
                                                defaultValue={supplier.legalName}
                                                required
                                                className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                                            />
                                        </label>

                                        <label className="grid gap-1 text-sm">
                                            <span className="text-zinc-600 dark:text-zinc-300">Nombre Fantasía *</span>
                                            <input
                                                name="tradeName"
                                                defaultValue={supplier.tradeName}
                                                required
                                                className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                                            />
                                        </label>

                                        <label className="grid gap-1 text-sm">
                                            <span className="text-zinc-600 dark:text-zinc-300">RUT *</span>
                                            <input
                                                name="rut"
                                                defaultValue={supplier.rut}
                                                required
                                                className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                                            />
                                        </label>

                                        <label className="grid gap-1 text-sm">
                                            <span className="text-zinc-600 dark:text-zinc-300">País</span>
                                            <input
                                                name="country"
                                                defaultValue={supplier.country || "CL"}
                                                className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                                            />
                                        </label>

                                        <label className="grid gap-1 text-sm">
                                            <span className="text-zinc-600 dark:text-zinc-300">Ciudad</span>
                                            <input
                                                name="city"
                                                defaultValue={supplier.city || "Temuco"}
                                                className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                                            />
                                        </label>

                                        <label className="grid gap-1 text-sm lg:col-span-1">
                                            <span className="text-zinc-600 dark:text-zinc-300">Dirección</span>
                                            <input
                                                name="address"
                                                defaultValue={supplier.address || ""}
                                                className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                                            />
                                        </label>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        <label className="grid gap-1 text-sm">
                                            <span className="text-zinc-600 dark:text-zinc-300">Nombre Contacto</span>
                                            <input
                                                name="contactName"
                                                defaultValue={supplier.contactName || ""}
                                                className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                                            />
                                        </label>

                                        <label className="grid gap-1 text-sm">
                                            <span className="text-zinc-600 dark:text-zinc-300">Teléfono</span>
                                            <input
                                                name="contactPhone"
                                                defaultValue={supplier.contactPhone || ""}
                                                className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                                            />
                                        </label>

                                        <label className="grid gap-1 text-sm">
                                            <span className="text-zinc-600 dark:text-zinc-300">Email</span>
                                            <input
                                                name="contactEmail"
                                                type="email"
                                                defaultValue={supplier.contactEmail || ""}
                                                className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                                            />
                                        </label>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        <label className="grid gap-1 text-sm">
                                            <span className="text-zinc-600 dark:text-zinc-300">Lead Time (Días)</span>
                                            <input
                                                name="leadTimeDays"
                                                type="number"
                                                defaultValue={supplier.leadTimeDays || 5}
                                                className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                                            />
                                        </label>

                                        <label className="grid gap-1 text-sm">
                                            <span className="text-zinc-600 dark:text-zinc-300">Plazo Pago (Días)</span>
                                            <input
                                                name="paymentTermsDays"
                                                type="number"
                                                defaultValue={supplier.paymentTermsDays || 30}
                                                className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                                            />
                                        </label>

                                        <label className="grid gap-1 text-sm">
                                            <span className="text-zinc-600 dark:text-zinc-300">Moneda</span>
                                            <select
                                                name="currencyPreference"
                                                defaultValue={supplier.currencyPreference || "CLP"}
                                                className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                                            >
                                                <option value="CLP">CLP - Pesos Chilenos</option>
                                                <option value="USD">USD - Dólares</option>
                                                <option value="EUR">EUR - Euros</option>
                                            </select>
                                        </label>
                                    </div>

                                    <div className="flex items-end gap-3 pt-2">
                                        <SubmitButton className="flex-1 rounded-xl bg-brand-600 text-white px-4 py-2 font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                            Guardar cambios
                                        </SubmitButton>
                                    </div>
                                </form>
                                <form action={toggleSupplierStatusAction} className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                                    <input type="hidden" name="supplierId" value={supplier.id} />
                                    <input type="hidden" name="currentStatus" value={supplier.isActive ? "true" : "false"} />
                                    <SubmitButton
                                        variant="secondary"
                                        className={`w-full text-sm py-2 px-4 rounded-xl border font-semibold hover:opacity-80 transition-opacity ${supplier.isActive
                                            ? 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                                            : 'border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                                            }`}
                                    >
                                        {supplier.isActive ? "Desactivar Proveedor (Archivar)" : "Reactivar Proveedor"}
                                    </SubmitButton>
                                </form>


                                <DeleteSupplierForm supplierId={supplier.id} action={deleteSupplierAction} />
                            </div>
                        </details>
                    ))
                )}
            </div>
        </div >
    );
}
