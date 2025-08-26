import { taskDiscussions } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { Task } from "./tasks";

export interface TaskDiscussionsSchema
  extends InferSelectModel<typeof taskDiscussions> {
  task: Task;
  user: User;
}

export type TaskDiscussions = InferSelectModel<typeof taskDiscussions>;

// Queries

export interface CreateTaskDiscussionsData
  extends Pick<TaskDiscussionsSchema, "content" | "taskId" | "authorId"> {}

export interface UpdateTaskDiscussionsData
  extends Pick<TaskDiscussionsSchema, "content" | "taskId" | "updatedAt"> {}

// Payloads

export interface GetTaskDiscussionsPayload
  extends Pick<TaskDiscussionsSchema, "taskId"> {}

export interface CreateTaskDiscussionPayload
  extends Pick<TaskDiscussionsSchema, "content" | "taskId"> {}

export interface UpdateTaskDiscussionPayload
  extends Pick<TaskDiscussionsSchema, "id" | "content" | "taskId"> {}

export interface DeleteTaskDiscussionPayload
  extends Pick<TaskDiscussionsSchema, "id"> {}
