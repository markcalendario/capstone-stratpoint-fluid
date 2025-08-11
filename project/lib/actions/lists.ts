"use server";

import listQueries from "@/lib/queries/lists";
import { isUserListCreator } from "@/lib/utils/lists";
import { isUserProjectOwner } from "@/lib/utils/projects";
import { getUserId } from "@/lib/utils/users";
import {
  createListPayloadSchema,
  deleteListPayloadSchema,
  getListsByProjectIdSchema,
  listSchema,
  updateListPayloadSchema
} from "@/lib/validations/lists";
import { ListSchema } from "@/types/lists";
import { ProjectSchema } from "@/types/projects";
import { revalidatePath } from "next/cache";
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

    // Revalidate paths
    revalidatePath("/(dashboard)");

    return { success: true, message: "List created successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot create list." };
  }
}

interface GetListsByProjectIdPayload {
  projectId: ProjectSchema["id"];
}

export async function getListsByProjectId(payload: GetListsByProjectIdPayload) {
  try {
    const parsed = getListsByProjectIdSchema.parse(payload);
    const lists = await listQueries.getByProjectId(parsed.projectId);

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

interface UpdateListPayload
  extends Pick<ListSchema, "id" | "name" | "isFinal"> {}

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

    // Revalidate the cache
    revalidatePath("/(dashboard)");

    return { success: true, message: "List updated successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot update list." };
  }
}

interface GetListByIdPayload {
  id: ListSchema["id"];
}

export async function getListById(payload: GetListByIdPayload) {
  try {
    const validId = listSchema.shape.id.parse(payload.id);
    const list = await listQueries.getById(validId);

    return { success: true, message: "List fetched successfully.", list };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot get list." };
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

    // Revalidate the cache
    revalidatePath("/(dashboard)");

    return { success: true, message: "List deleted successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot delete list." };
  }
}
