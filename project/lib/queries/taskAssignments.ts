import { AssignManyData } from "@/types/taskAssignments";
import { TaskSchema } from "@/types/tasks";
import { eq } from "drizzle-orm";
import db from "../db";
import { taskAssignments } from "../db/drizzle/migrations/schema";

const taskAssignmentsQueries = {
  assignMany: async (data: AssignManyData) => {
    const { taskId, userIds } = data;

    await db
      .insert(taskAssignments)
      .values(userIds.map((userId) => ({ taskId, userId })));
  },

  unassignAllByTask: async (taskId: TaskSchema["id"]) => {
    const deleted = await db
      .delete(taskAssignments)
      .where(eq(taskAssignments.taskId, taskId));
  }
};

export default taskAssignmentsQueries;
