"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/erp/confirm-dialog";
import { toastMessages } from "@/lib/toast-utils";

interface DeleteQuoteItemFormProps {
  quoteItemId: number;
  quoteId: number;
  action: (formData: FormData) => Promise<void>;
}

export function DeleteQuoteItemForm({
  quoteItemId,
  quoteId,
  action,
}: DeleteQuoteItemFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const formData = new FormData();
      formData.append("quoteItemId", String(quoteItemId));
      formData.append("quoteId", String(quoteId));
      await action(formData);
      toastMessages.success(
        "Ítem eliminado",
        "El ítem ha sido eliminado de la cotización"
      );
    } catch (error) {
      toastMessages.error(
        "Error al eliminar",
        error instanceof Error ? error.message : "No se pudo eliminar el ítem"
      );
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-lg border border-red-200 text-red-700 dark:border-red-900/40 dark:text-red-300 px-2 py-1 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold transition"
      >
        <Trash2 size={12} className="inline mr-1" />
        Eliminar ítem
      </button>

      <ConfirmDialog
        isOpen={isOpen}
        title="Eliminar ítem de la cotización"
        description="Este ítem será eliminado de la cotización. Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
}
