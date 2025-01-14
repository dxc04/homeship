import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./db/migrations",
  schema: "./db/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: 'postgresql://dixie:ellie@localhost:5432/neighborly' //Deno.env.get("DATABASE_URL")!,
  },
});
