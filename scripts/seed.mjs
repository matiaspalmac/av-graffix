/* global process, console */
import "dotenv/config";
import { createClient } from "@libsql/client";
import { hash } from "bcryptjs";

const tursoUrl = process.env.TURSO_URL;
const tursoToken = process.env.TURSO_TOKEN;

if (!tursoUrl || !tursoToken) {
  throw new Error("TURSO_URL y TURSO_TOKEN son obligatorios para seed.");
}

const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@avgraffix.cl").toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin1234!";
const adminName = process.env.ADMIN_NAME ?? "Administrador AV GRAFFIX";
const financeEmail = (process.env.FINANCE_EMAIL ?? "finanzas@avgraffix.cl").toLowerCase();
const financePassword = process.env.FINANCE_PASSWORD ?? "Finanzas1234!";
const financeName = process.env.FINANCE_NAME ?? "Finanzas AV GRAFFIX";

const client = createClient({
  url: tursoUrl,
  authToken: tursoToken,
});

const now = new Date().toISOString();
const adminPasswordHash = await hash(adminPassword, 10);
const financePasswordHash = await hash(financePassword, 10);

const roles = [
  ["admin", "Administrador", "Control total del ERP", 100, 1],
  ["ventas", "Ventas", "Pipeline, cotizaciones y clientes", 60, 2],
  ["produccion", "Producción", "Ordenes, consumos e inventario", 70, 3],
  ["finanzas", "Finanzas", "Facturación, cobranza y reportes", 80, 4],
];

for (const [code, name, description, level, sortOrder] of roles) {
  await client.execute({
    sql: `
      INSERT INTO roles (code, name, description, is_active, permissions_json, level, sort_order, created_at, updated_at)
      VALUES (?, ?, ?, 1, '{}', ?, ?, ?, ?)
      ON CONFLICT(code) DO UPDATE SET
        name = excluded.name,
        description = excluded.description,
        level = excluded.level,
        sort_order = excluded.sort_order,
        updated_at = excluded.updated_at
    `,
    args: [code, name, description, level, sortOrder, now, now],
  });
}

const roleResult = await client.execute({
  sql: `SELECT id FROM roles WHERE code = 'admin' LIMIT 1`,
  args: [],
});

if (roleResult.rows.length === 0) {
  throw new Error("No se encontró rol admin tras el seed.");
}

const roleId = Number(roleResult.rows[0].id);

const financeRoleResult = await client.execute({
  sql: `SELECT id FROM roles WHERE code = 'finanzas' LIMIT 1`,
  args: [],
});

if (financeRoleResult.rows.length === 0) {
  throw new Error("No se encontró rol finanzas tras el seed.");
}

const financeRoleId = Number(financeRoleResult.rows[0].id);

await client.execute({
  sql: `
    INSERT INTO users (role_id, full_name, email, phone, password_hash, is_active, timezone, locale, created_at, updated_at)
    VALUES (?, ?, ?, '', ?, 1, 'America/Santiago', 'es-CL', ?, ?)
    ON CONFLICT(email) DO UPDATE SET
      role_id = excluded.role_id,
      full_name = excluded.full_name,
      password_hash = excluded.password_hash,
      is_active = 1,
      updated_at = excluded.updated_at
  `,
  args: [roleId, adminName, adminEmail, adminPasswordHash, now, now],
});

await client.execute({
  sql: `
    INSERT INTO users (role_id, full_name, email, phone, password_hash, is_active, timezone, locale, created_at, updated_at)
    VALUES (?, ?, ?, '', ?, 1, 'America/Santiago', 'es-CL', ?, ?)
    ON CONFLICT(email) DO UPDATE SET
      role_id = excluded.role_id,
      full_name = excluded.full_name,
      password_hash = excluded.password_hash,
      is_active = 1,
      updated_at = excluded.updated_at
  `,
  args: [financeRoleId, financeName, financeEmail, financePasswordHash, now, now],
});

// Crear más usuarios
const productionEmail = (process.env.PRODUCTION_EMAIL ?? "produccion@avgraffix.cl").toLowerCase();
const productionPassword = process.env.PRODUCTION_PASSWORD ?? "Produccion1234!";
const productionName = process.env.PRODUCTION_NAME ?? "Producción AV GRAFFIX";
const salesEmail = (process.env.SALES_EMAIL ?? "ventas@avgraffix.cl").toLowerCase();
const salesPassword = process.env.SALES_PASSWORD ?? "Ventas1234!";
const salesName = process.env.SALES_NAME ?? "Ventas AV GRAFFIX";

const productionPasswordHash = await hash(productionPassword, 10);
const salesPasswordHash = await hash(salesPassword, 10);

const productionRoleResult = await client.execute({
  sql: `SELECT id FROM roles WHERE code = 'produccion' LIMIT 1`,
  args: [],
});
const productionRoleId = Number(productionRoleResult.rows[0].id);

const salesRoleResult = await client.execute({
  sql: `SELECT id FROM roles WHERE code = 'ventas' LIMIT 1`,
  args: [],
});
const salesRoleId = Number(salesRoleResult.rows[0].id);

// Crear usuarios adicionales
await client.execute({
  sql: `
    INSERT INTO users (role_id, full_name, email, phone, password_hash, is_active, timezone, locale, created_at, updated_at)
    VALUES (?, ?, ?, '+56 9 2345 6789', ?, 1, 'America/Santiago', 'es-CL', ?, ?)
    ON CONFLICT(email) DO UPDATE SET role_id = excluded.role_id, full_name = excluded.full_name, is_active = 1
  `,
  args: [productionRoleId, productionName, productionEmail, productionPasswordHash, now, now],
});

await client.execute({
  sql: `
    INSERT INTO users (role_id, full_name, email, phone, password_hash, is_active, timezone, locale, created_at, updated_at)
    VALUES (?, ?, ?, '+56 9 3456 7890', ?, 1, 'America/Santiago', 'es-CL', ?, ?)
    ON CONFLICT(email) DO UPDATE SET role_id = excluded.role_id, full_name = excluded.full_name, is_active = 1
  `,
  args: [salesRoleId, salesName, salesEmail, salesPasswordHash, now, now],
});

// Seed de Materiales (Productos de agencia gráfica en Temuco)
const materials = [
  ["VINYL-3M-55-WH", "Vinilo 3M Scotchcal 3630 Blanco 1.37m", "Vinilos", "rollo", "3M", "Scotchcal 3630", "Blanco", 1370, null, "muy_durable", 5, 5],
  ["VINYL-3M-55-BK", "Vinilo 3M Scotchcal 3630 Negro 1.37m", "Vinilos", "rollo", "3M", "Scotchcal 3630", "Negro", 1370, null, "muy_durable", 5, 5],
  ["VINYL-3M-55-RD", "Vinilo 3M Scotchcal 3630 Rojo 1.37m", "Vinilos", "rollo", "3M", "Scotchcal 3630", "Rojo", 1370, null, "muy_durable", 5, 5],
  ["OXFORD-TELA-150", "Tela Oxford 150gsm Blanca 1.50m", "Telas", "rollo", "Oxford", "Premium", "Blanco", 1500, 150, "durable", 3, 3],
  ["PAPER-COUCHE-A4", "Papel Couché A4 150gsm Brillante", "Papeles", "pkg", "Mondi", "Coated", "Blanco", null, 150, "estandar", 10, 50],
  ["PAPER-BOND-A4", "Papel Bond A4 75gsm Resma", "Papeles", "ream", "CMPC", "Bond", "Blanco", null, 75, "estandar", 5, 20],
  ["ADHESIVE-SPRAY-CAN", "Pegamento en Spray 3M Super 77 500ml", "Adhesivos", "unit", "3M", "Super 77", null, null, null, "estandar", 2, 5],
  ["INK-DYE-MG-1L", "Tinta Para Sublimación Magenta 1L", "Tintas", "disp", "Inktec", "Sublimation", "Magenta", null, null, "estandar", 0.5, 2],
  ["INK-DYE-CY-1L", "Tinta Para Sublimación Cyan 1L", "Tintas", "disp", "Inktec", "Sublimation", "Cyan", null, null, "estandar", 0.5, 2],
  ["INK-DYE-YL-1L", "Tinta Para Sublimación Amarillo 1L", "Tintas", "disp", "Inktec", "Sublimation", "Amarillo", null, null, "estandar", 0.5, 2],
  ["INK-DYE-BK-1L", "Tinta Para Sublimación Negro 1L", "Tintas", "disp", "Inktec", "Sublimation", "Negro", null, null, "estandar", 0.5, 2],
  ["LAMINATE-GLOSSY-1.4", "Película Laminado Glossy 1.4m x 50m", "Laminados", "rollo", "3M", "Laminate", "Glossy", 1400, null, "durable", 2, 3],
  ["LAMINATE-MATTE-1.4", "Película Laminado Mate 1.4m x 50m", "Laminados", "rollo", "3M", "Laminate", "Matte", 1400, null, "durable", 2, 3],
  ["FLEXI-HEAT-TRANSFER", "Rollo Transfer Flexi 1.5m x 100m", "Transferibles", "rollo", "Genérico", "Heat Transfer", "Light", 1500, null, "durable", 1, 2],
  ["CANVAS-MUSEUM-GRADE", "Lienzo Museo 380gsm 1.52m", "Lienzos", "rollo", "Epson", "Heritage", "Blanco", 1520, 380, "muy_durable", 2, 3],
];

for (const [sku, name, category, unit, brand, model, color, widthMm, grammage, durability, reorder, waste] of materials) {
  await client.execute({
    sql: `
      INSERT OR IGNORE INTO materials 
      (sku, name, category, base_unit, brand, model, color, width_mm, grammage_gsm, durability_level, reorder_point, default_waste_pct, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `,
    args: [sku, name, category, unit, brand, model, color, widthMm, grammage, durability, reorder, waste, now, now],
  });
}

// Seed de Proveedores chilenos
const suppliers = [
  ["76.123.456-0", "Antalis Chile S.A.", "Antalis", "CL", "Temuco", "Providencia 123", "Carlos Pérez", "carlos@antalis.cl", "+56 45 123 4567", 5, 30, "CLP", 1],
  ["79.234.567-1", "3M Chile Comercial Ltda.", "3M", "CL", "Temuco", "Arturo Prat 456", "María García", "maria@3mchile.cl", "+56 45 234 5678", 3, 15, "CLP", 1],
  ["76.345.678-2", "Mimaki Latam Distribuidora", "Mimaki", "CL", "Santiago", "Alameda 789", "Roberto López", "roberto@mimaki.cl", "+56 2 3456 7890", 7, 45, "CLP", 1],
  ["79.456.789-3", "DuPont Soluciones Gráficas", "DuPont", "CL", "Temuco", "Montt 234", "Ana Martínez", "ana@dupont.cl", "+56 45 345 6789", 5, 30, "CLP", 1],
  ["76.567.890-4", "Epson Representante Chile", "Epson", "CL", "Temuco", "Bulnes 567", "Luis Rodríguez", "luis@epson.cl", "+56 45 456 7890", 4, 20, "CLP", 1],
];

for (const [rut, legalName, tradeName, country, city, address, contact, email, phone, leadTime, paymentTerms, currency, active] of suppliers) {
  await client.execute({
    sql: `
      INSERT OR IGNORE INTO suppliers
      (legal_name, trade_name, rut, country, city, address, contact_name, contact_email, contact_phone, lead_time_days, payment_terms_days, currency_preference, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [legalName, tradeName, rut, country, city, address, contact, email, phone, leadTime, paymentTerms, currency, active, now, now],
  });
}

console.log("✅ Seed completado exitosamente");
console.log("==========================================");
console.log("USUARIOS DE PRUEBA CREADOS:");
console.log("==========================================");
console.log(`\n👤 ADMIN`);
console.log(`   Email: ${adminEmail}`);
console.log(`   Contraseña: ${adminPassword}`);
console.log(`\n👤 FINANZAS`);
console.log(`   Email: ${financeEmail}`);
console.log(`   Contraseña: ${financePassword}`);
console.log(`\n👤 PRODUCCIÓN`);
console.log(`   Email: ${productionEmail}`);
console.log(`   Contraseña: ${productionPassword}`);
console.log(`\n👤 VENTAS`);
console.log(`   Email: ${salesEmail}`);
console.log(`   Contraseña: ${salesPassword}`);
console.log("==========================================");
console.log("✅ 15 Materiales agregados");
console.log("✅ 5 Proveedores de Temuco agregados");
console.log("✅ 4 Usuarios de prueba creados");

// Seed de Company Settings - DATOS FIJOS DE LA EMPRESA
const companySettings = [
  ["company_name_full", "AV GRAFFIX DISEÑO Y PRODUCCION PUBLICITARIA LTDA", "Nombre legal completo"],
  ["company_name_commercial", "AV GRAFFIX", "Nombre comercial / marca"],
  ["company_rut", "77.096.036-3", "RUT de la empresa"],
  ["company_address", "Providencia 123, Temuco", "Dirección física"],
  ["company_city", "Temuco", "Ciudad"],
  ["company_region", "Región de La Araucanía", "Región"],
  ["company_country", "Chile", "País"],
  ["company_commune", "Temuco", "Comuna"],
  ["company_business_type", "PUBLICIDAD", "Giro comercial"],
  ["company_phone", "+56 9 9279 1148", "Teléfono principal"],
  ["company_email", "info@avgraffix.cl", "Email principal"],
  ["company_website", "https://avgraffix.cl", "Sitio web"],
  ["company_sii_status", "Contribuyente", "Estado SII"],
];

console.log("\n🏢 Configurando datos de la empresa:");
for (const [key, value, description] of companySettings) {
  await client.execute({
    sql: `
      INSERT INTO company_settings (key, value, description, is_editable, updated_at)
      VALUES (?, ?, ?, 0, ?)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        description = excluded.description,
        updated_at = excluded.updated_at
    `,
    args: [key, value, description, now],
  });
  console.log(`   ✓ ${key}`);
}

console.log("==========================================");
console.log("🏢 CONFIGURACIÓN DE LA EMPRESA:");
console.log("   Nombre: AV GRAFFIX DISEÑO Y PRODUCCION PUBLICITARIA LTDA");
console.log("   RUT: 77.096.036-3");
console.log("   Giro: PUBLICIDAD");
console.log("   Ubicación: Temuco, Región de La Araucanía, Chile");
console.log("   Teléfono: +56 9 9279 1148");
console.log("==========================================");
