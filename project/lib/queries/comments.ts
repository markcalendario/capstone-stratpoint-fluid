import { comments } from "@/lib/db/drizzle/migrations/schema";
import {
  CommentSchema,
  CreateCommentData,
  UpdateCommentData
} from "@/types/comments";
import { eq } from "drizzle-orm";
import db from "../db";

const commentQueries = {
  getAll: async () => {
    return await db.select().from(comments);
  },
  getById: async (id: CommentSchema["id"]) => {
    const [comment] = await db
      .select()
      .from(comments)
      .where(eq(comments.id, id));

    return comment;
  },
  create: async (data: CreateCommentData) => {
    const [newComment] = await db
      .insert(comments)
      .values(data)
      .returning({ id: comments.id });

    return newComment.id;
  },
  update: async (id: CommentSchema["id"], data: UpdateCommentData) => {
    const [updatedComment] = await db
      .update(comments)
      .set(data)
      .where(eq(comments.id, id))
      .returning({ id: comments.id });

    return updatedComment.id;
  },
  delete: async (id: CommentSchema["id"]) => {
    const [deletedComment] = await db
      .delete(comments)
      .where(eq(comments.id, id))
      .returning({ id: comments.id });

    return deletedComment.id;
  }
};

export default commentQueries;
