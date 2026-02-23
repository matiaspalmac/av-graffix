import { sql } from "drizzle-orm";
import { ModuleShell } from "@/components/erp/module-shell";
import { db } from "@/db/client";
import { clients, leads, quotes } from "@/db/schema";

export default async function VentasPage() {
  const [leadsOpen, clientsTotal, quotesOpen] = await Promise.all([
    db.select({ v: sql<number>`count(*)` }).from(leads).where(sql`${leads.status} not in ('won','lost')`),
    db.select({ v: sql<number>`count(*)` }).from(clients),
    db.select({ v: sql<number>`count(*)` }).from(quotes).where(sql`${quotes.status} in ('draft','sent','approved')`),
  ]);

  return (
    <ModuleShell
      title="CRM & Ventas"
      description="Leads, clientes y cotizaciones para branding, etiquetas, folletería y soportes gráficos."
      kpis={[
        { label: "Leads activos", value: String(leadsOpen[0]?.v ?? 0) },
        { label: "Clientes", value: String(clientsTotal[0]?.v ?? 0) },
        { label: "Cotizaciones abiertas", value: String(quotesOpen[0]?.v ?? 0) },
      ]}
    />
  );
}
