"use client";

import { useTransition } from "react";

interface ExpenseStatusSelectProps {
    expenseId: number;
    currentStatus: string;
    isAdmin: boolean;
    updateAction: (formData: FormData) => Promise<void>;
}

export function ExpenseStatusSelect({ expenseId, currentStatus, isAdmin, updateAction }: ExpenseStatusSelectProps) {
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        const formData = new FormData();
        formData.append("expenseId", expenseId.toString());
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
            disabled={isPending || !isAdmin || currentStatus !== 'pending'}
            className="text-xs font-bold rounded-lg border-none bg-transparent p-0 focus:ring-0 cursor-pointer disabled:cursor-default disabled:opacity-70"
        >
            <option value="pending" className="text-orange-600">PENDIENTE</option>
            <option value="approved" className="text-green-600">APROBADO</option>
            <option value="rejected" className="text-red-600">RECHAZADO</option>
        </select>
    );
}
