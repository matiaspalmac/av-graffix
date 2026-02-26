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
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20"
      >
        <Trash2 size={14} className="inline mr-1" />
        Eliminar permanentemente
      </button>

      <ConfirmDialog
        isOpen={isOpen}
        title="Eliminar cliente"
        description="Esta acción no se puede deshacer. El cliente y todos sus contactos asociados serán eliminados permanentemente del sistema."
        confirmText="Eliminar cliente"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
}