import { AssignManyData } from "@/types/taskAssignments";
import db from "../db";
import { taskAssignments } from "../db/drizzle/migrations/schema";

const taskAssignmentsQueries = {
  assignMany: async (data: AssignManyData) => {
    const { taskId, userIds } = data;

    await db
      .insert(taskAssignments)
      .values(userIds.map((userId) => ({ taskId, userId })));
  }
};

export default taskAssignmentsQueries;
