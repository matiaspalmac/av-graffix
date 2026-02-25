"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { tasks } from "@/db/schema";
import { requireRole, toErrorMessage } from "@/lib/server-action";

function normalizeTaskStatus(status: string) {
  if (status === "todo" || status === "in_progress" || status === "done") {
    return status;
  }
  return "todo";
}

export async function updateTaskStatusQuickAction(formData: FormData) {
  try {
    await requireRole(["admin", "produccion"]);

    const taskId = Number(formData.get("taskId") ?? 0);
    const status = normalizeTaskStatus(String(formData.get("status") ?? "todo"));

    if (!taskId) {
      return;
    }

    await db
      .update(tasks)
      .set({
        status,
        completedAt: status === "done" ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(tasks.id, taskId));

    revalidatePath("/erp");
  } catch (error) {
    console.error("updateTaskStatusQuickAction", toErrorMessage(error));
  }
}
