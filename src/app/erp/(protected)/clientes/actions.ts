"use server";

import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { clients } from "@/db/schema";
import { requireRole, toErrorMessage } from "@/lib/server-action";

function asNumber(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function asText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function allClientsWithDetails(limit = 50) {
  return await db
    .select({
      id: clients.id,
      legalName: clients.legalName,
      tradeName: clients.tradeName,
      rut: clients.rut,
      giro: clients.giro,
      address: clients.address,
      city: clients.city,
      region: clients.region,
      contactName: clients.contactName,
      phone: clients.contactPhone,
      email: clients.contactEmail,
      paymentTermsDays: clients.paymentTermsDays,
      isRetainer: clients.isRetainer,
      createdAt: clients.createdAt,
      updatedAt: clients.updatedAt,
    })
    .from(clients)
    .orderBy(desc(clients.id))
    .limit(limit);
}

export async function updateClientAction(formData: FormData) {
  try {
    await requireRole(["admin", "produccion"]);
    const clientId = asNumber(formData.get("clientId"));

    if (!clientId) return;

    await db
      .update(clients)
      .set({
        legalName: asText(formData.get("legalName")),
        tradeName: asText(formData.get("tradeName")),
        rut: asText(formData.get("rut")),
        giro: asText(formData.get("giro")) || null,
        address: asText(formData.get("address")) || null,
        city: asText(formData.get("city")) || "Temuco",
        region: asText(formData.get("region")) || "Araucanía",
        contactName: asText(formData.get("contactName")) || null,
        contactPhone: asText(formData.get("phone")) || null,
        contactEmail: asText(formData.get("email")) || null,
        paymentTermsDays: asNumber(formData.get("paymentTermsDays"), 30),
        isRetainer: formData.get("isRetainer") === "1",
        updatedAt: new Date().toISOString(),
      })
      .where(eq(clients.id, clientId));

    revalidatePath("/erp/clientes");
  } catch (error) {
    console.error("updateClientAction", toErrorMessage(error));
  }
}

export async function deleteClientAction(formData: FormData) {
  try {
    await requireRole(["admin"]);
    const clientId = asNumber(formData.get("clientId"));
    if (!clientId) return;
    await db.delete(clients).where(eq(clients.id, clientId));
    revalidatePath("/erp/clientes");
  } catch (error) {
    console.error("deleteClientAction", toErrorMessage(error));
    throw error;
  }
}