import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import postgres from "npm:postgres";
import * as schema from "./schema/all_schema.ts";

export const client = postgres(Deno.env.get("DATABASE_URL")!);
export const db = drizzle({ client, schema });

export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}
