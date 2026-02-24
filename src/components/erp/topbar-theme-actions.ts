"use server";

import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db/client";
import { users, userPreferences } from "@/db/schema";

export async function toggleThemeAction() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("No autenticado");
    }

    // Encontrar el usuario
    const userResult = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (!userResult.length) {
      throw new Error("Usuario no encontrado");
    }

    const userId = userResult[0].id;

    // Obtener preferencias actuales
    const existing = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    const now = new Date().toISOString();

    if (existing.length) {
      // Invertir el valor actual
      const newThemeDarkMode = !existing[0].themeDarkMode;
      
      await db
        .update(userPreferences)
        .set({
          themeDarkMode: newThemeDarkMode,
          updatedAt: now,
        })
        .where(eq(userPreferences.userId, userId));

      return { themeDarkMode: newThemeDarkMode };
    } else {
      // Crear con tema oscuro activado
      await db.insert(userPreferences).values({
        userId,
        themeDarkMode: true,
        themeHighContrast: false,
        notifyInventoryAlerts: true,
        notifySalesAlerts: true,
        notifyDailySummary: true,
      });

      return { themeDarkMode: true };
    }
  } catch (error) {
    console.error("toggleThemeAction", error);
    throw error;
  }
}
