import { CreateTaskAssignmentSchema } from "@/types/taskAssignments";
import db from "..";
import { taskAssignments } from "../drizzle/migrations/schema";

const taskAssignmentsQueries = {
  createMany: async (data: CreateTaskAssignmentSchema) => {
    const { taskId, userIds } = data;

    await db
      .insert(taskAssignments)
      .values(userIds.map((userId) => ({ taskId, userId })));
  }
};

export default taskAssignmentsQueries;
