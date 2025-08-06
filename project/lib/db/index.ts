import * as relations from "@/lib/db/drizzle/migrations/relations";
import * as schema from "@/lib/db/drizzle/migrations/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql, schema: { ...schema, ...relations } });
export default db;
