import { taskDiscussions } from "@/lib/db/drizzle/migrations/schema";
import {
  CreateTaskDiscussionsData,
  TaskDiscussionsSchema,
  UpdateTaskDiscussionsData
} from "@/types/taskDiscussions";
import { eq } from "drizzle-orm";
import db from "../db";

const taskDiscussionsQueries = {
  getAll: async () => {
    return await db.select().from(taskDiscussions);
  },

  get: async (id: TaskDiscussionsSchema["id"]) => {
    const [comment] = await db
      .select()
      .from(taskDiscussions)
      .where(eq(taskDiscussions.id, id));

    return comment;
  },

  create: async (data: CreateTaskDiscussionsData) => {
    const [newComment] = await db
      .insert(taskDiscussions)
      .values(data)
      .returning({ id: taskDiscussions.id });

    return newComment.id;
  },

  update: async (
    id: TaskDiscussionsSchema["id"],
    data: UpdateTaskDiscussionsData
  ) => {
    const [updatedComment] = await db
      .update(taskDiscussions)
      .set(data)
      .where(eq(taskDiscussions.id, id))
      .returning({ id: taskDiscussions.id });

    return updatedComment.id;
  },

  delete: async (id: TaskDiscussionsSchema["id"]) => {
    const [deletedComment] = await db
      .delete(taskDiscussions)
      .where(eq(taskDiscussions.id, id))
      .returning({ id: taskDiscussions.id });

    return deletedComment.id;
  }
};

export default taskDiscussionsQueries;
