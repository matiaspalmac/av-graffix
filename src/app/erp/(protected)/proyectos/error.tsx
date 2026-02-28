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
            title="Error en Proyectos"
            description="No pudimos cargar la información de esta sección."
        />
    );
}
