"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/erp/confirm-dialog";
import { toastMessages } from "@/lib/toast-utils";

interface DeletePurchaseOrderItemFormProps {
  poItemId: number;
  purchaseOrderId: number;
  action: (formData: FormData) => Promise<void>;
}

export function DeletePurchaseOrderItemForm({
  poItemId,
  purchaseOrderId,
  action,
}: DeletePurchaseOrderItemFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const formData = new FormData();
      formData.append("poItemId", String(poItemId));
      formData.append("purchaseOrderId", String(purchaseOrderId));
      await action(formData);
      toastMessages.success(
        "Ítem eliminado",
        "El ítem ha sido eliminado de la orden"
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
        title="Eliminar ítem de la orden"
        description="Este ítem será eliminado de la orden de compra. Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
}
