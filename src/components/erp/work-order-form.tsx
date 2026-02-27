"use client";

import { useState } from "react";
import { SubmitButton } from "@/components/erp/submit-button";

type TechnicalSheet = {
    general?: { siteContact?: string; sitePhone?: string; technician?: string };
    jobSpecs?: { workTypes?: string[]; workTypeOther?: string; locationType?: string; installHeightMeters?: number; vehicleAccess?: boolean; trafficLevel?: string };
    measurements?: { surfaceType?: string; surfaceTypeOther?: string; surfaceCondition?: string };
    technicalConditions?: { mountType?: string; estimatedPersonnel?: number; estimatedTimeHours?: number };
    logistics?: { requiredPermits?: string };
};

interface ProjectOption {
    id: number;
    name: string;
    status: string;
    technicalSheet: string | null;
}

interface OperatorOption {
    id: number;
    fullName: string;
}

interface WorkOrderFormProps {
    projectOptions: ProjectOption[];
    operatorOptions: OperatorOption[];
    createAction: (formData: FormData) => Promise<void>;
}

export function WorkOrderForm({ projectOptions, operatorOptions, createAction }: WorkOrderFormProps) {
    const [selectedProjectId, setSelectedProjectId] = useState<string>("");

    const selectedProject = projectOptions.find(p => p.id.toString() === selectedProjectId);

    let technicalSheet: TechnicalSheet | null = null;
    if (selectedProject?.technicalSheet) {
        try {
            technicalSheet = JSON.parse(selectedProject.technicalSheet);
        } catch (e) {
            console.error("Error parsing technical sheet", e);
        }
    }

    return (
        <form action={createAction} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-4">
            <h3 className="text-lg font-bold">Crear Orden de Trabajo</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="grid gap-1 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-300">Proyecto</span>
                    <select
                        name="projectId"
                        required
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                    >
                        <option value="">Selecciona proyecto</option>
                        {projectOptions.map((project) => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                    </select>
                </label>

                <label className="grid gap-1 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-300">Operador</span>
                    <select name="operatorId" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2">
                        <option value="">Sin asignar</option>
                        {operatorOptions.map((op) => (
                            <option key={op.id} value={op.id}>{op.fullName}</option>
                        ))}
                    </select>
                </label>

                <label className="grid gap-1 text-sm sm:col-span-2">
                    <span className="text-zinc-600 dark:text-zinc-300">Descripción del trabajo</span>
                    <input
                        name="description"
                        required
                        placeholder="Ej: Impresión de 500 volantes en papel couche"
                        className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
                    />
                </label>

                <label className="grid gap-1 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-300">Fecha entrega</span>
                    <input name="dueDate" type="date" className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" />
                </label>
            </div>

            {technicalSheet && (
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-900/50 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-1 bg-brand-600 rounded-full"></div>
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Ficha Técnica del Proyecto</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[13px] border-t border-zinc-200 dark:border-zinc-800 pt-3">
                        <p className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-1">
                            <span className="text-zinc-500">Contacto Terreno:</span>
                            <span className="font-semibold">{technicalSheet.general?.siteContact || "-"}</span>
                        </p>
                        <p className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-1">
                            <span className="text-zinc-500">Teléfono:</span>
                            <span className="font-semibold">{technicalSheet.general?.sitePhone || "-"}</span>
                        </p>
                        <p className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-1">
                            <span className="text-zinc-500">Técnico:</span>
                            <span className="font-semibold">{technicalSheet.general?.technician || "-"}</span>
                        </p>
                        <p className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-1">
                            <span className="text-zinc-500">Tipo Lugar:</span>
                            <span className="font-semibold">{technicalSheet.jobSpecs?.locationType || "-"}</span>
                        </p>
                        <p className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-1">
                            <span className="text-zinc-500">Altura Inst.:</span>
                            <span className="font-semibold">{technicalSheet.jobSpecs?.installHeightMeters ?? 0} m</span>
                        </p>
                        <p className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-1">
                            <span className="text-zinc-500">Acceso Vehicular:</span>
                            <span className="font-semibold">{technicalSheet.jobSpecs?.vehicleAccess ? "Sí" : "No"}</span>
                        </p>
                        <p className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-1">
                            <span className="text-zinc-500">Tránsito:</span>
                            <span className="font-semibold">{technicalSheet.jobSpecs?.trafficLevel || "-"}</span>
                        </p>
                        <p className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-1">
                            <span className="text-zinc-500">Superficie:</span>
                            <span className="font-semibold">{technicalSheet.measurements?.surfaceType || "-"}</span>
                        </p>

                        {technicalSheet.jobSpecs?.workTypes && technicalSheet.jobSpecs.workTypes.length > 0 && (
                            <p className="sm:col-span-2 border-b border-zinc-100 dark:border-zinc-800/50 pb-1">
                                <span className="text-zinc-500 mr-2">Tipos de Trabajo:</span>
                                <span className="font-semibold">{technicalSheet.jobSpecs.workTypes.join(", ")}</span>
                            </p>
                        )}

                        <p className="sm:col-span-2 border-b border-zinc-100 dark:border-zinc-800/50 pb-1">
                            <span className="text-zinc-500 mr-2">Permisos:</span>
                            <span className="font-semibold">{technicalSheet.logistics?.requiredPermits || "-"}</span>
                        </p>

                        <div className="sm:col-span-2 grid grid-cols-2 gap-4 mt-2 p-2 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800">
                            <div className="text-center">
                                <p className="text-[10px] uppercase text-zinc-400 font-bold">Personal</p>
                                <p className="text-lg font-black text-brand-600">{technicalSheet.technicalConditions?.estimatedPersonnel ?? 1}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] uppercase text-zinc-400 font-bold">Tiempo Est.</p>
                                <p className="text-lg font-black text-brand-600">{technicalSheet.technicalConditions?.estimatedTimeHours ?? 0} h</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <SubmitButton>Generar OT</SubmitButton>
        </form>
    );
}
