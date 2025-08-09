"use server";

import { ListSchema } from "@/types/lists";
import { ProjectSchema } from "@/types/projects";
import { Task } from "@/types/tasks";
import { UserSchema } from "@/types/users";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import taskAssignmentsQueries from "../db/queries/taskAssignments";
import taskQueries from "../db/queries/tasks";
import { isUserProjectOwner } from "../utils/projects";
import { toTaskCard } from "../utils/tasks";
import { getUserId } from "../utils/users";
import {
  createTaskPayloadSchema,
  getTasksByListIdPayloadSchema
} from "../validations/tasks";

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

interface CreateTaskPayload
  extends Pick<Task, "listId" | "title" | "description" | "dueDate" | "label"> {
  attachment: File | null;
  priority: string;
  projectId: ProjectSchema["id"];
  assignees: UserSchema["id"][];
}

export async function createAndAssignTask(payload: CreateTaskPayload) {
  try {
    const parsed = createTaskPayloadSchema.parse(payload);
    const userId = await getUserId();

    if (!(await isUserProjectOwner(userId, parsed.projectId))) {
      return {
        success: false,
        message: "You are not authorized to create task."
      };
    }

    const createTaskData = {
      title: parsed.title,
      description: parsed.description,
      dueDate: parsed.dueDate,
      listId: parsed.listId,
      priority: parsed.priority,
      createdBy: userId,
      attachment: "",
      label: parsed.label
    };

    const taskId = await taskQueries.create(createTaskData);

    const assignmentData = { taskId, userIds: parsed.assignees };

    await taskAssignmentsQueries.createMany(assignmentData);

    revalidatePath("/(dashboard)");

    return { success: true, message: "Task created successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    console.log(error);

    return {
      success: false,
      message: "Error. Cannot create task."
    };
  }
}
