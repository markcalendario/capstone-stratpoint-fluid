import { tasks } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { CommentSchema } from "./comments";
import { UserSchema } from "./users";

export interface TaskSchema extends InferSelectModel<typeof tasks> {
  comments: CommentSchema[];
  taskAssignments: UserSchema[];
}

export interface Task extends InferSelectModel<typeof tasks> {}

export type CreateTaskData = Pick<
  TaskSchema,
  "description" | "dueDate" | "listId" | "priority" | "title"
>;

export type UpdateTaskData = Pick<
  TaskSchema,
  "dueDate" | "listId" | "priority" | "title" | "updatedAt"
>;

export interface TaskCard
  extends Pick<
    TaskSchema,
    "id" | "title" | "description" | "priority" | "dueDate"
  > {
  assigneesImages: UserSchema["imageUrl"][];
}

export type TaskStatus = {
  name: string;
  Done: number;
  Pending: number;
};
