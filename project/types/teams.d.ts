import { team } from "@/lib/db/drizzle/migrations/schema";

interface TeamsSchema extends InferSelectModel<typeof team> {}
