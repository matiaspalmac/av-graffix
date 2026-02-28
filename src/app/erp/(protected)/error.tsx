"use client";

import { ErrorComponent } from "@/components/erp/error-component";

export default function ErrorBoundary({
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
        />
    );
}
