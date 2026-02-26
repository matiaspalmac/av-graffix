"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/erp/confirm-dialog";
import { toastMessages } from "@/lib/toast-utils";

interface DeleteSupplierFormProps {
    supplierId: number;
    action: (formData: FormData) => Promise<void>;
}

export function DeleteSupplierForm({ supplierId, action }: DeleteSupplierFormProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = async () => {
        try {
            const formData = new FormData();
            formData.append("supplierId", String(supplierId));
            await action(formData);
            toastMessages.success(
                "Proveedor eliminado",
                "El proveedor ha sido eliminado exitosamente"
            );
        } catch (error) {
            toastMessages.error(
                "Error al eliminar",
                error instanceof Error ? error.message : "No se pudo eliminar el proveedor"
            );
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="w-full text-sm py-2 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-900/20 font-semibold transition-colors"
            >
                <Trash2 size={14} className="inline mr-1" />
                Eliminar permanentemente
            </button>

            <ConfirmDialog
                isOpen={isOpen}
                title="Eliminar proveedor"
                description="Esta acción no se puede deshacer. El proveedor será eliminado permanentemente del sistema."
                confirmText="Eliminar proveedor"
                cancelText="Cancelar"
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setIsOpen(false)}
            />
        </>
    );
}
