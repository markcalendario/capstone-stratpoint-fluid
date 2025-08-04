import { team } from "@/lib/db/drizzle/migrations/schema";

interface Teams extends InferSelectModel<typeof team> {}
