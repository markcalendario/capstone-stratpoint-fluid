"use server";

import listQueries from "@/lib/queries/lists";
import { getUserId } from "@/lib/utils/users";
import {
  createListPayloadSchema,
  deleteListPayloadSchema,
  getProjectListsPayloadSchema,
  listSchema,
  moveListPayloadSchema,
  updateListPayloadSchema
} from "@/lib/validations/lists";
import {
  CreateListPayload,
  DeleteListPayload,
  GetListPayload,
  GetProjectListsPayload,
  MoveListPayload,
  UpdateListPayload
} from "@/types/lists";
import { ZodError } from "zod";
import { dispatchError, handleDispatchError } from "../utils/dispatch-error";
import { broadcastKanbanUpdate, getKanbanItems } from "../utils/kanban";
import { PERMISSION } from "../utils/permission-enum";
import { hasPermission } from "../utils/rolePermissions";

export async function createList(payload: CreateListPayload) {
  try {
    // Validate parameters
    const userId = await getUserId();
    const parsed = createListPayloadSchema.parse(payload);

    const isPermitted = await hasPermission(
      userId,
      parsed.projectId,
      PERMISSION.CREATE_LIST
    );

    if (!isPermitted) return dispatchError(401);

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

    await broadcastKanbanUpdate(parsed.projectId);

    return { success: true, message: "List created successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    handleDispatchError(error);
  }
}

export async function getListsWithTasks(payload: GetProjectListsPayload) {
  try {
    const userId = await getUserId();
    const parsed = getProjectListsPayloadSchema.parse(payload);

    const isPermitted = await hasPermission(
      userId,
      parsed.projectId,
      PERMISSION.VIEW_LIST
    );

    if (!isPermitted) return dispatchError(401);

    const listsAndTasks = await getKanbanItems(parsed.projectId);

    return {
      success: true,
      message: "Success getting lists with tasks.",
      listsAndTasks
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    handleDispatchError(error);
  }
}

export async function updateList(payload: UpdateListPayload) {
  try {
    // Validate payload
    const userId = await getUserId();
    const parsed = updateListPayloadSchema.parse(payload);
    const list = await listQueries.get(parsed.id);

    const isPermitted = await hasPermission(
      userId,
      list.projectId,
      PERMISSION.EDIT_LIST
    );

    if (!isPermitted) return dispatchError(401);

    const data = {
      name: parsed.name,
      isFinal: parsed.isFinal,
      updatedAt: new Date().toISOString()
    };

    // Update data
    await listQueries.update(parsed.id, data);

    await broadcastKanbanUpdate(list.projectId);

    return { success: true, message: "List updated successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    handleDispatchError(error);
  }
}

export async function getListEditData(payload: GetListPayload) {
  try {
    const userId = await getUserId();
    const validId = listSchema.shape.id.parse(payload.id);
    const list = await listQueries.get(validId);

    const isPermitted = await hasPermission(
      userId,
      list.projectId,
      PERMISSION.EDIT_LIST
    );

    if (!isPermitted) return dispatchError(401);

    await broadcastKanbanUpdate(list.projectId);

    return { success: true, message: "List fetched successfully.", list };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    handleDispatchError(error);
  }
}

export async function deleteList(payload: DeleteListPayload) {
  try {
    const userId = await getUserId();
    const parsed = deleteListPayloadSchema.parse(payload);
    const list = await listQueries.get(parsed.id);

    const isPermitted = await hasPermission(
      userId,
      list.projectId,
      PERMISSION.DELETE_LIST
    );

    if (!isPermitted) return dispatchError(404);

    await listQueries.delete(parsed.id);

    await broadcastKanbanUpdate(list.projectId);

    return { success: true, message: "List deleted successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    handleDispatchError(error);
  }
}

export async function moveList(payload: MoveListPayload) {
  try {
    const userId = await getUserId();
    const parsed = moveListPayloadSchema.parse(payload);
    const { listId, newPosition, projectId } = parsed;

    const isPermitted = await hasPermission(
      userId,
      projectId,
      PERMISSION.EDIT_LIST
    );

    if (!isPermitted) return dispatchError(401);

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

    await broadcastKanbanUpdate(projectId);

    return { success: true, message: "Kanban list moved successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    handleDispatchError(error);
  }
}
