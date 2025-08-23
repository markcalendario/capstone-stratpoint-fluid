import { tasks } from "@/lib/db/drizzle/migrations/schema";
import { ListSchema } from "@/types/lists";
import { CreateTaskData, TaskSchema, UpdateTaskData } from "@/types/tasks";
import { eq, sql } from "drizzle-orm";
import db from "../db";

const taskQueries = {
  getByList: async (listId: ListSchema["id"]) => {
    return await db.query.tasks.findMany({
      where: (tasks, { eq }) => eq(tasks.listId, listId),
      with: {
        list: { with: { project: true } },
        taskAssignments: { with: { user: true } }
      },
      orderBy: (tasks, { asc }) => [asc(tasks.position)]
    });
  },

  getTask: async (taskId: TaskSchema["id"]) => {
    return await db.query.tasks.findFirst({
      where: (tasks, { eq }) => eq(tasks.id, taskId),
      with: {
        list: { with: { project: true } },
        taskAssignments: { with: { user: true } }
      }
    });
  },

  getMaxPosition: async (listId: ListSchema["id"]) => {
    const [{ max }] = await db
      .select({ max: sql<number>`COALESCE(MAX(${tasks.position}), 0)` })
      .from(tasks)
      .where(eq(tasks.listId, listId));

    return max;
  },

  createTask: async (data: CreateTaskData) => {
    const [taskId] = await db
      .insert(tasks)
      .values(data)
      .returning({ id: tasks.id });

    return taskId.id;
  },

  update: async (data: UpdateTaskData) => {
    const [updatedTask] = await db
      .update(tasks)
      .set(data)
      .where(eq(tasks.id, data.id))
      .returning({ id: tasks.id });

    return updatedTask.id;
  },

  delete: async (id: TaskSchema["id"]) => {
    await db.delete(tasks).where(eq(tasks.id, id));
  },

  changePosition: async (
    id: TaskSchema["id"],
    listId: ListSchema["id"],
    position: TaskSchema["position"]
  ) => {
    await db.update(tasks).set({ position, listId }).where(eq(tasks.id, id));
  }
};

export default taskQueries;
