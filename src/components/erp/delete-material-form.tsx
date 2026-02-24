"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/erp/confirm-dialog";
import { toastMessages } from "@/lib/toast-utils";

interface DeleteMaterialFormProps {
  materialId: number;
  action: (formData: FormData) => Promise<{ success: boolean; message?: string; error?: string }>;
}

export function DeleteMaterialForm({ materialId, action }: DeleteMaterialFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    const formData = new FormData();
    formData.append("materialId", String(materialId));

    const result = await action(formData);

    if (result?.success) {
      toastMessages.success("Material eliminado", result.message);
      return;
    }

    toastMessages.warning("No se pudo eliminar", result?.error ?? "El material tiene historial asociado");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-lg border border-red-200 text-red-700 dark:border-red-900/40 dark:text-red-300 px-2 py-1 text-xs hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <Trash2 size={12} className="inline mr-1" />
        Eliminar
      </button>

      <ConfirmDialog
        isOpen={isOpen}
        title="Eliminar material"
        description="Esta acción no se puede deshacer. Solo se puede eliminar si el material no tiene historial de uso."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
}
