"use server";

import { db } from "@/db/client";
import { quotes, projects, invoices, clients, purchaseOrders, materials } from "@/db/schema";
import { ilike, or, and, eq, gte, lte } from "drizzle-orm";
import { auth } from "@/auth";

export interface GlobalSearchResult {
  type: "client" | "quote" | "project" | "invoice" | "purchase_order" | "material";
  id: number;
  title: string;
  subtitle?: string;
  metadata?: Record<string, unknown>;
  link: string;
}

/**
 * Búsqueda global en el ERP
 * Busca en: Clientes, Cotizaciones, Proyectos, Facturas, OC, Materiales
 */
export async function globalSearch(query: string, limit = 15): Promise<GlobalSearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  const searchQuery = `%${query.trim()}%`;
  const results: GlobalSearchResult[] = [];

  try {
    // Buscar clientes
    const clientResults = await db
      .select({
        id: clients.id,
        tradeName: clients.tradeName,
        legalName: clients.legalName,
        rut: clients.rut,
      })
      .from(clients)
      .where(or(ilike(clients.tradeName, searchQuery), ilike(clients.legalName, searchQuery), ilike(clients.rut, searchQuery)))
      .limit(5);

    for (const client of clientResults) {
      results.push({
        type: "client",
        id: client.id,
        title: client.tradeName,
        subtitle: client.rut,
        metadata: { legalName: client.legalName },
        link: `/erp/ventas?clientId=${client.id}`,
      });
    }

    // Buscar cotizaciones
    const quoteResults = await db
      .select({
        id: quotes.id,
        quoteNumber: quotes.quoteNumber,
        status: quotes.status,
        totalClp: quotes.totalClp,
        client: { tradeName: clients.tradeName },
      })
      .from(quotes)
      .leftJoin(clients, eq(quotes.clientId, clients.id))
      .where(ilike(quotes.quoteNumber, searchQuery))
      .limit(5);

    for (const quote of quoteResults) {
      results.push({
        type: "quote",
        id: quote.id,
        title: quote.quoteNumber,
        subtitle: quote.client?.tradeName || "N/A",
        metadata: { status: quote.status, totalClp: quote.totalClp },
        link: `/erp/ventas?quoteId=${quote.id}`,
      });
    }

    // Buscar proyectos
    const projectResults = await db
      .select({
        id: projects.id,
        projectCode: projects.projectCode,
        name: projects.name,
        status: projects.status,
        client: { tradeName: clients.tradeName },
      })
      .from(projects)
      .leftJoin(clients, eq(projects.clientId, clients.id))
      .where(or(ilike(projects.projectCode, searchQuery), ilike(projects.name, searchQuery)))
      .limit(5);

    for (const project of projectResults) {
      results.push({
        type: "project",
        id: project.id,
        title: project.projectCode,
        subtitle: `${project.name} (${project.client?.tradeName || "N/A"})`,
        metadata: { status: project.status },
        link: `/erp/proyectos?projectId=${project.id}`,
      });
    }

    // Buscar facturas
    const invoiceResults = await db
      .select({
        id: invoices.id,
        invoiceNumber: invoices.invoiceNumber,
        status: invoices.status,
        totalClp: invoices.totalClp,
        client: { tradeName: clients.tradeName },
      })
      .from(invoices)
      .leftJoin(clients, eq(invoices.clientId, clients.id))
      .where(ilike(invoices.invoiceNumber, searchQuery))
      .limit(5);

    for (const invoice of invoiceResults) {
      results.push({
        type: "invoice",
        id: invoice.id,
        title: invoice.invoiceNumber,
        subtitle: invoice.client?.tradeName || "N/A",
        metadata: { status: invoice.status, totalClp: invoice.totalClp },
        link: `/erp/finanzas?invoiceId=${invoice.id}`,
      });
    }

    // Buscar órdenes de compra
    const poResults = await db
      .select({
        id: purchaseOrders.id,
        poNumber: purchaseOrders.poNumber,
        status: purchaseOrders.status,
        totalClp: purchaseOrders.totalClp,
      })
      .from(purchaseOrders)
      .where(ilike(purchaseOrders.poNumber, searchQuery))
      .limit(5);

    for (const po of poResults) {
      results.push({
        type: "purchase_order",
        id: po.id,
        title: po.poNumber,
        metadata: { status: po.status, totalClp: po.totalClp },
        link: `/erp/compras?poId=${po.id}`,
      });
    }

    // Buscar materiales
    const materialResults = await db
      .select({
        id: materials.id,
        name: materials.name,
        sku: materials.sku,
        category: materials.category,
      })
      .from(materials)
      .where(or(ilike(materials.name, searchQuery), ilike(materials.sku, searchQuery)))
      .limit(5);

    for (const material of materialResults) {
      results.push({
        type: "material",
        id: material.id,
        title: material.name,
        subtitle: material.sku,
        metadata: { category: material.category },
        link: `/erp/inventario?materialId=${material.id}`,
      });
    }

    return results.slice(0, limit);
  } catch (error) {
    console.error("[globalSearch] Error:", error);
    return [];
  }
}

export interface FilterOptions {
  status?: string[];
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  userId?: number;
  clientId?: number;
}

/**
 * Filtro avanzado para cotizaciones
 */
export async function filterQuotes(options: FilterOptions) {
  try {
    let query = db.select().from(quotes);

    if (options.status && options.status.length > 0) {
      query = query.where(eq(quotes.status, options.status[0])) as any;
    }

    if (options.dateFrom) {
      query = query.where(gte(quotes.issueDate, options.dateFrom)) as any;
    }

    if (options.dateTo) {
      query = query.where(lte(quotes.issueDate, options.dateTo)) as any;
    }

    if (options.minAmount) {
      query = query.where(gte(quotes.totalClp, options.minAmount)) as any;
    }

    if (options.maxAmount) {
      query = query.where(lte(quotes.totalClp, options.maxAmount)) as any;
    }

    if (options.clientId) {
      query = query.where(eq(quotes.clientId, options.clientId)) as any;
    }

    if (options.userId) {
      query = query.where(eq(quotes.salesUserId, options.userId)) as any;
    }

    return await query.limit(100);
  } catch (error) {
    console.error("[filterQuotes] Error:", error);
    return [];
  }
}

/**
 * Filtro avanzado para proyectos
 */
export async function filterProjects(options: FilterOptions) {
  try {
    let query = db.select().from(projects);

    if (options.status && options.status.length > 0) {
      query = query.where(eq(projects.status, options.status[0])) as any;
    }

    if (options.dateFrom) {
      query = query.where(gte(projects.startDate, options.dateFrom)) as any;
    }

    if (options.dateTo) {
      query = query.where(lte(projects.dueDate, options.dateTo)) as any;
    }

    if (options.clientId) {
      query = query.where(eq(projects.clientId, options.clientId)) as any;
    }

    if (options.userId) {
      query = query.where(eq(projects.projectManagerId, options.userId)) as any;
    }

    return await query.limit(100);
  } catch (error) {
    console.error("[filterProjects] Error:", error);
    return [];
  }
}

/**
 * Filtro avanzado para facturas
 */
export async function filterInvoices(options: FilterOptions) {
  try {
    let query = db.select().from(invoices);

    if (options.status && options.status.length > 0) {
      query = query.where(eq(invoices.status, options.status[0])) as any;
    }

    if (options.dateFrom) {
      query = query.where(gte(invoices.issueDate, options.dateFrom)) as any;
    }

    if (options.dateTo) {
      query = query.where(lte(invoices.issueDate, options.dateTo)) as any;
    }

    if (options.minAmount) {
      query = query.where(gte(invoices.totalClp, options.minAmount)) as any;
    }

    if (options.maxAmount) {
      query = query.where(lte(invoices.totalClp, options.maxAmount)) as any;
    }

    if (options.clientId) {
      query = query.where(eq(invoices.clientId, options.clientId)) as any;
    }

    return await query.limit(100);
  } catch (error) {
    console.error("[filterInvoices] Error:", error);
    return [];
  }
}
