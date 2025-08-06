import { tasks } from "@/lib/db/drizzle/migrations/schema";
import { CreateTaskData, TaskSchema, UpdateTaskData } from "@/types/tasks";
import { eq } from "drizzle-orm";
import db from "..";

const taskQueries = {
  getAll: async () => {
    return await db.select().from(tasks);
  },
  getById: async (id: TaskSchema["id"]) => {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  },
  create: async (data: CreateTaskData) => {
    const [newTask] = await db
      .insert(tasks)
      .values(data)
      .returning({ id: tasks.id });

    return newTask.id;
  },
  update: async (id: TaskSchema["id"], data: UpdateTaskData) => {
    const [updatedTask] = await db
      .update(tasks)
      .set(data)
      .where(eq(tasks.id, id))
      .returning({ id: tasks.id });

    return updatedTask.id;
  },
  delete: async (id: TaskSchema["id"]) => {
    const [deletedComment] = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning({ id: tasks.id });

    return deletedComment.id;
  }
};

export default taskQueries;
