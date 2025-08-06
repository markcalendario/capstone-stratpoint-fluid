import { comments } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";

export type CommentSchema = InferSelectModel<typeof comments>;

export type CreateCommentData = Pick<
  CommentSchema,
  "content" | "taskId" | "authorId"
>;

export type UpdateCommentData = Pick<
  CommentSchema,
  "content" | "taskId" | "authorId" | "updatedAt"
>;
