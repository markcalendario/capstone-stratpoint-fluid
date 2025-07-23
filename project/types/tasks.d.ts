import { tasks } from "@/lib/db/drizzle/schema";
import { InferSelectModel } from "drizzle-orm";
import { Comment } from "./comments";

export interface Task extends InferSelectModel<typeof tasks> {
  comments: Comment[];
}

export type CreateTaskPayload = Omit<
  Task,
  "comments" | "createdAt" | "updatedAt"
>;

export type UpdateTaskPayload = Omit<Task, "comments" | "createdAt">;
