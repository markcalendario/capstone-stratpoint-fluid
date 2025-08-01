import { comments } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";

export type Comment = InferSelectModel<typeof comments>;

export type CreateCommentPayload = Omit<
  Comment,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateCommentPayload = Omit<Comment, "id" | "createdAt">;
