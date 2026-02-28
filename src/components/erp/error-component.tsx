"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export function ErrorComponent({
    error,
    reset,
    title = "Ha ocurrido un problema inesperado",
    description = "No hemos podido cargar esta información. Puede ser un error de conexión o un problema interno temporal.",
}: {
    error: Error & { digest?: string };
    reset: () => void;
    title?: string;
    description?: string;
}) {
    useEffect(() => {
        console.error("ERP Unhandled Error:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center rounded-2xl border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/20">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 mb-6 mx-auto">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" strokeWidth={2} />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
                {title}
            </h2>

            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed">
                {description}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                    onClick={() => reset()}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white transition-colors rounded-lg bg-red-600 hover:bg-red-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 w-full sm:w-auto"
                >
                    <RefreshCcw size={16} />
                    Intentar nuevamente
                </button>

                <Link
                    href="/erp"
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium transition-colors rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 w-full sm:w-auto"
                >
                    <Home size={16} />
                    Volver al Inicio
                </Link>
            </div>
        </div>
    );
}
