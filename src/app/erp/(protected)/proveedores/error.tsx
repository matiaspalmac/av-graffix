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
            title="Error en Proveedores"
            description="No pudimos cargar la base de proveedores en este momento."
        />
    );
}
