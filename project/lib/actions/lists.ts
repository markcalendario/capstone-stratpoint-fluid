"use server";

import { ListSchema } from "@/types/lists";
import { ProjectSchema } from "@/types/projects";
import { UserSchema } from "@/types/users";
import { ZodError } from "zod";
import listQueries from "../db/queries/lists";
import userQueries from "../db/queries/users";
import { isUserListCreator } from "../utils/lists";
import { isUserProjectOwner } from "../utils/projects";
import {
  createListDataSchema,
  createListPayloadSchema,
  deleteListPayloadSchema,
  getListsByProjectIdSchema,
  listSchema,
  updateListPayloadSchema,
  updateListSchema
} from "../validations/lists";

interface CreateListPayload
  extends Pick<ListSchema, "name" | "isFinal" | "projectId"> {
  userClerkId: UserSchema["clerkId"];
}

export async function createList(payload: CreateListPayload) {
  try {
    // Validate parameters
    const parsed = createListPayloadSchema.parse(payload);
    const userId = await userQueries.getIdByClerkId(parsed.userClerkId); // Get the user ID in DB

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

    // Validate create list data
    const createData = createListDataSchema.parse(data);

    // Create list
    await listQueries.create(createData);

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
  extends Pick<ListSchema, "id" | "name" | "isFinal"> {
  userClerkId: UserSchema["clerkId"];
}

export async function updateList(payload: UpdateListPayload) {
  try {
    // Validate payload
    const parsed = updateListPayloadSchema.parse(payload);
    const userId = await userQueries.getIdByClerkId(parsed.userClerkId); // Get the user ID in DB

    // Check if user is the creator of the list
    if (!(await isUserListCreator(parsed.id, userId))) {
      return { success: false, message: "You are not the list creator." };
    }

    const data = {
      name: parsed.name,
      isFinal: parsed.isFinal,
      updatedAt: new Date().toISOString()
    };

    // Validate update list data
    const updateData = updateListSchema.parse(data);

    // Update data
    await listQueries.update(parsed.id, updateData);

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
  userClerkId: UserSchema["clerkId"];
}

export async function deleteList(payload: DeleteListPayload) {
  try {
    const parsed = deleteListPayloadSchema.parse(payload);
    const validUserId = await userQueries.getIdByClerkId(parsed.userClerkId);

    if (!(await isUserListCreator(parsed.id, validUserId))) {
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
