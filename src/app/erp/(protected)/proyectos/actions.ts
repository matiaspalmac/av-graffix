"use server";

import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { clients, projectBriefs, projects, quotes, users } from "@/db/schema";
import { requireRole, toErrorMessage } from "@/lib/server-action";
import { exportProjectsToExcel } from "@/lib/export-utils";

function asNumber(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function projectCode() {
  const stamp = Date.now().toString().slice(-6);
  return `PRJ-${new Date().getFullYear()}-${stamp}`;
}

export async function createProjectAction(formData: FormData) {
  try {
    const session = await requireRole(["admin", "produccion"]);

    const clientId = asNumber(formData.get("clientId"));
    const quoteId = asNumber(formData.get("quoteId"), 0) || null;
    const name = String(formData.get("name") ?? "").trim();
    const serviceType = String(formData.get("serviceType") ?? "").trim();

    if (!clientId || !name || !serviceType) {
      return;
    }

    const budgetRevenueClp = asNumber(formData.get("budgetRevenueClp"));
    const budgetCostClp = asNumber(formData.get("budgetCostClp"));
    const expectedMarginPct = budgetRevenueClp > 0 ? ((budgetRevenueClp - budgetCostClp) * 100) / budgetRevenueClp : 0;
    const now = new Date().toISOString();

    await db.insert(projects).values({
      projectCode: projectCode(),
      clientId,
      quoteId,
      name,
      serviceType,
      startDate: String(formData.get("startDate") ?? "").trim() || now,
      dueDate: String(formData.get("dueDate") ?? "").trim() || null,
      status: String(formData.get("status") ?? "planning").trim() || "planning",
      priority: String(formData.get("priority") ?? "normal").trim() || "normal",
      projectManagerId: Number(session.user.id || 0) || null,
      budgetRevenueClp,
      budgetCostClp,
      expectedMarginPct,
      notes: String(formData.get("notes") ?? "").trim() || null,
      updatedAt: now,
    });

    revalidatePath("/erp/proyectos");
    revalidatePath("/erp/reportes");
  } catch (error) {
    console.error("createProjectAction", toErrorMessage(error));
  }
}

export async function updateProjectAction(formData: FormData) {
  try {
    await requireRole(["admin", "produccion"]);

    const id = asNumber(formData.get("projectId"));
    if (!id) {
      return;
    }

    const budgetRevenueClp = asNumber(formData.get("budgetRevenueClp"));
    const budgetCostClp = asNumber(formData.get("budgetCostClp"));
    const expectedMarginPct = budgetRevenueClp > 0 ? ((budgetRevenueClp - budgetCostClp) * 100) / budgetRevenueClp : 0;

    await db
      .update(projects)
      .set({
        status: String(formData.get("status") ?? "planning").trim() || "planning",
        priority: String(formData.get("priority") ?? "normal").trim() || "normal",
        dueDate: String(formData.get("dueDate") ?? "").trim() || null,
        budgetRevenueClp,
        budgetCostClp,
        expectedMarginPct,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(projects.id, id));

    revalidatePath("/erp/proyectos");
    revalidatePath("/erp/reportes");
  } catch (error) {
    console.error("updateProjectAction", toErrorMessage(error));
  }
}

export async function archiveProjectAction(formData: FormData) {
  try {
    await requireRole(["admin", "produccion"]);

    const id = asNumber(formData.get("projectId"));
    if (!id) {
      return;
    }

    await db
      .update(projects)
      .set({ status: "archived", updatedAt: new Date().toISOString() })
      .where(eq(projects.id, id));

    revalidatePath("/erp/proyectos");
  } catch (error) {
    console.error("archiveProjectAction", toErrorMessage(error));
  }
}

export async function latestProjects(limit = 12) {
  return db
    .select({
      id: projects.id,
      code: projects.projectCode,
      name: projects.name,
      serviceType: projects.serviceType,
      status: projects.status,
      priority: projects.priority,
      dueDate: projects.dueDate,
      budgetRevenueClp: projects.budgetRevenueClp,
      budgetCostClp: projects.budgetCostClp,
      expectedMarginPct: projects.expectedMarginPct,
      clientName: clients.tradeName,
      technicalSheetJson: projectBriefs.technicalSheetJson,
    })
    .from(projects)
    .leftJoin(clients, eq(projects.clientId, clients.id))
    .leftJoin(projectBriefs, eq(projects.id, projectBriefs.projectId))
    .orderBy(desc(projects.id))
    .limit(limit);
}

export async function projectFormOptions() {
  const [clientOptions, quoteOptions] = await Promise.all([
    db.select({ id: clients.id, tradeName: clients.tradeName }).from(clients).orderBy(desc(clients.id)),
    db
      .select({ id: quotes.id, quoteNumber: quotes.quoteNumber })
      .from(quotes)
      .where(eq(quotes.status, "approved"))
      .orderBy(desc(quotes.id)),
  ]);

  return { clientOptions, quoteOptions };
}

export async function exportProjectsExcelAction() {
  try {
    await requireRole(["admin", "produccion"]);

    const projectsData = await db
      .select({
        projectCode: projects.projectCode,
        name: projects.name,
        client: {
          tradeName: clients.tradeName,
        },
        serviceType: projects.serviceType,
        status: projects.status,
        startDate: projects.startDate,
        dueDate: projects.dueDate,
        budgetRevenueClp: projects.budgetRevenueClp,
        budgetCostClp: projects.budgetCostClp,
        expectedMarginPct: projects.expectedMarginPct,
        projectManager: {
          fullName: users.fullName,
        },
      })
      .from(projects)
      .leftJoin(clients, eq(projects.clientId, clients.id))
      .leftJoin(users, eq(projects.projectManagerId, users.id))
      .orderBy(desc(projects.id))
      .limit(500);

    const buffer = await exportProjectsToExcel(projectsData);

    return {
      success: true,
      data: Buffer.from(buffer).toString("base64"),
      filename: `proyectos_${new Date().toISOString().split("T")[0]}.xlsx`,
    };
  } catch (error) {
    console.error("exportProjectsExcelAction", toErrorMessage(error));
    return {
      success: false,
      error: toErrorMessage(error),
    };
  }
}
