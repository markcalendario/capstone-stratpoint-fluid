"use server";

import {
  CreateAndAssignTaskPayload,
  DeleteTaskPayload,
  GetListTasksPayload,
  UpdatetaskPayload
} from "@/types/tasks";
import { ZodError } from "zod";
import taskAssignmentsQueries from "../queries/taskAssignments";
import taskQueries from "../queries/tasks";
import { isUserProjectOwner } from "../utils/projects";
import { toTaskCard } from "../utils/tasks";
import { getUserId } from "../utils/users";
import {
  createAndAssignTaskPayloadSchema,
  deleteTaskPayloadSchema,
  getListTasksPayloadSchema,
  updateTaskPayloadSchema
} from "../validations/tasks";

export async function getListTasks(payload: GetListTasksPayload) {
  try {
    const parsed = getListTasksPayloadSchema.parse(payload);
    const tasks = await taskQueries.getListTasks(parsed.listId);
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
      return { success: false, message: error.issues[0].message, tasks: [] };
    }

    return {
      success: false,
      message: "Error. Cannot get tasks by list.",
      tasks: []
    };
  }
}

export async function createAndAssignTask(payload: CreateAndAssignTaskPayload) {
  try {
    const parsed = createAndAssignTaskPayloadSchema.parse(payload);
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

    const taskId = await taskQueries.createAndAssignTask(createTaskData);

    if (parsed.assignees.length) {
      const assignmentData = { taskId, userIds: parsed.assignees };
      await taskAssignmentsQueries.createMany(assignmentData);
    }

    return { success: true, message: "Task created successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return {
      success: false,
      message: "Error. Cannot create task."
    };
  }
}

export async function deleteTask(payload: DeleteTaskPayload) {
  try {
    const userId = await getUserId();
    const parsed = deleteTaskPayloadSchema.parse(payload);

    if (!(await isUserProjectOwner(userId, parsed.projectId))) {
      return { success: false, message: "You're not the project owner." };
    }

    await taskQueries.delete(parsed.id);

    return { success: true, message: "Task deleted successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot delete task." };
  }
}

export async function updateTask(payload: UpdatetaskPayload) {
  try {
    const parsed = updateTaskPayloadSchema.parse(payload);
    const userId = await getUserId();

    if (!(await isUserProjectOwner(userId, parsed.projectId))) {
      return {
        success: false,
        message: "You are not authorized to create task."
      };
    }

    const editTaskPayload = {
      id: parsed.id,
      title: parsed.title,
      description: parsed.description,
      dueDate: parsed.dueDate,
      listId: parsed.listId,
      priority: parsed.priority,
      createdBy: userId,
      attachment: "",
      updatedAt: new Date().toISOString(),
      label: parsed.label
    };

    const taskId = await taskQueries.update(editTaskPayload);

    if (parsed.assignees.length) {
      const assignmentData = { taskId, userIds: parsed.assignees };
      await taskAssignmentsQueries.createMany(assignmentData);
    }

    return { success: true, message: "Task created successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return {
      success: false,
      message: "Error. Cannot create task."
    };
  }
}
