import { taskAssignments } from "@/lib/db/drizzle/migrations/schema";
import { User } from "./users";

export interface TaskAssignmentsSchema
  extends InferSelectModel<typeof taskAssignments> {
  user: User;
}
