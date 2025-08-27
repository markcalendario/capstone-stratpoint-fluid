import { taskAssignments } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { User, UserSchema } from "./users";

export interface TaskAssignmentSchema
  extends InferSelectModel<typeof taskAssignments> {
  user: User;
}

export interface TaskAssignment
  extends InferSelectModel<typeof taskAssignments> {}

export interface AssignManyData extends Pick<TaskAssignmentSchema, "taskId"> {
  userIds: UserSchema["id"][];
}

export interface GetTaskAssignmentsPayload {
  taskId: TaskSchema["id"];
}

export interface UpdateTaskAssignmentsPayload {
  taskId: TaskSchema["id"];
  userIds: UserSchema["id"][];
}
