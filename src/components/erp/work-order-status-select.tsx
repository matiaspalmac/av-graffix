"use client";

import { useTransition } from "react";

interface WorkOrderStatusSelectProps {
    workOrderId: number;
    currentStatus: string;
    updateAction: (formData: FormData) => Promise<void>;
}

export function WorkOrderStatusSelect({ workOrderId, currentStatus, updateAction }: WorkOrderStatusSelectProps) {
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        const formData = new FormData();
        formData.append("workOrderId", workOrderId.toString());
        formData.append("status", newStatus);

        startTransition(async () => {
            await updateAction(formData);
        });
    };

    return (
        <select
            name="status"
            defaultValue={currentStatus}
            onChange={handleChange}
            disabled={isPending}
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1 text-sm font-semibold disabled:opacity-50"
        >
            <option value="pending">Pendiente</option>
            <option value="in_progress">En proceso</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
        </select>
    );
}
