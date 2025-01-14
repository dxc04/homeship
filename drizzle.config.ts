import { defineConfig } from "drizzle-kit";

console.log(Deno.env.get("APP_NAME"));
export default defineConfig({
  out: "./db/migrations",
  schema: "./db/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: Deno.env.get("DATABASE_URL")!,
  },
});
