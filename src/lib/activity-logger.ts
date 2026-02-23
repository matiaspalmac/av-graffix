"use server";

import { db } from "@/db/client";
import { activityLog } from "@/db/schema";
import { auth } from "@/auth";

export interface ActivityLogEntry {
  action: "create" | "update" | "delete" | "view" | "export" | "download";
  entityType: string;
  entityId?: number;
  entityName?: string;
  oldValue?: unknown;
  newValue?: unknown;
  metadata?: Record<string, unknown>;
}

/**
 * Registra una actividad en el activity log
 * Use esto en Server Actions después de realizar cambios en la BD
 */
export async function logActivity(entry: ActivityLogEntry) {
  try {
    const session = await auth();
    if (!session?.user?.id) return;

    // Calcular cambios si hay oldValue y newValue
    let changes: string[] = [];
    if (entry.oldValue && entry.newValue) {
      const oldObj = entry.oldValue as Record<string, unknown>;
      const newObj = entry.newValue as Record<string, unknown>;

      for (const key of Object.keys(newObj)) {
        if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
          changes.push(key);
        }
      }
    }

    await db.insert(activityLog).values({
      userId: parseInt(session.user.id),
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      entityName: entry.entityName,
      oldValue: entry.oldValue ? JSON.stringify(entry.oldValue) : null,
      newValue: entry.newValue ? JSON.stringify(entry.newValue) : null,
      changes: changes.length > 0 ? JSON.stringify(changes) : null,
      metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
      ipAddress: null, // se obtendría de headers si fuera necesario
      userAgent: null, // se obtendría de headers si fuera necesario
    });
  } catch (error) {
    console.error("[logActivity] Error:", error);
    // No lanzar error para no bloquear la operación principal
  }
}

/**
 * Obtiene el historial de actividades para una entidad específica
 */
export async function getActivityHistory(
  entityType: string,
  entityId: number,
  limit = 20
) {
  try {
    const history = await db.query.activityLog.findMany({
      where: (log, { eq, and }) =>
        and(eq(log.entityType, entityType), eq(log.entityId, entityId)),
      orderBy: (log) => [log.createdAt],
      limit,
    });

    return history;
  } catch (error) {
    console.error("[getActivityHistory] Error:", error);
    return [];
  }
}

/**
 * Obtiene el historial de actividades de un usuario específico
 */
export async function getUserActivityHistory(userId: number, limit = 50) {
  try {
    const history = await db.query.activityLog.findMany({
      where: (log, { eq }) => eq(log.userId, userId),
      orderBy: (log) => [log.createdAt],
      limit,
    });

    return history;
  } catch (error) {
    console.error("[getUserActivityHistory] Error:", error);
    return [];
  }
}
