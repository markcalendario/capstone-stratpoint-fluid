import { taskDiscussions } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { Task } from "./tasks";

export interface TaskDiscussionSchema
  extends InferSelectModel<typeof taskDiscussions> {
  task: Task;
  user: User;
}

export type TaskDiscussion = InferSelectModel<typeof taskDiscussions>;

// Queries

export interface CreateTaskDiscussionsData
  extends Pick<TaskDiscussionSchema, "content" | "taskId" | "authorId"> {}

export interface UpdateTaskDiscussionsData
  extends Pick<TaskDiscussionSchema, "content" | "updatedAt"> {}

// Payloads

export interface GetTaskDiscussionsPayload
  extends Pick<TaskDiscussionSchema, "taskId"> {}

export interface CreateTaskDiscussionPayload
  extends Pick<TaskDiscussionSchema, "content" | "taskId"> {}

export interface UpdateTaskDiscussionPayload
  extends Pick<TaskDiscussionSchema, "id" | "content"> {}

export interface DeleteTaskDiscussionPayload
  extends Pick<TaskDiscussionSchema, "id"> {}
