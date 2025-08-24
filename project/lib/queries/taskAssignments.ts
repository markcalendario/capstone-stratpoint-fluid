import { AssignManyData } from "@/types/taskAssignments";
import { TaskSchema } from "@/types/tasks";
import { eq } from "drizzle-orm";
import db from "../db";
import { taskAssignments } from "../db/drizzle/migrations/schema";

const taskAssignmentsQueries = {
  getByTask: async (taskId: TaskSchema["id"]) => {
    return await db
      .select()
      .from(taskAssignments)
      .where(eq(taskAssignments.taskId, taskId));
  },

  assignMany: async (data: AssignManyData) => {
    const { taskId, userIds } = data;

    await db
      .insert(taskAssignments)
      .values(userIds.map((userId) => ({ taskId, userId })));
  },

  unassignAllByTask: async (taskId: TaskSchema["id"]) => {
    await db.delete(taskAssignments).where(eq(taskAssignments.taskId, taskId));
  }
};

export default taskAssignmentsQueries;
