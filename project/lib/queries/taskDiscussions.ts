import { taskDiscussions } from "@/lib/db/drizzle/migrations/schema";
import {
  CreateTaskDiscussionsData,
  TaskDiscussionsSchema,
  UpdateTaskDiscussionsData
} from "@/types/taskDiscussions";
import { TaskSchema } from "@/types/tasks";
import { eq } from "drizzle-orm";
import db from "../db";

const taskDiscussionsQueries = {
  get: async (id: TaskDiscussionsSchema["id"]) => {
    return await db.query.taskDiscussions.findFirst({
      with: { task: { with: { list: true } }, user: true },
      where: (taskDiscussion, { eq }) => eq(taskDiscussion.id, id)
    });
  },

  getByTask: async (taskId: TaskSchema["id"]) => {
    return await db.query.taskDiscussions.findMany({
      with: { task: true, user: true },
      where: (taskDiscussion, { eq }) => eq(taskDiscussion.taskId, taskId),
      orderBy: (taskDiscussion, { asc }) => asc(taskDiscussion.createdAt)
    });
  },

  create: async (data: CreateTaskDiscussionsData) => {
    await db.insert(taskDiscussions).values(data);
  },

  update: async (
    id: TaskDiscussionsSchema["id"],
    data: UpdateTaskDiscussionsData
  ) => {
    await db
      .update(taskDiscussions)
      .set(data)
      .where(eq(taskDiscussions.id, id));
  },

  delete: async (id: TaskDiscussionsSchema["id"]) => {
    await db.delete(taskDiscussions).where(eq(taskDiscussions.id, id));
  }
};

export default taskDiscussionsQueries;
