"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { ConfirmDialog } from "@/components/erp/confirm-dialog";
import { toastMessages } from "@/lib/toast-utils";

interface CancelPurchaseOrderFormProps {
  purchaseOrderId: number;
  action: (formData: FormData) => Promise<void>;
}

export function CancelPurchaseOrderForm({
  purchaseOrderId,
  action,
}: CancelPurchaseOrderFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCancel = async () => {
    try {
      const formData = new FormData();
      formData.append("purchaseOrderId", String(purchaseOrderId));
      await action(formData);
      toastMessages.warning(
        "Orden cancelada",
        "La orden de compra ha sido marcada como cancelada"
      );
    } catch (error) {
      toastMessages.error(
        "Error al cancelar",
        error instanceof Error ? error.message : "No se pudo cancelar la orden"
      );
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-lg border border-amber-200 text-amber-700 dark:border-amber-900/40 dark:text-amber-300 px-2 py-1 text-sm hover:bg-amber-50 dark:hover:bg-amber-900/20 font-semibold transition"
      >
        <AlertCircle size={14} className="inline mr-1" />
        Cancelar
      </button>

      <ConfirmDialog
        isOpen={isOpen}
        title="Cancelar orden de compra"
        description="La orden de compra será marcada como cancelada. Esta acción no se puede deshacer."
        confirmText="Cancelar orden"
        cancelText="Volver"
        variant="warning"
        onConfirm={handleCancel}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
}
