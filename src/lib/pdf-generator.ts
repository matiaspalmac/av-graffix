"use server";

import jsPDF from "jspdf";
import { db } from "@/db/client";
import { quotes, quoteItems, invoices, clients, payments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { formatCLP, formatRUT } from "@/lib/chilean-utils";
import { getCompanySettings } from "@/lib/company-config";

/**
 * Genera HTML para PDF de cotización
 */
export async function generateQuotationHTML(quoteId: number): Promise<string> {
  try {
    const company = await getCompanySettings();

    // Obtener cotización
    const [quoteData] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.id, quoteId))
      .limit(1);

    if (!quoteData) throw new Error("Cotización no encontrada");

    // Obtener cliente
    const [clientData] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, quoteData.clientId))
      .limit(1);

    // Obtener items
    const items = await db
      .select()
      .from(quoteItems)
      .where(eq(quoteItems.quoteId, quoteId));

    const issueDate = new Date(quoteData.issueDate).toLocaleDateString("es-CL");
    const validUntil = new Date(quoteData.validUntil).toLocaleDateString("es-CL");

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cotización ${quoteData.quoteNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 900px; margin: 0 auto; padding: 40px; background: white; }
          
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #007bff; padding-bottom: 20px; }
          .company-info h1 { color: #007bff; font-size: 32px; margin-bottom: 5px; }
          .company-info p { color: #666; font-size: 12px; margin: 2px 0; }
          .document-info { text-align: right; }
          .document-info .title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 10px; }
          .document-info .number { font-size: 24px; color: #007bff; font-weight: bold; margin-bottom: 10px; }
          .document-info table { font-size: 12px; }
          .document-info td { padding: 3px 10px 3px 0; }
          .document-info td.label { font-weight: 600; }
          
          .client-section { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 5px; }
          .client-section h3 { color: #007bff; font-size: 13px; margin-bottom: 10px; }
          .client-section p { font-size: 12px; margin: 3px 0; }
          
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .items-table thead { background: #007bff; color: white; }
          .items-table th { padding: 10px; text-align: left; font-size: 12px; font-weight: 600; }
          .items-table td { padding: 10px; font-size: 12px; border-bottom: 1px solid #ddd; }
          .items-table tfoot tr { background: #f8f9fa; }
          .items-table tfoot td { padding: 10px; font-weight: 600; border-top: 2px solid #007bff; }
          .text-right { text-align: right; }
          
          .totals-section { margin-left: auto; margin-bottom: 30px; width: 300px; }
          .totals-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; }
          .totals-row.total { font-size: 16px; font-weight: bold; color: #007bff; border-top: 1px solid #ddd; padding-top: 8px; margin-top: 8px; }
          
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 11px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="company-info">
              <h1>${company.nameCommercial}</h1>
              <p><strong>${company.nameFull}</strong></p>
              <p>RUT: ${company.rut}</p>
              <p>Giro: ${company.businessType}</p>
              <p>${company.city}, ${company.region}, ${company.country}</p>
              <p>Teléfono: ${company.phone}</p>
              <p>Email: ${company.email}</p>
            </div>
            <div class="document-info">
              <div class="title">COTIZACIÓN</div>
              <div class="number">${quoteData.quoteNumber}</div>
              <table>
                <tr><td class="label">Fecha:</td><td>${issueDate}</td></tr>
                <tr><td class="label">Válida hasta:</td><td>${validUntil}</td></tr>
              </table>
            </div>
          </div>
          
          <div class="client-section">
            <div>
              <h3>CLIENTE</h3>
              <p><strong>${clientData?.legalName || "N/A"}</strong></p>
              <p>${clientData?.tradeName || "N/A"}</p>
              <p>RUT: ${clientData?.rut ? formatRUT(clientData.rut) : "N/A"}</p>
              <p>Giro: ${clientData?.giro || "N/A"}</p>
              <p>${clientData?.address || ""}</p>
              <p>${clientData?.city || "Temuco"}, ${clientData?.region || "Araucanía"}</p>
            </div>
            <div>
              <h3>CONTACTO</h3>
              <p><strong>${clientData?.contactName || "N/A"}</strong></p>
              <p>${clientData?.contactEmail || "N/A"}</p>
              <p>${clientData?.contactPhone || "N/A"}</p>
            </div>
          </div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 35%;">Descripción</th>
                <th style="width: 10%; text-align: center;">Cantidad</th>
                <th style="width: 15%; text-align: right;">Precio Unit.</th>
                <th style="width: 20%; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map((item) => `
                <tr>
                  <td>${item.description}</td>
                  <td style="text-align: center;">${item.qty}</td>
                  <td class="text-right">${formatCLP(item.unitPriceClp)}</td>
                  <td class="text-right">${formatCLP(item.lineTotalClp)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          
          <div class="totals-section">
            <div class="totals-row">
              <span>Subtotal:</span>
              <span>${formatCLP(quoteData.subtotalClp)}</span>
            </div>
            ${quoteData.discountClp > 0 ? `
              <div class="totals-row">
                <span>Descuento:</span>
                <span>-${formatCLP(quoteData.discountClp)}</span>
              </div>
            ` : ""}
            <div class="totals-row">
              <span>IVA (19%):</span>
              <span>${formatCLP(quoteData.taxClp)}</span>
            </div>
            <div class="totals-row total">
              <span>TOTAL:</span>
              <span>${formatCLP(quoteData.totalClp)}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Este documento es una cotización válida hasta ${validUntil}.</p>
            <p>${company.nameCommercial} – ${company.city} – ${company.phone}</p>
            <p>Generado el ${issueDate} © 2026</p>
          </div>
        </div>
      </body>
      </html>
    `;
  } catch (error) {
    console.error("[generateQuotationHTML] Error:", error);
    throw error;
  }
}

/**
 * Genera HTML para PDF de factura formato chileno
 */
export async function generateInvoiceHTML(invoiceId: number): Promise<string> {
  try {
    // Obtener datos de empresa
    const company = await getCompanySettings();

    // Obtener factura
    const [invoiceData] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.id, invoiceId))
      .limit(1);

    if (!invoiceData) throw new Error("Factura no encontrada");

    // Obtener cliente
    const [clientData] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, invoiceData.clientId))
      .limit(1);

    // Obtener pagos
    const paymentsList = await db
      .select()
      .from(payments)
      .where(eq(payments.invoiceId, invoiceId));

    const issueDate = new Date(invoiceData.issueDate).toLocaleDateString("es-CL");
    const dueDate = invoiceData.dueDate
      ? new Date(invoiceData.dueDate).toLocaleDateString("es-CL")
      : "A convenir";

    const totalPaid = paymentsList.reduce((sum, p) => sum + p.amountClp, 0);
    const balance = invoiceData.totalClp - totalPaid;

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Factura ${invoiceData.invoiceNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; background: white; }
          .container { max-width: 900px; margin: 0 auto; padding: 40px; }
          
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 3px solid #dc3545; padding-bottom: 20px; }
          .company-info h1 { color: #dc3545; font-size: 32px; margin-bottom: 5px; }
          .company-info p { color: #666; font-size: 12px; }
          
          .invoice-info { text-align: right; }
          .invoice-info .title { font-size: 16px; font-weight: bold; color: #333; margin-bottom: 5px; }
          .invoice-info .number { font-size: 32px; color: #dc3545; font-weight: bold; margin-bottom: 10px; }
          .invoice-info table { font-size: 12px; margin-left: auto; }
          .invoice-info td { padding: 3px 0; }
          .invoice-info td:first-child { font-weight: 600; padding-right: 20px; }
          
          .summary { display: flex; justify-content: flex-end; margin-top: 30px; }
          .summary-box { width: 350px; }
          .summary-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 12px; }
          .summary-row.total { font-size: 16px; font-weight: bold; color: white; background: #dc3545; padding: 12px; margin-top: 5px; }
          
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 10px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="company-info">
              <h1>${company.nameCommercial}</h1>
              <p><strong>${company.nameFull}</strong></p>
              <p>RUT: ${company.rut} | ${company.businessType}</p>
              <p>${company.city}, ${company.region}</p>
              <p>${company.email} | ${company.phone}</p>
            </div>
            <div class="invoice-info">
              <div class="title">Factura</div>
              <div class="number">${invoiceData.invoiceNumber}</div>
              <table>
                <tr><td>Fecha emisión:</td><td>${issueDate}</td></tr>
                <tr><td>Vencimiento:</td><td>${dueDate}</td></tr>
              </table>
            </div>
          </div>
          
          <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 5px;">
            <p><strong>Cliente:</strong> ${clientData?.legalName || "N/A"}</p>
            <p><strong>RUT:</strong> ${clientData?.rut ? formatRUT(clientData.rut) : "N/A"}</p>
            <p><strong>Dirección:</strong> ${clientData?.address || "N/A"}</p>
          </div>
          
          <div class="summary">
            <div class="summary-box">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>${formatCLP(invoiceData.subtotalClp)}</span>
              </div>
              <div class="summary-row">
                <span>IVA (19%):</span>
                <span>${formatCLP(invoiceData.taxClp)}</span>
              </div>
              <div class="summary-row total">
                <span>TOTAL FACTURA:</span>
                <span>${formatCLP(invoiceData.totalClp)}</span>
              </div>
              ${totalPaid > 0 ? `
                <div class="summary-row" style="color: #28a745;">
                  <span>Pagado:</span>
                  <span>-${formatCLP(totalPaid)}</span>
                </div>
              ` : ""}
            </div>
          </div>
          
          <div class="footer">
            <p>${company.nameCommercial} – ${company.city} – ${company.phone} | Factura generada por ERP © 2026</p>
          </div>
        </div>
      </body>
      </html>
    `;
  } catch (error) {
    console.error("[generateInvoiceHTML] Error:", error);
    throw error;
  }
}

/**
 * Convierte HTML a PDF (nota: implementación simplificada)
 * Para producción, usar servicios externos como html2pdf.net
 */
export async function htmlToPDF(html: string, filename: string): Promise<Buffer> {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Placeholder para generación real de PDF
    // En producción usar API externa o Puppeteer
    return Buffer.from(pdf.output("arraybuffer"));
  } catch (error) {
    console.error("[htmlToPDF] Error:", error);
    throw error;
  }
}
