import { team } from "@/lib/db/drizzle/migrations/schema";
import { ProjectSchema } from "./projects";
import { UserSchema } from "./users";

interface TeamsSchema extends InferSelectModel<typeof team> {
  project: ProjectSchema;
  user: UserSchema;
}
