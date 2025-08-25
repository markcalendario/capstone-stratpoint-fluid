import { comments } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { Task } from "./tasks";

export interface TaskDiscussionsSchema
  extends InferSelectModel<typeof comments> {
  task: Task;
  user: User;
}

export type TaskDiscussions = InferSelectModel<typeof comments>;

export type CreateTaskDiscussionsData = Pick<
  TaskDiscussionsSchema,
  "content" | "taskId" | "authorId"
>;

export type UpdateTaskDiscussionsData = Pick<
  TaskDiscussionsSchema,
  "content" | "taskId" | "authorId" | "updatedAt"
>;
