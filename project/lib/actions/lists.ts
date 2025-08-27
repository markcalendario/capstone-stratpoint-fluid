"use server";

import listQueries from "@/lib/queries/lists";
import { getUserId } from "@/lib/utils/users";
import {
  createListPayloadSchema,
  deleteListPayloadSchema,
  getProjectListsPayloadSchema,
  listSchema,
  updateListPayloadSchema
} from "@/lib/validations/lists";
import { KanbanList } from "@/types/kanban";
import {
  CreateListPayload,
  DeleteListPayload,
  GetListPayload,
  GetProjectListsPayload,
  MoveListPayload,
  UpdateListPayload
} from "@/types/lists";
import { ZodError } from "zod";
import { getDaysRemaining, isOverdue } from "../utils/date-and-time";
import { stripHTML } from "../utils/formatters";
import { hasPermission } from "../utils/rolePermissions";

export async function createList(payload: CreateListPayload) {
  try {
    // Validate parameters
    const userId = await getUserId();
    const parsed = createListPayloadSchema.parse(payload);

    if (!(await hasPermission(userId, parsed.projectId, "create_list"))) {
      return { success: false, message: "Unauthorized. Cannot create list." };
    }

    const position = await listQueries.getMaxPosition(parsed.projectId);

    const data = {
      name: parsed.name,
      createdBy: userId,
      isFinal: parsed.isFinal,
      projectId: parsed.projectId,
      position: position + 1
    };

    // Create list
    await listQueries.create(data);

    return { success: true, message: "List created successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot create list." };
  }
}

export async function getListsWithTasks(payload: GetProjectListsPayload) {
  try {
    const userId = await getUserId();
    const parsed = getProjectListsPayloadSchema.parse(payload);

    if (!(await hasPermission(userId, parsed.projectId, "view_list"))) {
      return { success: false, message: "Unauthorized. Cannot view list." };
    }

    const listsAndTasks = await listQueries.getListsWithTasks(parsed.projectId);

    const formatted = listsAndTasks.map((list) => {
      return {
        id: list.id,
        name: list.name,
        isFinal: list.isFinal,
        projectId: list.projectId,
        tasksCount: list.tasks.length,
        tasks: list.tasks.map((task) => {
          return {
            id: task.id,
            title: task.title,
            label: task.label,
            listId: task.listId,
            isDone: list.isFinal,
            priority: task.priority,
            projectId: list.projectId,
            isOverdue: isOverdue(task.dueDate),
            description: stripHTML(task.description),
            remainingDays: getDaysRemaining(task.dueDate),
            assigneesImages: task.taskAssignments.map(
              (assignment) => assignment.user.imageUrl
            )
          };
        })
      };
    }) satisfies KanbanList[];

    return {
      success: true,
      message: "Success getting lists with tasks.",
      listsAndTasks: formatted
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot get lists with tasks." };
  }
}

export async function updateList(payload: UpdateListPayload) {
  try {
    // Validate payload
    const userId = await getUserId();
    const parsed = updateListPayloadSchema.parse(payload);
    const list = await listQueries.get(parsed.id);

    if (!(await hasPermission(userId, list.projectId, "edit_list"))) {
      return { success: false, message: "Unauthorized. Cannot edit list." };
    }

    const data = {
      name: parsed.name,
      isFinal: parsed.isFinal,
      updatedAt: new Date().toISOString()
    };

    // Update data
    await listQueries.update(parsed.id, data);

    return { success: true, message: "List updated successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot update list." };
  }
}

export async function getListEditData(payload: GetListPayload) {
  try {
    const userId = await getUserId();
    const validId = listSchema.shape.id.parse(payload.id);
    const list = await listQueries.get(validId);

    if (!(await hasPermission(userId, list.projectId, "edit_list"))) {
      return { success: false, message: "Unauthorized. Cannot view list." };
    }

    return { success: true, message: "List fetched successfully.", list };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message, list: null };
    }

    return { success: false, message: "Error. Cannot get list.", list: null };
  }
}

export async function deleteList(payload: DeleteListPayload) {
  try {
    const userId = await getUserId();
    const parsed = deleteListPayloadSchema.parse(payload);
    const list = await listQueries.get(parsed.id);

    if (!(await hasPermission(userId, list.projectId, "delete_list"))) {
      return { success: false, message: "Unauthorized. Cannot delete list." };
    }

    await listQueries.delete(parsed.id);

    return { success: true, message: "List deleted successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot delete list." };
  }
}

export async function moveList(payload: MoveListPayload) {
  const userId = await getUserId();
  const { listId, newPosition, projectId } = payload;

  if (!(await hasPermission(userId, projectId, "edit_list"))) {
    return { success: false, message: "Unauthorized. Cannot delete list." };
  }

  // Get list IDs of the project
  const lists = await listQueries.getListsWithTasks(projectId);
  const listIds = lists.map((list) => list.id);

  // Filter out the list being moved
  const filteredListIds = listIds.filter((id) => id !== listId);

  // Calculate a safe new position
  const safeNewPosition = Math.max(
    0,
    Math.min(newPosition, filteredListIds.length)
  );

  // Insert the listId into the new position
  filteredListIds.splice(safeNewPosition, 0, listId);

  // Update positions for all lists
  for (let i = 0; i < filteredListIds.length; i++) {
    await listQueries.changePosition(filteredListIds[i], i + 1);
  }
}
