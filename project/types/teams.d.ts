import { team } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { ProjectSchema } from "./projects";
import { UserSchema } from "./users";

interface TeamsSchema extends InferSelectModel<typeof team> {
  project: ProjectSchema;
  user: UserSchema;
}

interface Team extends InferSelectModel<typeof team> {}
