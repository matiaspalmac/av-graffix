"use client";

import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ExportButtonProps {
  action: () => Promise<{
    success: boolean;
    data?: string;
    filename?: string;
    error?: string;
  }>;
  label?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

export function ExportButton({
  action,
  label = "Exportar Excel",
  variant = "secondary",
  size = "md",
}: ExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    try {
      setIsLoading(true);
      const result = await action();

      if (!result.success) {
        toast.error(result.error || "Error al exportar los datos");
        return;
      }

      // Convertir base64 a Blob y descargar
      const binaryString = atob(result.data || "");
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = result.filename || "export.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Archivo descargado correctamente");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Error al descargar el archivo");
    } finally {
      setIsLoading(false);
    }
  };

  const baseStyles =
    "inline-flex items-center gap-2 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary:
      "bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/20",
    secondary:
      "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      onClick={handleExport}
      disabled={isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {isLoading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Download size={18} />
      )}
      {label}
    </button>
  );
}
