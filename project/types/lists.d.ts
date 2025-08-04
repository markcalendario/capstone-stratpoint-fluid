import { lists } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { CommentSchema } from "./comments";
import { TaskSchema } from "./tasks";

export interface ListSchema extends InferSelectModel<typeof lists> {
  tasks: TaskSchema[];
  comments: CommentSchema[];
}

export type CreateListPayload = Pick<
  ListSchema,
  "name" | "position" | "isFinal" | "projectId"
>;

export type UpdateListPayload = Pick<
  ListSchema,
  "name" | "position" | "isFinal" | "projectId" | "updatedAt"
>;
