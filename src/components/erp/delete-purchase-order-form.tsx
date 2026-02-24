"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/erp/confirm-dialog";
import { toastMessages } from "@/lib/toast-utils";

interface DeletePurchaseOrderFormProps {
  purchaseOrderId: number;
  action: (formData: FormData) => Promise<void>;
}

export function DeletePurchaseOrderForm({
  purchaseOrderId,
  action,
}: DeletePurchaseOrderFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const formData = new FormData();
      formData.append("purchaseOrderId", String(purchaseOrderId));
      await action(formData);
      toastMessages.success(
        "Orden eliminada",
        "La orden de compra ha sido eliminada exitosamente"
      );
    } catch (error) {
      toastMessages.error(
        "Error al eliminar",
        error instanceof Error ? error.message : "No se pudo eliminar la orden"
      );
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-lg border border-red-200 text-red-700 dark:border-red-900/40 dark:text-red-300 px-2 py-1 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold transition"
      >
        <Trash2 size={14} className="inline mr-1" />
        Eliminar
      </button>

      <ConfirmDialog
        isOpen={isOpen}
        title="Eliminar orden de compra"
        description="Esta acción no se puede deshacer. La orden de compra y todos sus ítems serán eliminados permanentemente del sistema."
        confirmText="Eliminar orden"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
}
