import { tasks } from "@/lib/db/drizzle/migrations/schema";
import { ListSchema } from "@/types/lists";
import {
  CreateAndAssignTaskData,
  TaskSchema,
  UpdateTaskData
} from "@/types/tasks";
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

  getWithAssigneesByListId: async (listId: ListSchema["id"]) => {
    const tasks = await db.query.tasks.findMany({
      where: (tasks, { eq }) => eq(tasks.listId, listId),
      with: { taskAssignments: { with: { user: true } } }
    });
    return tasks;
  },

  create: async (data: CreateAndAssignTaskData) => {
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
    const [deletedComment] = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning({ id: tasks.id });

    return deletedComment.id;
  }
};

export default taskQueries;
