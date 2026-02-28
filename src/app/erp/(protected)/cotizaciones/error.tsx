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
            title="Error en Cotizaciones"
            description="Hubo un problema al cargar el registro de cotizaciones."
        />
    );
}
