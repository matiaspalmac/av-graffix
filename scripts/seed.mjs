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

const client = createClient({
  url: tursoUrl,
  authToken: tursoToken,
});

const now = new Date().toISOString();
const passwordHash = await hash(adminPassword, 10);

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
  args: [roleId, adminName, adminEmail, passwordHash, now, now],
});

console.log("✅ Seed completado");
console.log(`Admin: ${adminEmail}`);
console.log(`Password: ${adminPassword}`);
