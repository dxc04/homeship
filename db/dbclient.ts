import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import { sql } from "drizzle-orm";

export const client = neon(Deno.env.get("DATABASE_URL")!);
export const db = drizzle({ client });

export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}
