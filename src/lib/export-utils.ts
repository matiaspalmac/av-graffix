"use server";

import * as XLSX from "xlsx";
import { formatCLP, formatRUT } from "@/lib/chilean-utils";
import { getCompanySettings } from "@/lib/company-config";

export interface ExportOptions {
  filename: string;
  sheetName?: string;
  format: "xlsx" | "csv";
  includeCompanyHeader?: boolean;
}

interface CompanyInfo {
  nameCommercial: string;
  nameFull: string;
  rut: string;
  phone: string;
  email: string;
  city: string;
}

/**
 * Exporta datos a Excel o CSV
 */
export async function exportData<T extends Record<string, unknown>>(
  data: T[],
  options: ExportOptions,
  company?: CompanyInfo
): Promise<Buffer> {
  if (!data || data.length === 0) {
    throw new Error("No hay datos para exportar");
  }

  // Formatear datos para presentación
  const formattedData = data.map((row) => {
    const formatted: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(row)) {
      // Formatear valores según tipo
      if (typeof value === "number" && key.toLowerCase().includes("clp")) {
        formatted[key] = formatCLP(value);
      } else if (key.toLowerCase().includes("rut") && typeof value === "string") {
        formatted[key] = formatRUT(value);
      } else if (value instanceof Date) {
        formatted[key] = value.toLocaleDateString("es-CL");
      } else if (value === null || value === undefined) {
        formatted[key] = "";
      } else {
        formatted[key] = value;
      }
    }

    return formatted;
  });

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // Agregar encabezado de empresa si se proporciona
  if (company && options.includeCompanyHeader) {
    const headerRows = [
      { col: company.nameCommercial },
      { col: `${company.rut} – ${company.city}` },
      { col: `${company.email} | ${company.phone}` },
      { col: "" },
    ];

    const headerSheet = XLSX.utils.json_to_sheet(headerRows);

    // Combinar encabezado con datos
    const mergedData = [
      ...headerRows,
      {},
      ...formattedData,
    ];

    const mergedSheet = XLSX.utils.json_to_sheet(mergedData);

    // Auto-ajustar ancho de columnas
    const allKeys = Object.keys(formattedData[0]);
    const colWidths = allKeys.map((key) => ({
      wch: Math.max(key.length, 20),
    }));
    mergedSheet["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(workbook, mergedSheet, options.sheetName || "Data");
  } else {
    // Auto-ajustar ancho de columnas
    const colWidths = Object.keys(formattedData[0]).map((key) => ({
      wch: Math.max(key.length, 20),
    }));
    worksheet["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, options.sheetName || "Data");
  }

  const buffer = XLSX.write(workbook, { bookType: options.format, type: "buffer" });
  return buffer;
}

/**
 * Exporta cotizaciones a Excel
 */
export async function exportQuotesToExcel(quotes: any[]): Promise<Buffer> {
  const company = await getCompanySettings();

  const formatted = quotes.map((q) => ({
    "N° Cotización": q.quoteNumber,
    Cliente: q.client?.tradeName || "N/A",
    RUT: q.client?.rut || "N/A",
    "Fecha Emisión": new Date(q.issueDate).toLocaleDateString("es-CL"),
    "Válida Hasta": new Date(q.validUntil).toLocaleDateString("es-CL"),
    Subtotal: formatCLP(q.subtotalClp),
    IVA: formatCLP(q.taxClp),
    Total: formatCLP(q.totalClp),
    Estado: q.status,
    Vendedor: q.salesUser?.fullName || "N/A",
  }));

  return await exportData(formatted, {
    filename: `cotizaciones_${new Date().toISOString().split("T")[0]}.xlsx`,
    sheetName: "Cotizaciones",
    format: "xlsx",
    includeCompanyHeader: true,
  }, {
    nameCommercial: company.nameCommercial,
    nameFull: company.nameFull,
    rut: company.rut,
    phone: company.phone,
    email: company.email,
    city: company.city,
  });
}

/**
 * Exporta proyectos a Excel
 */
export async function exportProjectsToExcel(projects: any[]): Promise<Buffer> {
  const company = await getCompanySettings();

  const formatted = projects.map((p) => ({
    Código: p.projectCode,
    Nombre: p.name,
    Cliente: p.client?.tradeName || "N/A",
    Tipo: p.serviceType,
    Estado: p.status,
    "Fecha Inicio": p.startDate ? new Date(p.startDate).toLocaleDateString("es-CL") : "N/A",
    "Fecha Vencimiento": p.dueDate ? new Date(p.dueDate).toLocaleDateString("es-CL") : "N/A",
    "Presupuesto Ingresos": formatCLP(p.budgetRevenueClp),
    "Presupuesto Costos": formatCLP(p.budgetCostClp),
    "Margen Esperado %": `${p.expectedMarginPct?.toFixed(1)}%` || "N/A",
    Responsable: p.projectManager?.fullName || "N/A",
  }));

  return await exportData(formatted, {
    filename: `proyectos_${new Date().toISOString().split("T")[0]}.xlsx`,
    sheetName: "Proyectos",
    format: "xlsx",
    includeCompanyHeader: true,
  }, {
    nameCommercial: company.nameCommercial,
    nameFull: company.nameFull,
    rut: company.rut,
    phone: company.phone,
    email: company.email,
    city: company.city,
  });
}

/**
 * Exporta facturas a Excel
 */
export async function exportInvoicesToExcel(invoices: any[]): Promise<Buffer> {
  const company = await getCompanySettings();

  const formatted = invoices.map((i) => ({
    "N° Factura": i.invoiceNumber,
    Cliente: i.client?.tradeName || "N/A",
    RUT: i.client?.rut || "N/A",
    Proyecto: i.project?.projectCode || "N/A",
    "Fecha Emisión": new Date(i.issueDate).toLocaleDateString("es-CL"),
    "Fecha Vencimiento": i.dueDate ? new Date(i.dueDate).toLocaleDateString("es-CL") : "N/A",
    Subtotal: formatCLP(i.subtotalClp),
    IVA: formatCLP(i.taxClp),
    Total: formatCLP(i.totalClp),
    Estado: i.status,
    Creado: i.createdByUser?.fullName || "N/A",
  }));

  return await exportData(formatted, {
    filename: `facturas_${new Date().toISOString().split("T")[0]}.xlsx`,
    sheetName: "Facturas",
    format: "xlsx",
    includeCompanyHeader: true,
  }, {
    nameCommercial: company.nameCommercial,
    nameFull: company.nameFull,
    rut: company.rut,
    phone: company.phone,
    email: company.email,
    city: company.city,
  });
}

/**
 * Exporta órdenes de compra a Excel
 */
export async function exportPurchaseOrdersToExcel(purchaseOrders: any[]): Promise<Buffer> {
  const company = await getCompanySettings();

  const formatted = purchaseOrders.map((po) => ({
    "N° Orden": po.poNumber,
    Proveedor: po.supplier?.tradeName || "N/A",
    "Fecha Emisión": new Date(po.issueDate).toLocaleDateString("es-CL"),
    "Fecha Esperada": po.expectedDate ? new Date(po.expectedDate).toLocaleDateString("es-CL") : "N/A",
    Subtotal: formatCLP(po.subtotalClp),
    Descuento: formatCLP(po.discountClp),
    IVA: formatCLP(po.taxClp),
    "Envío": formatCLP(po.shippingClp),
    Total: formatCLP(po.totalClp),
    Estado: po.status,
    Solicitante: po.requesterUser?.fullName || "N/A",
  }));

  return await exportData(formatted, {
    filename: `ordenes_compra_${new Date().toISOString().split("T")[0]}.xlsx`,
    sheetName: "OC",
    format: "xlsx",
    includeCompanyHeader: true,
  }, {
    nameCommercial: company.nameCommercial,
    nameFull: company.nameFull,
    rut: company.rut,
    phone: company.phone,
    email: company.email,
    city: company.city,
  });
}

/**
 * Exporta consumo de materiales a Excel
 */
export async function exportMaterialConsumptionToExcel(consumptions: any[]): Promise<Buffer> {
  const company = await getCompanySettings();

  const formatted = consumptions.map((c) => ({
    Proyecto: c.project?.projectCode || "N/A",
    Material: c.material?.name || "N/A",
    "Planificado": c.qtyPlanned || 0,
    "Consumido": c.qtyUsed || 0,
    Residuo: c.wasteQty || 0,
    "% Residuo": `${c.wastePct?.toFixed(1)}%` || "0%",
    "Costo Unitario": formatCLP(c.unitCostClp),
    "Costo Total": formatCLP(c.totalCostClp),
    "Fecha": c.consumptionDate ? new Date(c.consumptionDate).toLocaleDateString("es-CL") : "N/A",
    Operador: c.operatorUser?.fullName || "N/A",
  }));

  return await exportData(formatted, {
    filename: `consumo_materiales_${new Date().toISOString().split("T")[0]}.xlsx`,
    sheetName: "Consumo",
    format: "xlsx",
    includeCompanyHeader: true,
  }, {
    nameCommercial: company.nameCommercial,
    nameFull: company.nameFull,
    rut: company.rut,
    phone: company.phone,
    email: company.email,
    city: company.city,
  });
}

/**
 * Exporta rentabilidad por proyecto a Excel
 */
export async function exportProfitabilityToExcel(projects: any[]): Promise<Buffer> {
  const company = await getCompanySettings();

  const formatted = projects.map((p) => ({
    Código: p.projectCode,
    Proyecto: p.name,
    Cliente: p.client?.tradeName || "N/A",
    "Ingresos Facturados": formatCLP(p.invoicedTotal || 0),
    "Costo Labor": formatCLP(p.laborCostTotal || 0),
    "Costo Materiales": formatCLP(p.materialCostTotal || 0),
    "Costo Total": formatCLP((p.laborCostTotal || 0) + (p.materialCostTotal || 0)),
    "Margen Bruto": formatCLP((p.invoicedTotal || 0) - ((p.laborCostTotal || 0) + (p.materialCostTotal || 0))),
    "Margen %": `${(((p.invoicedTotal || 0) - ((p.laborCostTotal || 0) + (p.materialCostTotal || 0))) / (p.invoicedTotal || 1) * 100).toFixed(1)}%`,
    Estado: p.status,
  }));

  return await exportData(formatted, {
    filename: `rentabilidad_${new Date().toISOString().split("T")[0]}.xlsx`,
    sheetName: "Rentabilidad",
    format: "xlsx",
    includeCompanyHeader: true,
  }, {
    nameCommercial: company.nameCommercial,
    nameFull: company.nameFull,
    rut: company.rut,
    phone: company.phone,
    email: company.email,
    city: company.city,
  });
}

/**
 * Convierte Excel Buffer a CSV
 */
export async function convertExcelToCSV(excelBuffer: Buffer, sheetName = "Sheet1"): Promise<string> {
  const workbook = XLSX.read(excelBuffer, { type: "buffer" });
  const worksheet = workbook.Sheets[sheetName] || workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_csv(worksheet);
}
