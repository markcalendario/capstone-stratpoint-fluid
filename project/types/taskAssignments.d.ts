import { taskAssignments } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { User, UserSchema } from "./users";

export interface TaskAssignmentsSchema
  extends InferSelectModel<typeof taskAssignments> {
  user: User;
}

export interface TaskAssignments
  extends InferSelectModel<typeof taskAssignments> {}

export interface AssignManyData extends Pick<TaskAssignmentsSchema, "taskId"> {
  userIds: UserSchema["id"][];
}
