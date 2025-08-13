import { teamRoles } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";

export interface TeamRolesSchema extends InferSelectModel<typeof teamRoles> {}

export interface TeamRoles extends InferSelectModel<typeof teamRoles> {}
