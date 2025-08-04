import { tasks } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { CommentSchema } from "./comments";
import { UserSchema } from "./users";

export interface TaskSchema extends InferSelectModel<typeof tasks> {
  comments: CommentSchema[];
}

export type CreateTaskPayload = Pick<
  TaskSchema,
  "assigneeId" | "description" | "dueDate" | "listId" | "priority" | "title"
>;

export type UpdateTaskPayload = Pick<
  TaskSchema,
  | "assigneeId"
  | "description"
  | "dueDate"
  | "listId"
  | "priority"
  | "title"
  | "updatedAt"
>;

export interface TaskCard
  extends Pick<TaskSchema, "id" | "title" | "description" | "priority"> {
  assigneeName: UserSchema["name"];
  assigneeImageUrl: UserSchema["imageUrl"];
}

export type TaskStatus = {
  name: string;
  Done: number;
  Pending: number;
};
