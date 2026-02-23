"use server";

import { revalidatePath } from "next/cache";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db/client";
import {
  clients,
  projectPhases,
  projects,
  quoteItems,
  quotes,
  roles,
  tasks,
  users,
} from "@/db/schema";

function asNumber(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function quoteNumber() {
  const stamp = Date.now().toString().slice(-6);
  return `COT-${new Date().getFullYear()}-${stamp}`;
}

function projectCode() {
  const stamp = Date.now().toString().slice(-6);
  return `PRJ-${new Date().getFullYear()}-${stamp}`;
}

function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function resolvePhaseForCategory(category: string) {
  const safe = normalize(category);
  if (/(brand|diseno|diseño|motion|ilustr|redes|packaging)/.test(safe)) {
    return "Diseño";
  }
  if (/(preprensa|arte final|ajuste)/.test(safe)) {
    return "Preprensa";
  }
  if (/(impres|vinilo|tela|sublim|dtf|serigraf|uv|etiqueta|folleto|papeler|merch|pendon|roller|soporte)/.test(safe)) {
    return "Producción";
  }
  if (/(entrega|despacho|instalacion|instalación)/.test(safe)) {
    return "Entrega";
  }
  return "Preprensa";
}

async function recalcQuoteTotals(quoteId: number) {
  const result = await db
    .select({ subtotal: sql<number>`coalesce(sum(${quoteItems.lineTotalClp}),0)` })
    .from(quoteItems)
    .where(eq(quoteItems.quoteId, quoteId));

  const subtotal = Number(result[0]?.subtotal ?? 0);
  const tax = Math.round(subtotal * 0.19);
  const total = subtotal + tax;

  await db
    .update(quotes)
    .set({ subtotalClp: subtotal, taxClp: tax, totalClp: total, updatedAt: new Date().toISOString() })
    .where(eq(quotes.id, quoteId));
}

export async function createClientAction(formData: FormData) {
  const legalName = String(formData.get("legalName") ?? "").trim();
  const tradeName = String(formData.get("tradeName") ?? "").trim();
  const rut = String(formData.get("rut") ?? "").trim();

  if (!legalName || !tradeName || !rut) {
    return;
  }

  const now = new Date().toISOString();

  await db.insert(clients).values({
    legalName,
    tradeName,
    rut,
    giro: String(formData.get("giro") ?? "").trim() || null,
    contactName: String(formData.get("contactName") ?? "").trim() || null,
    contactEmail: String(formData.get("contactEmail") ?? "").trim().toLowerCase() || null,
    contactPhone: String(formData.get("contactPhone") ?? "").trim() || null,
    paymentTermsDays: asNumber(formData.get("paymentTermsDays"), 30),
    updatedAt: now,
  });

  revalidatePath("/erp/ventas");
}

export async function createQuoteAction(formData: FormData) {
  const session = await auth();
  const clientId = asNumber(formData.get("clientId"));
  const description = String(formData.get("description") ?? "").trim();
  const serviceCategory = String(formData.get("serviceCategory") ?? "general").trim();
  const qty = asNumber(formData.get("qty"), 1);
  const unitPriceClp = asNumber(formData.get("unitPriceClp"), 0);
  const hoursEstimated = asNumber(formData.get("hoursEstimated"), 0);
  const materialEstimatedCostClp = asNumber(formData.get("materialEstimatedCostClp"), 0);

  if (!clientId || !description || qty <= 0) {
    return;
  }

  const now = new Date();
  const issueDate = now.toISOString();
  const validUntil = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 15).toISOString();

  const subtotal = qty * unitPriceClp;
  const tax = Math.round(subtotal * 0.19);
  const total = subtotal + tax;

  const inserted = await db
    .insert(quotes)
    .values({
      quoteNumber: quoteNumber(),
      clientId,
      issueDate,
      validUntil,
      currencyCode: "CLP",
      subtotalClp: subtotal,
      taxClp: tax,
      totalClp: total,
      status: "draft",
      salesUserId: Number(session?.user?.id || 0) || null,
      termsText: "Validez 15 días. Valores en CLP + IVA.",
      updatedAt: issueDate,
    })
    .returning({ id: quotes.id });

  const quoteId = inserted[0]?.id;
  if (!quoteId) {
    return;
  }

  await db.insert(quoteItems).values({
    quoteId,
    lineNo: 1,
    itemType: "service",
    serviceCategory,
    description,
    qty,
    unit: String(formData.get("unit") ?? "unit").trim() || "unit",
    unitPriceClp,
    hoursEstimated,
    materialEstimatedCostClp,
    lineTotalClp: subtotal,
    dueDate: String(formData.get("dueDate") ?? "").trim() || null,
  });

  await recalcQuoteTotals(quoteId);

  revalidatePath("/erp/ventas");
}

export async function addQuoteItemAction(formData: FormData) {
  const quoteId = asNumber(formData.get("quoteId"));
  const description = String(formData.get("description") ?? "").trim();
  const serviceCategory = String(formData.get("serviceCategory") ?? "general").trim();
  const qty = asNumber(formData.get("qty"), 1);
  const unitPriceClp = asNumber(formData.get("unitPriceClp"), 0);

  if (!quoteId || !description || qty <= 0) {
    return;
  }

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(quoteItems)
    .where(eq(quoteItems.quoteId, quoteId));

  const lineNo = Number(countResult[0]?.count ?? 0) + 1;
  const lineTotal = qty * unitPriceClp;

  await db.insert(quoteItems).values({
    quoteId,
    lineNo,
    itemType: "service",
    serviceCategory,
    description,
    qty,
    unit: String(formData.get("unit") ?? "unit").trim() || "unit",
    unitPriceClp,
    hoursEstimated: asNumber(formData.get("hoursEstimated"), 0),
    materialEstimatedCostClp: asNumber(formData.get("materialEstimatedCostClp"), 0),
    setupCostClp: 0,
    lineTotalClp: lineTotal,
    dueDate: String(formData.get("dueDate") ?? "").trim() || null,
  });

  await recalcQuoteTotals(quoteId);
  revalidatePath("/erp/ventas");
}

export async function deleteQuoteItemAction(formData: FormData) {
  const quoteItemId = asNumber(formData.get("quoteItemId"));
  const quoteId = asNumber(formData.get("quoteId"));

  if (!quoteItemId || !quoteId) {
    return;
  }

  await db.delete(quoteItems).where(eq(quoteItems.id, quoteItemId));
  await recalcQuoteTotals(quoteId);
  revalidatePath("/erp/ventas");
}

export async function updateQuoteStatusAction(formData: FormData) {
  const quoteId = asNumber(formData.get("quoteId"));
  const status = String(formData.get("status") ?? "draft").trim();

  if (!quoteId || !status) {
    return;
  }

  await db
    .update(quotes)
    .set({ status, updatedAt: new Date().toISOString() })
    .where(eq(quotes.id, quoteId));

  revalidatePath("/erp/ventas");
}

export async function deleteQuoteAction(formData: FormData) {
  const quoteId = asNumber(formData.get("quoteId"));
  if (!quoteId) {
    return;
  }

  await db.delete(quoteItems).where(eq(quoteItems.quoteId, quoteId));
  await db.delete(quotes).where(eq(quotes.id, quoteId));
  revalidatePath("/erp/ventas");
}

export async function convertQuoteToProjectAction(formData: FormData) {
  const session = await auth();
  const quoteId = asNumber(formData.get("quoteId"));

  if (!quoteId) {
    return;
  }

  const quoteInfo = await db
    .select({
      id: quotes.id,
      quoteNumber: quotes.quoteNumber,
      status: quotes.status,
      clientId: quotes.clientId,
      totalClp: quotes.totalClp,
      clientName: clients.tradeName,
    })
    .from(quotes)
    .leftJoin(clients, eq(quotes.clientId, clients.id))
    .where(eq(quotes.id, quoteId))
    .limit(1);

  const quote = quoteInfo[0];
  if (!quote || quote.status !== "approved") {
    return;
  }

  const existingProject = await db
    .select({ id: projects.id })
    .from(projects)
    .where(eq(projects.quoteId, quoteId))
    .limit(1);

  if (existingProject.length > 0) {
    return;
  }

  const itemAgg = await db
    .select({
      totalMaterialCost: sql<number>`coalesce(sum(${quoteItems.materialEstimatedCostClp}),0)`,
      totalHours: sql<number>`coalesce(sum(${quoteItems.hoursEstimated}),0)`,
      serviceType: sql<string>`coalesce((select ${quoteItems.serviceCategory} from ${quoteItems} where ${quoteItems.quoteId} = ${quoteId} order by ${quoteItems.lineNo} asc limit 1), 'general')`,
    })
    .from(quoteItems)
    .where(eq(quoteItems.quoteId, quoteId));

  const quoteItemsRows = await db
    .select({
      id: quoteItems.id,
      lineNo: quoteItems.lineNo,
      description: quoteItems.description,
      serviceCategory: quoteItems.serviceCategory,
      qty: quoteItems.qty,
      unit: quoteItems.unit,
      hoursEstimated: quoteItems.hoursEstimated,
      materialEstimatedCostClp: quoteItems.materialEstimatedCostClp,
    })
    .from(quoteItems)
    .where(eq(quoteItems.quoteId, quoteId))
    .orderBy(asc(quoteItems.lineNo));

  const roleUsers = await db
    .select({ roleCode: roles.code, userId: users.id })
    .from(users)
    .leftJoin(roles, eq(users.roleId, roles.id))
    .where(eq(users.isActive, true));

  const fallbackUserId = Number(session?.user?.id || 0) || null;
  const salesUserId = roleUsers.find((row) => row.roleCode === "ventas")?.userId ?? fallbackUserId;
  const productionUserId = roleUsers.find((row) => row.roleCode === "produccion")?.userId ?? fallbackUserId;
  const financeUserId = roleUsers.find((row) => row.roleCode === "finanzas")?.userId ?? fallbackUserId;

  const laborCost = Number(itemAgg[0]?.totalHours ?? 0) * 12000;
  const materialCost = Number(itemAgg[0]?.totalMaterialCost ?? 0);
  const budgetCost = laborCost + materialCost;
  const budgetRevenue = Number(quote.totalClp ?? 0);
  const margin = budgetRevenue > 0 ? ((budgetRevenue - budgetCost) * 100) / budgetRevenue : 0;
  const now = new Date().toISOString();

  const insertedProject = await db
    .insert(projects)
    .values({
      projectCode: projectCode(),
      clientId: quote.clientId,
      quoteId,
      name: `${quote.clientName ?? "Cliente"} · ${quote.quoteNumber}`,
      serviceType: String(itemAgg[0]?.serviceType ?? "general"),
      startDate: now,
      status: "planning",
      priority: "normal",
      projectManagerId: Number(session?.user?.id || 0) || null,
      budgetRevenueClp: budgetRevenue,
      budgetCostClp: budgetCost,
      expectedMarginPct: margin,
      notes: "Proyecto generado automáticamente desde cotización aprobada.",
      updatedAt: now,
    })
    .returning({ id: projects.id });

  const projectId = insertedProject[0]?.id;
  if (!projectId) {
    return;
  }

  const phases = [
    { name: "Brief", order: 1, hours: 2 },
    { name: "Diseño", order: 2, hours: 8 },
    { name: "Preprensa", order: 3, hours: 4 },
    { name: "Producción", order: 4, hours: 8 },
    { name: "Entrega", order: 5, hours: 2 },
  ];

  const phaseIdByName = new Map<string, number>();

  for (const phase of phases) {
    const phaseInsert = await db
      .insert(projectPhases)
      .values({
        projectId,
        phaseName: phase.name,
        phaseOrder: phase.order,
        status: "pending",
        progressPct: 0,
        ownerUserId:
          phase.name === "Producción"
            ? productionUserId
            : phase.name === "Entrega"
              ? financeUserId
              : salesUserId,
        plannedHours: phase.hours,
        actualHours: 0,
        notes: null,
        updatedAt: now,
      })
      .returning({ id: projectPhases.id });

    const phaseId = phaseInsert[0]?.id;
    if (phaseId) {
      phaseIdByName.set(phase.name, phaseId);
    }

    await db.insert(tasks).values({
      projectId,
      phaseId,
      title: `${phase.name} - tarea inicial`,
      description: "Tarea creada automáticamente desde cotización aprobada.",
      assigneeUserId:
        phase.name === "Producción"
          ? productionUserId
          : phase.name === "Entrega"
            ? financeUserId
            : salesUserId,
      taskType: phase.name.toLowerCase(),
      status: "todo",
      priority: "normal",
      estimatedHours: phase.hours,
      actualHours: 0,
      updatedAt: now,
    });
  }

  for (const item of quoteItemsRows) {
    const phaseName = resolvePhaseForCategory(item.serviceCategory);
    const phaseId = phaseIdByName.get(phaseName) ?? phaseIdByName.get("Preprensa") ?? null;

    const assigneeUserId =
      phaseName === "Producción"
        ? productionUserId
        : phaseName === "Entrega"
          ? financeUserId
          : salesUserId;

    await db.insert(tasks).values({
      projectId,
      phaseId,
      title: `[Ítem ${item.lineNo}] ${item.description}`,
      description: `Generada desde cotización: ${item.qty} ${item.unit} · Costo material estimado ${item.materialEstimatedCostClp} CLP`,
      assigneeUserId,
      taskType: normalize(item.serviceCategory).slice(0, 40),
      status: "todo",
      priority: "normal",
      estimatedHours: Number(item.hoursEstimated ?? 0) > 0 ? Number(item.hoursEstimated) : 1,
      actualHours: 0,
      updatedAt: now,
    });
  }

  await db.insert(tasks).values({
    projectId,
    phaseId: phaseIdByName.get("Entrega") ?? null,
    title: "Cierre financiero y documentación",
    description: "Validar facturación SII, respaldo PDF y estado de cobranza inicial.",
    assigneeUserId: financeUserId,
    taskType: "finanzas",
    status: "todo",
    priority: "normal",
    estimatedHours: 2,
    actualHours: 0,
    updatedAt: now,
  });

  revalidatePath("/erp/ventas");
  revalidatePath("/erp/proyectos");
  revalidatePath("/erp/reportes");
  revalidatePath("/erp");
}

export async function latestQuotesWithItems(limit = 8) {
  const quoteRows = await db
    .select({
      id: quotes.id,
      quoteNumber: quotes.quoteNumber,
      issueDate: quotes.issueDate,
      subtotalClp: quotes.subtotalClp,
      taxClp: quotes.taxClp,
      totalClp: quotes.totalClp,
      status: quotes.status,
      clientName: clients.tradeName,
    })
    .from(quotes)
    .leftJoin(clients, eq(quotes.clientId, clients.id))
    .orderBy(desc(quotes.id))
    .limit(limit);

  if (quoteRows.length === 0) {
    return [];
  }

  const quoteIds = quoteRows.map((quote) => quote.id);

  const [items, linkedProjects] = await Promise.all([
    db
      .select({
        id: quoteItems.id,
        quoteId: quoteItems.quoteId,
        lineNo: quoteItems.lineNo,
        description: quoteItems.description,
        serviceCategory: quoteItems.serviceCategory,
        qty: quoteItems.qty,
        unit: quoteItems.unit,
        unitPriceClp: quoteItems.unitPriceClp,
        lineTotalClp: quoteItems.lineTotalClp,
        hoursEstimated: quoteItems.hoursEstimated,
        materialEstimatedCostClp: quoteItems.materialEstimatedCostClp,
      })
      .from(quoteItems)
      .where(inArray(quoteItems.quoteId, quoteIds))
      .orderBy(asc(quoteItems.quoteId), asc(quoteItems.lineNo)),
    db
      .select({ id: projects.id, quoteId: projects.quoteId })
      .from(projects)
      .where(inArray(projects.quoteId, quoteIds)),
  ]);

  const itemsByQuote = new Map<number, typeof items>();
  for (const item of items) {
    const current = itemsByQuote.get(item.quoteId) ?? [];
    current.push(item);
    itemsByQuote.set(item.quoteId, current);
  }

  const projectByQuote = new Map<number, number>();
  for (const project of linkedProjects) {
    if (project.quoteId) {
      projectByQuote.set(project.quoteId, project.id);
    }
  }

  return quoteRows.map((quote) => ({
    ...quote,
    items: itemsByQuote.get(quote.id) ?? [],
    projectId: projectByQuote.get(quote.id) ?? null,
  }));
}

export async function availableClients() {
  return db
    .select({ id: clients.id, tradeName: clients.tradeName, rut: clients.rut })
    .from(clients)
    .orderBy(desc(clients.id));
}

export async function getQuoteStats() {
  const [leadsOpen, clientsTotal, quotesOpen] = await Promise.all([
    db.select({ v: quotes.id }).from(quotes).where(and(eq(quotes.status, "draft"))).limit(1),
    db.select({ v: clients.id }).from(clients),
    db.select({ v: quotes.id }).from(quotes),
  ]);

  return {
    leadsOpen: leadsOpen.length,
    clientsTotal: clientsTotal.length,
    quotesOpen: quotesOpen.length,
  };
}
