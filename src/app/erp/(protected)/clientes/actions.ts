"use server";

import { revalidatePath } from "next/cache";
import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db/client";
import { clientContacts, clients } from "@/db/schema";
import { requireRole, toErrorMessage } from "@/lib/server-action";

function asNumber(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function asText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function allClientsWithDetails(limit = 50) {
  const clientRows = await db
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
      isActive: clients.isActive,
      createdAt: clients.createdAt,
      updatedAt: clients.updatedAt,
    })
    .from(clients)
    .orderBy(desc(clients.id))
    .limit(limit);

  if (clientRows.length === 0) return [];

  const clientIds = clientRows.map((c) => c.id);
  const contacts = await db
    .select()
    .from(clientContacts)
    .where(eq(clientContacts.clientId, clientIds[0])); // Simple case for now, but better to use inArray

  // Improved fetch for all clients
  const allContacts = await db
    .select()
    .from(clientContacts)
    .where(inArray(clientContacts.clientId, clientIds));

  return clientRows.map((client) => ({
    ...client,
    contacts: allContacts.filter((c) => c.clientId === client.id),
  }));
}

export async function updateClientAction(formData: FormData) {
  try {
    await requireRole(["admin", "produccion"]);
    const clientId = asNumber(formData.get("clientId"));

    if (!clientId) return;

    // Actualizar datos básicos del cliente
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
        // Mantenemos estos por compatibilidad, pero tomaremos el primero de la lista si existe
        contactName: formData.getAll("contactName")[0] ? asText(formData.getAll("contactName")[0]) : null,
        contactPhone: formData.getAll("contactPhone")[0] ? asText(formData.getAll("contactPhone")[0]) : null,
        contactEmail: formData.getAll("contactEmail")[0] ? asText(formData.getAll("contactEmail")[0]) : null,
        paymentTermsDays: asNumber(formData.get("paymentTermsDays"), 30),
        isRetainer: formData.get("isRetainer") === "1",
        updatedAt: new Date().toISOString(),
      })
      .where(eq(clients.id, clientId));

    // Sincronizar contactos
    const contactIds = formData.getAll("contactId").map(v => v ? Number(v) : null);
    const contactNames = formData.getAll("contactName").map(v => asText(v));
    const contactPhones = formData.getAll("contactPhone").map(v => asText(v));
    const contactEmails = formData.getAll("contactEmail").map(v => asText(v));

    const dbContacts = await db
      .select({ id: clientContacts.id })
      .from(clientContacts)
      .where(eq(clientContacts.clientId, clientId));

    const dbContactIds = dbContacts.map(c => c.id);
    const incomingContactIds = contactIds.filter((id): id is number => id !== null);

    // 1. Eliminar contactos que ya no están en la lista
    const toDelete = dbContactIds.filter(id => !incomingContactIds.includes(id));
    if (toDelete.length > 0) {
      await db.delete(clientContacts).where(inArray(clientContacts.id, toDelete));
    }

    // 2. Actualizar o Insertar
    for (let i = 0; i < contactNames.length; i++) {
      if (!contactNames[i]) continue;

      const contactData = {
        name: contactNames[i],
        phone: contactPhones[i] || null,
        email: contactEmails[i] || null,
        updatedAt: new Date().toISOString(),
      };

      if (contactIds[i]) {
        await db
          .update(clientContacts)
          .set(contactData)
          .where(eq(clientContacts.id, contactIds[i] as number));
      } else {
        await db.insert(clientContacts).values({
          ...contactData,
          clientId,
        });
      }
    }

    revalidatePath("/erp/clientes");
    revalidatePath("/erp/ventas");
  } catch (error) {
    console.error("updateClientAction", toErrorMessage(error));
  }
}


export async function toggleClientStatusAction(formData: FormData) {
  try {
    await requireRole(["admin", "produccion"]);
    const clientId = asNumber(formData.get("clientId"));
    const currentStatus = formData.get("isActive") === "true";

    if (!clientId) return;

    await db
      .update(clients)
      .set({
        isActive: !currentStatus,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(clients.id, clientId));

    revalidatePath("/erp/clientes");
  } catch (error) {
    console.error("toggleClientStatusAction", toErrorMessage(error));
  }
}

export async function deleteClientAction(formData: FormData) {
  try {
    await requireRole(["admin"]);
    const clientId = asNumber(formData.get("clientId"));
    if (!clientId) return;

    // Eliminar contactos primero
    await db.delete(clientContacts).where(eq(clientContacts.clientId, clientId));

    // Eliminar el cliente
    await db.delete(clients).where(eq(clients.id, clientId));

    revalidatePath("/erp/clientes");
    revalidatePath("/erp/ventas");
  } catch (error) {
    console.error("deleteClientAction", toErrorMessage(error));
  }
}