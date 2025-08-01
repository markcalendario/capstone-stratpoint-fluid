import { tasks } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { Comment } from "./comments";
import { UserSchema } from "./users";

export interface Task extends InferSelectModel<typeof tasks> {
  comments: Comment[];
}

export type CreateTaskPayload = Omit<
  Task,
  "id" | "comments" | "createdAt" | "updatedAt"
>;

export type UpdateTaskPayload = Omit<Task, "id" | "comments" | "createdAt">;

export interface TaskCard
  extends Pick<Task, "id" | "title" | "description" | "priority"> {
  assigneeName: UserSchema["name"];
  assigneeImageUrl: UserSchema["imageUrl"];
}

export type TaskStatus = {
  name: string;
  Done: number;
  Pending: number;
};
