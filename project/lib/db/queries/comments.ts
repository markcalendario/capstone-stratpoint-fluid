import { comments } from "@/lib/db/drizzle/schema";
import {
  Comment,
  CreateCommentPayload,
  UpdateCommentPayload
} from "@/types/comments";
import { Project } from "@/types/projects";
import { eq } from "drizzle-orm";
import db from "..";

const commentsQueries = {
  getAll: async () => {
    return await db.select().from(comments);
  },
  getById: async (id: Comment["id"]) => {
    const comment = await db.select().from(comments).where(eq(comments.id, id));
    return comment[0];
  },
  create: async (data: CreateCommentPayload) => {
    const [newComment] = await db
      .insert(comments)
      .values(data)
      .returning({ id: comments.id });

    return newComment.id;
  },
  update: async (data: UpdateCommentPayload) => {
    const [updatedComment] = await db
      .update(comments)
      .set(data)
      .returning({ id: comments.id });

    return updatedComment.id;
  },
  delete: async (id: Project["id"]) => {
    const [deletedComment] = await db
      .delete(comments)
      .where(eq(comments.id, id))
      .returning({ id: comments.id });

    return deletedComment.id;
  }
};

export default commentsQueries;
