"use server";

import { db } from "@/db/client";
import { companySettings } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { logActivity } from "@/lib/activity-logger";

/**
 * Obtiene todos los settings (solo para admins)
 */
export async function getAllCompanySettings() {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== "admin") {
      throw new Error("Solo administradores pueden acceder a la configuración");
    }

    const settings = await db.select().from(companySettings).orderBy(companySettings.key);
    return { success: true, data: settings };
  } catch (error) {
    console.error("[getAllCompanySettings]", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Actualiza un setting de empresa (solo para admins)
 */
export async function updateCompanySettingAction(key: string, newValue: string) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      throw new Error("Solo administradores pueden actualizar la configuración");
    }

    // Obtener valor anterior
    const [existing] = await db
      .select()
      .from(companySettings)
      .where(eq(companySettings.key, key))
      .limit(1);

    const oldValue = existing?.value || null;

    // Actualizar
    await db
      .insert(companySettings)
      .values({
        key,
        value: newValue,
        isEditable: true,
      })
      .onConflictDoUpdate({
        target: companySettings.key,
        set: {
          value: newValue,
          updatedAt: new Date().toISOString(),
        },
      });

    // Registrar en activity log
    await logActivity({
      action: "update",
      entityType: "company_settings",
      entityName: key,
      oldValue: { value: oldValue },
      newValue: { value: newValue },
      metadata: {
        setting_key: key,
      },
    });

    // Limpiar cache
    console.log("[updateCompanySettingAction] Cache invalidated for:", key);

    return { success: true, message: "Configuración actualizada correctamente" };
  } catch (error) {
    console.error("[updateCompanySettingAction]", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Reset a valores por defecto (solo para admins super)
 */
export async function resetCompanySettings() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      throw new Error("Solo administradores pueden resetear la configuración");
    }

    // Eliminar todos
    await db.delete(companySettings);

    // Reinsertar valores por defecto
    const defaults = [
      ["company_name_full", "AV GRAFFIX DISEÑO Y PRODUCCION PUBLICITARIA LTDA"],
      ["company_name_commercial", "AV GRAFFIX"],
      ["company_rut", "77.096.036-3"],
      ["company_address", "Providencia 123, Temuco"],
      ["company_city", "Temuco"],
      ["company_region", "Región de La Araucanía"],
      ["company_country", "Chile"],
      ["company_commune", "Temuco"],
      ["company_business_type", "PUBLICIDAD"],
      ["company_phone", "+56 9 9279 1148"],
      ["company_email", "info@avgraffix.cl"],
      ["company_website", "https://avgraffix.cl"],
      ["company_sii_status", "Contribuyente"],
    ];

    for (const [key, value] of defaults) {
      await db.insert(companySettings).values({
        key,
        value,
        isEditable: false,
      });
    }

    await logActivity({
      action: "update",
      entityType: "company_settings",
      entityName: "reset_all",
      metadata: { action: "reset_to_defaults" },
    });

    return { success: true, message: "Configuración reseteada a valores por defecto" };
  } catch (error) {
    console.error("[resetCompanySettings]", error);
    return { success: false, error: String(error) };
  }
}
