'use client';

import { ErrorComponent } from "@/components/erp/error-component";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <ErrorComponent
            error={error}
            reset={reset}
            title="Error en Ventas"
            description="Tuvimos un problema cargando los datos de ventas y CRM."
        />
    );
}
