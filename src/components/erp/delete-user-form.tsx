"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/erp/confirm-dialog";
import { toastMessages } from "@/lib/toast-utils";

interface DeleteUserFormProps {
  userId: number;
  action: (formData: FormData) => Promise<void>;
}

export function DeleteUserForm({ userId, action }: DeleteUserFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", String(userId));
      await action(formData);
      toastMessages.success("Usuario eliminado", "El usuario ha sido eliminado exitosamente");
    } catch (error) {
      toastMessages.error(
        "Error al eliminar",
        error instanceof Error ? error.message : "No se pudo eliminar el usuario"
      );
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-lg border border-red-300 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 px-2 py-1 text-xs font-semibold transition"
      >
        <Trash2 size={14} className="inline mr-1" />
        Eliminar
      </button>

      <ConfirmDialog
        isOpen={isOpen}
        title="Eliminar usuario"
        description="Esta acción no se puede deshacer. El usuario será eliminado permanentemente del sistema."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
}