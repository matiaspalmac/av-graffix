// components/erp/delete-client-form.tsx
"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/erp/confirm-dialog";
import { toastMessages } from "@/lib/toast-utils";

interface DeleteClientFormProps {
  clientId: number;
  action: (formData: FormData) => Promise<void>;
}

export function DeleteClientForm({ clientId, action }: DeleteClientFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const formData = new FormData();
      formData.append("clientId", String(clientId));

      await action(formData);

      toastMessages.success(
        "Cliente eliminado",
        "El cliente ha sido eliminado exitosamente"
      );
    } catch (error) {
      toastMessages.error(
        "Error al eliminar",
        error instanceof Error ? error.message : "No se pudo eliminar el cliente"
      );
    } finally {
      setIsOpen(false); // cierra el diálogo aunque falle
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-lg border border-red-200 text-red-700 dark:border-red-900/40 dark:text-red-300 px-3 py-1.5 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors flex items-center gap-1.5"
      >
        <Trash2 size={14} />
        Eliminar
      </button>

      <ConfirmDialog
        isOpen={isOpen}
        title="Eliminar cliente"
        description="Esta acción no se puede deshacer. El cliente y toda su información asociada serán eliminados permanentemente del sistema."
        confirmText="Sí, eliminar cliente"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
}