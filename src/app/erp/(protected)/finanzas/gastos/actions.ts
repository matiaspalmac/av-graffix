"use server";

import { revalidatePath } from "next/cache";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { extraExpenses, projects, users } from "@/db/schema";
import { requireRole, toErrorMessage } from "@/lib/server-action";

function asNumber(value: FormDataEntryValue | null, fallback = 0) {
    const parsed = Number(value ?? fallback);
    return Number.isFinite(parsed) ? parsed : fallback;
}

export async function createExpenseAction(formData: FormData) {
    try {
        const session = await requireRole(["admin", "produccion"]);

        const amountClp = asNumber(formData.get("amountClp"));
        const category = String(formData.get("category") ?? "Otros").trim();
        const description = String(formData.get("description") ?? "").trim();
        const projectId = asNumber(formData.get("projectId"), 0) || null;
        const userId = Number(session.user.id);

        if (amountClp <= 0 || !category || !description) {
            throw new Error("Monto, categoría y descripción son obligatorios.");
        }

        const expenseDate = String(formData.get("expenseDate") ?? "").trim() || new Date().toISOString();

        await db.insert(extraExpenses).values({
            projectId,
            userId,
            amountClp,
            category,
            description,
            expenseDate,
            status: "pending",
            receiptUrl: null,
            updatedAt: new Date().toISOString(),
        });

        revalidatePath("/erp/finanzas/gastos");
        revalidatePath("/erp/reportes");
    } catch (error) {
        console.error("createExpenseAction", toErrorMessage(error));
        throw error;
    }
}

export async function updateExpenseStatusAction(formData: FormData) {
    try {
        await requireRole(["admin"]);
        const expenseId = asNumber(formData.get("expenseId"));
        const status = String(formData.get("status") ?? "pending").trim();

        if (!expenseId || !status) return;

        await db
            .update(extraExpenses)
            .set({ status, updatedAt: new Date().toISOString() })
            .where(eq(extraExpenses.id, expenseId));

        revalidatePath("/erp/finanzas/gastos");
    } catch (error) {
        console.error("updateExpenseStatusAction", toErrorMessage(error));
    }
}

export async function deleteExpenseAction(formData: FormData) {
    try {
        const session = await requireRole(["admin", "produccion"]);
        const expenseId = asNumber(formData.get("expenseId"));

        if (!expenseId) return;

        // Optional: Only allow deletion if pending or by admin
        await db.delete(extraExpenses).where(eq(extraExpenses.id, expenseId));

        revalidatePath("/erp/finanzas/gastos");
    } catch (error) {
        console.error("deleteExpenseAction", toErrorMessage(error));
    }
}

export async function expenseFormOptions() {
    const [projectOptions] = await Promise.all([
        db.select({ id: projects.id, name: projects.name }).from(projects).orderBy(desc(projects.id)),
    ]);

    return { projectOptions };
}

export async function latestExpenses(limit = 50) {
    return await db
        .select({
            id: extraExpenses.id,
            amountClp: extraExpenses.amountClp,
            category: extraExpenses.category,
            description: extraExpenses.description,
            expenseDate: extraExpenses.expenseDate,
            status: extraExpenses.status,
            projectName: projects.name,
            userName: users.fullName,
        })
        .from(extraExpenses)
        .leftJoin(projects, eq(extraExpenses.projectId, projects.id))
        .leftJoin(users, eq(extraExpenses.userId, users.id))
        .orderBy(desc(extraExpenses.expenseDate), desc(extraExpenses.id))
        .limit(limit);
}
