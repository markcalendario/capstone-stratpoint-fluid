import { ListSchema } from "@/types/lists";
import { ZodError } from "zod";
import taskQueries from "../db/queries/tasks";
import { getTasksByListIdPayloadSchema } from "../validations/tasks";

interface GetTasksByListId {
  listId: ListSchema["id"];
}

export const getTasksByListId = (payload: GetTasksByListId) => {
  try {
    const parsed = getTasksByListIdPayloadSchema.parse(payload);
    const tasks = taskQueries.getByListId(parsed.listId);
    return { success: true, message: "Tasks retrieved successfully.", tasks };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot get tasks by list." };
  }
};
