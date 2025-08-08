import { ListSchema } from "@/types/lists";
import { ZodError } from "zod";
import taskQueries from "../db/queries/tasks";
import { toTaskCard } from "../utils/tasks";
import { getTasksByListIdPayloadSchema } from "../validations/tasks";

interface GetTasksByListId {
  listId: ListSchema["id"];
}

export const getTasksByListId = async (payload: GetTasksByListId) => {
  try {
    const parsed = getTasksByListIdPayloadSchema.parse(payload);
    const tasks = await taskQueries.getWithAssigneesByListId(parsed.listId);
    const formattedTasks = [];

    for (const task of tasks) {
      const formattedTask = await toTaskCard(task);
      formattedTasks.push(formattedTask);
    }

    return {
      success: true,
      message: "Tasks retrieved successfully.",
      tasks: formattedTasks
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot get tasks by list." };
  }
};
