"use server";

import {
  CreateAndAssignTaskPayload,
  DeleteTaskPayload,
  MoveTaskPayload,
  UpdatetaskPayload
} from "@/types/tasks";
import { ZodError } from "zod";
import taskAssignmentsQueries from "../queries/taskAssignments";
import taskQueries from "../queries/tasks";
import { isUserProjectOwner } from "../utils/projects";
import { getUserId } from "../utils/users";
import {
  createAndAssignTaskPayloadSchema,
  deleteTaskPayloadSchema,
  moveTaskPayloadSchema,
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

export async function moveTask(payload: MoveTaskPayload) {
  try {
    const parsed = moveTaskPayloadSchema.parse(payload);
    const { taskId, newListId, newPosition } = parsed;

    // Get tasks in the new list (in order)
    const tasks = await taskQueries.getByList(newListId);
    const taskIds = tasks.map((task) => task.id);

    // Remove the task ID if it already exists in the list (prevent duplicates)
    const filteredTaskIds = taskIds.filter((id) => id !== taskId);

    // Clamp new position within bounds
    const safeNewPosition = Math.max(
      0,
      Math.min(newPosition, filteredTaskIds.length)
    );

    // Insert the task at the new position
    const updatedTaskIds = filteredTaskIds.toSpliced(
      safeNewPosition,
      0,
      taskId
    );

    for (let i = 0; i < updatedTaskIds.length; i++) {
      const id = updatedTaskIds[i];
      const position = i + 1;

      // Only update if the task actually needs to change
      const originalTask = tasks.find((task) => task.id === id);
      const needsListChange = originalTask?.listId !== newListId;
      const needsPositionChange = originalTask?.position !== position;

      if (needsListChange || needsPositionChange) {
        await taskQueries.changePosition(id, newListId, position);
      }
    }

    return { success: true, message: "Task moved successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot move task." };
  }
}
