"use server";

import { db } from "@/db/client";
import { suppliers } from "@/db/schema";
import { eq, desc, asc, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function asNumber(value: FormDataEntryValue | null, fallback = 0) {
    const parsed = Number(value ?? fallback);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function asText(value: FormDataEntryValue | null) {
    return String(value ?? "").trim();
}

// GET: Bring all suppliers with optional search
export async function getSuppliers(query: string = "") {
    try {
        const conditions = query
            ? or(
                ilike(suppliers.tradeName, `%${query}%`),
                ilike(suppliers.legalName, `%${query}%`),
                ilike(suppliers.rut, `%${query}%`),
                ilike(suppliers.contactEmail, `%${query}%`)
            )
            : undefined;

        const data = await db
            .select()
            .from(suppliers)
            .where(conditions)
            .orderBy(desc(suppliers.isActive), asc(suppliers.tradeName));

        return data;
    } catch (error) {
        console.error("Error fetching suppliers:", error);
        throw new Error("No se pudieron cargar los proveedores.");
    }
}

// GET: Bring single supplier by ID
export async function getSupplierById(id: number) {
    try {
        const [supplier] = await db
            .select()
            .from(suppliers)
            .where(eq(suppliers.id, id))
            .limit(1);

        return supplier || null;
    } catch (error) {
        console.error(`Error fetching supplier ${id}:`, error);
        throw new Error("No se pudo cargar el proveedor.");
    }
}

// POST: Create a new supplier via Server Action
export async function createSupplierAction(formData: FormData) {
    try {
        const rutValue = asText(formData.get("rut"));

        // Check for RUT existence first
        const existing = await db
            .select({ id: suppliers.id })
            .from(suppliers)
            .where(eq(suppliers.rut, rutValue))
            .limit(1);

        if (existing.length > 0) {
            console.error("Error creating supplier: RUT ya existe.");
            // We purposefully don't throw to avoid 500s directly on the UI if just creating,
            // but in real world a toast or form validation is preferred.
            return;
        }

        await db.insert(suppliers).values({
            legalName: asText(formData.get("legalName")),
            tradeName: asText(formData.get("tradeName")),
            rut: rutValue,
            country: asText(formData.get("country")) || "CL",
            city: asText(formData.get("city")) || "Temuco",
            address: asText(formData.get("address")) || null,
            contactName: asText(formData.get("contactName")) || null,
            contactEmail: asText(formData.get("contactEmail")) || null,
            contactPhone: asText(formData.get("contactPhone")) || null,
            leadTimeDays: asNumber(formData.get("leadTimeDays"), 5),
            paymentTermsDays: asNumber(formData.get("paymentTermsDays"), 30),
            currencyPreference: asText(formData.get("currencyPreference")) || "CLP",
            isActive: true, // Defaulting to true on creation
        });

        revalidatePath("/erp/proveedores");
    } catch (error) {
        console.error("Error creating supplier:", error);
    }
}

// PUT: Update an existing supplier via Server Action
export async function updateSupplierAction(formData: FormData) {
    try {
        const supplierId = asNumber(formData.get("supplierId"));
        if (!supplierId) return;

        await db
            .update(suppliers)
            .set({
                legalName: asText(formData.get("legalName")),
                tradeName: asText(formData.get("tradeName")),
                rut: asText(formData.get("rut")),
                country: asText(formData.get("country")) || "CL",
                city: asText(formData.get("city")) || "Temuco",
                address: asText(formData.get("address")) || null,
                contactName: asText(formData.get("contactName")) || null,
                contactEmail: asText(formData.get("contactEmail")) || null,
                contactPhone: asText(formData.get("contactPhone")) || null,
                leadTimeDays: asNumber(formData.get("leadTimeDays"), 5),
                paymentTermsDays: asNumber(formData.get("paymentTermsDays"), 30),
                currencyPreference: asText(formData.get("currencyPreference")) || "CLP",
                updatedAt: new Date().toISOString(),
            })
            .where(eq(suppliers.id, supplierId));

        revalidatePath("/erp/proveedores");
    } catch (error) {
        console.error(`Error updating supplier action:`, error);
    }
}

// DELETE (Soft): Toggle Active Status via Server Action
export async function toggleSupplierStatusAction(formData: FormData) {
    try {
        const supplierId = asNumber(formData.get("supplierId"));
        if (!supplierId) return;

        const currentStatusStr = formData.get("currentStatus");
        const isCurrentlyActive = currentStatusStr === "true";

        await db
            .update(suppliers)
            .set({
                isActive: !isCurrentlyActive,
                updatedAt: new Date().toISOString()
            })
            .where(eq(suppliers.id, supplierId));

        revalidatePath("/erp/proveedores");
    } catch (error) {
        console.error(`Error toggling supplier action:`, error);
    }
}
