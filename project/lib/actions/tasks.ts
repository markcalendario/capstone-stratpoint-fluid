"use server";

import {
  ChangePositionPayload,
  CreateAndAssignTaskPayload,
  DeleteTaskPayload,
  UpdatetaskPayload
} from "@/types/tasks";
import { ZodError } from "zod";
import taskAssignmentsQueries from "../queries/taskAssignments";
import taskQueries from "../queries/tasks";
import { isUserProjectOwner } from "../utils/projects";
import { getUserId } from "../utils/users";
import {
  changePositionPayloadSchema,
  createAndAssignTaskPayloadSchema,
  deleteTaskPayloadSchema,
  updateTaskPayloadSchema
} from "../validations/tasks";

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

    const position = (await taskQueries.getMaxPosition(parsed.listId)) + 1;

    const createTaskData = {
      title: parsed.title,
      description: parsed.description,
      dueDate: parsed.dueDate,
      listId: parsed.listId,
      priority: parsed.priority,
      createdBy: userId,
      label: parsed.label,
      position,
      attachment: ""
    };

    const taskId = await taskQueries.createTask(createTaskData);

    if (parsed.assignees.length) {
      const assignmentData = { taskId, userIds: parsed.assignees };
      await taskAssignmentsQueries.assignMany(assignmentData);
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
      await taskAssignmentsQueries.assignMany(assignmentData);
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

export async function changeTaskPosition(payload: ChangePositionPayload) {
  try {
    const parsed = changePositionPayloadSchema.parse(payload);
    const { taskId, overTaskId } = parsed;

    const task = await taskQueries.getTask(taskId);
    if (!task) {
      return { success: false, message: "Cannot find the task data." };
    }

    const overTask = await taskQueries.getTask(overTaskId);
    if (!overTask) {
      return { success: false, message: "Cannot find the task being hovered." };
    }

    const overListId = overTask.listId;
    const overListTasks = await taskQueries.getListTasks(overListId);

    // Remove the dragged task from the list
    const filteredTasks = overListTasks.filter((t) => t.id !== taskId);

    // Find the index of the hovered task
    const newPosition = filteredTasks.findIndex((t) => t.id === overTaskId);

    // Insert the task at the new position
    filteredTasks.splice(newPosition, 0, task);

    // Reorder all tasks
    for (let pos = 0; pos < filteredTasks.length; pos++) {
      await taskQueries.changePosition(
        filteredTasks[pos].id,
        overListId,
        pos + 1
      );
    }

    return { success: true, message: "Task moved successfully." };
  } catch {
    return { success: false, message: "Error. Cannot change position." };
  }
}
