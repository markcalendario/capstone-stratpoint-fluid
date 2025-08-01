import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./lib/db/drizzle/migrations",
  schema: "./lib/db/drizzle/migrations/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
});
