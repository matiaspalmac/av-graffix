import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "@/db/schema";

const tursoUrl = process.env.TURSO_URL;
const tursoToken = process.env.TURSO_TOKEN;

if (!tursoUrl) {
  throw new Error("Missing TURSO_URL in environment variables");
}

if (!tursoToken) {
  throw new Error("Missing TURSO_TOKEN in environment variables");
}

const client = createClient({
  url: tursoUrl,
  authToken: tursoToken,
});

export const db = drizzle(client, { schema });
