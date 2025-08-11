"use server";

import listQueries from "@/lib/queries/lists";
import { isUserListCreator } from "@/lib/utils/lists";
import { isUserProjectOwner } from "@/lib/utils/projects";
import { getUserId } from "@/lib/utils/users";
import {
  createListPayloadSchema,
  deleteListPayloadSchema,
  getProjectListsPayloadSchema,
  listSchema,
  updateListPayloadSchema
} from "@/lib/validations/lists";
import {
  GetListPayload,
  GetProjectListsPayload,
  ListSchema,
  UpdateListPayload
} from "@/types/lists";
import { ZodError } from "zod";

interface CreateListPayload
  extends Pick<ListSchema, "name" | "isFinal" | "projectId"> {}

export async function createList(payload: CreateListPayload) {
  try {
    // Validate parameters
    const userId = await getUserId();
    const parsed = createListPayloadSchema.parse(payload);

    // Check if user is a project owner
    if (!(await isUserProjectOwner(userId, parsed.projectId))) {
      return { success: false, message: "You are not the project owner." };
    }

    const data = {
      createdBy: userId,
      name: parsed.name,
      isFinal: parsed.isFinal,
      projectId: parsed.projectId
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

export async function getProjectLists(payload: GetProjectListsPayload) {
  try {
    const parsed = getProjectListsPayloadSchema.parse(payload);
    const lists = await listQueries.getProjectLists(parsed.projectId);

    return {
      success: true,
      message: "Success getting lists with tasks.",
      lists
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

    // Check if user is the creator of the list
    if (!(await isUserListCreator(parsed.id, userId))) {
      return { success: false, message: "You are not the list creator." };
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

export async function getList(payload: GetListPayload) {
  try {
    const validId = listSchema.shape.id.parse(payload.id);
    const list = await listQueries.get(validId);

    return { success: true, message: "List fetched successfully.", list };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message, list: null };
    }

    return { success: false, message: "Error. Cannot get list.", list: null };
  }
}

interface DeleteListPayload {
  id: ListSchema["id"];
}

export async function deleteList(payload: DeleteListPayload) {
  try {
    const userId = await getUserId();
    const parsed = deleteListPayloadSchema.parse(payload);

    if (!(await isUserListCreator(parsed.id, userId))) {
      return { success: false, message: "You are not the owner if this list." };
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
