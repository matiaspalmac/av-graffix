"use server";

import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";
import { hash, compare } from "bcryptjs";
import { auth } from "@/auth";
import { db } from "@/db/client";
import { userPreferences, users, loginSessions } from "@/db/schema";

export async function updateUserPreferences(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("No autenticado");
    }

    const themeDarkMode = formData.get("themeDarkMode") === "on";
    const themeHighContrast = formData.get("themeHighContrast") === "on";
    const notifyInventoryAlerts = formData.get("notifyInventoryAlerts") === "on";
    const notifySalesAlerts = formData.get("notifySalesAlerts") === "on";
    const notifyDailySummary = formData.get("notifyDailySummary") === "on";

    // Encontrar el usuario por email
    const userResult = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (!userResult.length) {
      throw new Error("Usuario no encontrado");
    }

    const userId = userResult[0].id;

    // Actualizar o crear preferencias
    const existing = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    const now = new Date().toISOString();

    if (existing.length) {
      await db
        .update(userPreferences)
        .set({
          themeDarkMode,
          themeHighContrast,
          notifyInventoryAlerts,
          notifySalesAlerts,
          notifyDailySummary,
          updatedAt: now,
        })
        .where(eq(userPreferences.userId, userId));
    } else {
      await db.insert(userPreferences).values({
        userId,
        themeDarkMode,
        themeHighContrast,
        notifyInventoryAlerts,
        notifySalesAlerts,
        notifyDailySummary,
      });
    }

    revalidatePath("/erp/config");
  } catch (error) {
    console.error("updateUserPreferences", error);
    throw error;
  }
}

export async function getUserPreferences() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return null;
    }

    const userResult = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (!userResult.length) {
      return null;
    }

    const userId = userResult[0].id;

    const prefs = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    if (!prefs.length) {
      return {
        themeDarkMode: false,
        themeHighContrast: false,
        notifyInventoryAlerts: true,
        notifySalesAlerts: true,
        notifyDailySummary: true,
      };
    }

    return prefs[0];
  } catch (error) {
    console.error("getUserPreferences", error);
    return null;
  }
}

export async function changePasswordAction(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { error: "No autenticado" };
    }

    const currentPassword = String(formData.get("currentPassword") ?? "").trim();
    const newPassword = String(formData.get("newPassword") ?? "").trim();
    const confirmPassword = String(formData.get("confirmPassword") ?? "").trim();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { error: "Todos los campos son obligatorios" };
    }

    if (newPassword !== confirmPassword) {
      return { error: "Las contraseñas nuevas no coinciden" };
    }

    if (newPassword.length < 8) {
      return { error: "La contraseña debe tener al menos 8 caracteres" };
    }

    // Encontrar el usuario
    const userResult = await db
      .select({ id: users.id, passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (!userResult.length) {
      return { error: "Usuario no encontrado" };
    }

    // Verificar contraseña actual
    const isValid = await compare(currentPassword, userResult[0].passwordHash);
    if (!isValid) {
      return { error: "La contraseña actual es incorrecta" };
    }

    // Actualizar contraseña
    const passwordHash = await hash(newPassword, 10);
    await db
      .update(users)
      .set({ 
        passwordHash, 
        updatedAt: new Date().toISOString() 
      })
      .where(eq(users.id, userResult[0].id));

    revalidatePath("/erp/config");
    return { success: true };
  } catch (error) {
    console.error("changePasswordAction", error);
    return { error: "Error al cambiar la contraseña" };
  }
}

export async function getActiveSessions() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return [];
    }

    // Encontrar el usuario
    const userResult = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (!userResult.length) {
      return [];
    }

    const userId = userResult[0].id;

    // Obtener sesiones activas (últimas 30 días)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sessions = await db
      .select()
      .from(loginSessions)
      .where(eq(loginSessions.userId, userId))
      .orderBy(desc(loginSessions.loginAt))
      .limit(20);

    return sessions;
  } catch (error) {
    console.error("getActiveSessions", error);
    return [];
  }
}

export async function logoutSessionAction(sessionId: number) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { error: "No autenticado" };
    }

    // Verificar que la sesión pertenece al usuario
    const userResult = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (!userResult.length) {
      return { error: "Usuario no encontrado" };
    }

    // Desactivar la sesión
    await db
      .update(loginSessions)
      .set({ 
        isActive: false,
        lastActivityAt: new Date().toISOString()
      })
      .where(eq(loginSessions.id, sessionId));

    revalidatePath("/erp/config");
    return { success: true };
  } catch (error) {
    console.error("logoutSessionAction", error);
    return { error: "Error al cerrar sesión" };
  }
}
