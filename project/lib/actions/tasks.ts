"use server";

import {
  CreateAndAssignTaskPayload,
  DeleteTaskPayload,
  EditTaskPayload,
  GetTaskEditDataPayload,
  GetTaskSlugPayload,
  MoveTaskPayload
} from "@/types/tasks";
import { ZodError } from "zod";
import taskAssignmentsQueries from "../queries/taskAssignments";
import taskQueries from "../queries/tasks";
import {
  formatDate,
  getDaysRemaining,
  isOverdue
} from "../utils/date-and-time";
import { upload } from "../utils/files";
import { isUserProjectOwner } from "../utils/projects";
import { getUserId } from "../utils/users";
import {
  createAndAssignTaskPayloadSchema,
  deleteTaskPayloadSchema,
  getTaskSlugSchema,
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

    let attachment: string | null = null;
    if (parsed.attachment) {
      attachment = await upload({ file: parsed.attachment });
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
      attachment
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

export async function editTask(payload: EditTaskPayload) {
  try {
    const parsed = updateTaskPayloadSchema.parse(payload);

    const editTaskPayload = {
      id: parsed.id,
      title: parsed.title,
      label: parsed.label,
      dueDate: parsed.dueDate,
      priority: parsed.priority,
      description: parsed.description,
      updatedAt: new Date().toISOString()
    };

    await taskQueries.update(editTaskPayload);

    return { success: true, message: "Task edited successfully." };
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

export async function getTaskSlug(payload: GetTaskSlugPayload) {
  try {
    const parsed = getTaskSlugSchema.parse(payload);
    const task = await taskQueries.getTask(parsed.id);

    if (!task) return { success: false, message: "Task not found." };

    const formatted = {
      title: task.title,
      priority: task.priority,
      attachment: task.attachment,
      remainingDays: getDaysRemaining(task.dueDate),
      isOverdue: isOverdue(task.dueDate),
      createdAt: formatDate(task.createdAt),
      dueDate: formatDate(task.dueDate),
      projectId: task.list.project.id,
      projectName: task.list.project.name,
      projectImageUrl: task.list.project.imageUrl,
      description: task.description,
      label: task.label,
      assigneesImages: task.taskAssignments.map(
        (assignment) => assignment.user.imageUrl
      )
    };

    return {
      success: true,
      message: "Task retrieved successfully.",
      task: formatted
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return {
      success: false,
      message: "Error. Cannot retrieve task slug data."
    };
  }
}

export async function getTaskEditData(payload: GetTaskEditDataPayload) {
  try {
    const parsed = getTaskSlugSchema.parse(payload);
    const task = await taskQueries.getTask(parsed.id);

    if (!task) return { success: false, message: "Task not found." };

    const formatted = {
      title: task.title,
      label: task.label,
      dueDate: task.dueDate,
      priority: task.priority,
      description: task.description
    };

    return {
      success: true,
      message: "Task edit data retrieved successfully.",
      task: formatted
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return {
      success: false,
      message: "Error. Cannot retrieve task edit data."
    };
  }
}
