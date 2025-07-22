import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./lib/db/drizzle/migrations/drizzle",
  schema: "./lib/db/drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
});
