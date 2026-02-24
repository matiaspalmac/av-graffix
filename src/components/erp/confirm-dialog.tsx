"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
      setIsProcessing(false);
      onCancel();
    } catch (error) {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const variantStyles = {
    danger: "border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20",
    warning: "border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20",
    info: "border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-950/20",
  };

  const buttonStyles = {
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-amber-600 hover:bg-amber-700 text-white",
    info: "bg-blue-600 hover:bg-blue-700 text-white",
  };

  const iconColor = {
    danger: "text-red-600 dark:text-red-400",
    warning: "text-amber-600 dark:text-amber-400",
    info: "text-blue-600 dark:text-blue-400",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-50">
        <div className={`rounded-2xl border ${variantStyles[variant]} p-6 shadow-xl`}>
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle size={24} className={iconColor[variant]} />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {title}
            </h2>
          </div>

          {/* Description */}
          <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-6">
            {description}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isProcessing || isLoading}
              className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-4 py-2.5 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing || isLoading}
              className={`flex-1 rounded-lg ${buttonStyles[variant]} px-4 py-2.5 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {isProcessing || isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Procesando...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
