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
  createListSchema,
  listIdSchema,
  updateListSchema
} from "../validations/lists";
import { projectIdSchema } from "../validations/projects";
import { userClerkIdSchema } from "../validations/users";

interface CreateListPayload
  extends Pick<ListSchema, "name" | "isFinal" | "projectId"> {
  userClerkId: UserSchema["clerkId"];
}

export async function createList({
  projectId,
  name,
  isFinal,
  userClerkId
}: CreateListPayload) {
  try {
    // Validate user Clerk ID
    const validUserClerkId = userClerkIdSchema.parse(userClerkId);
    const userId = await userQueries.getIdByClerkId(validUserClerkId); // Get the user ID in DB

    // Check if user is a project owner
    if (!(await isUserProjectOwner(userId, projectId))) {
      return { success: false, message: "You are not the project owner." };
    }

    const createData = { projectId, name, isFinal, createdBy: userId };

    // Validate create list data
    const valid = createListSchema.parse(createData);

    // Create data
    await listQueries.create(valid);

    return { success: true, message: "List created successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot create list." };
  }
}

export async function getListsByProjectId(projectId: ProjectSchema["id"]) {
  try {
    const validProjectId = projectIdSchema.parse(projectId);
    const lists = await listQueries.getByProjectId(validProjectId);

    return {
      success: true,
      message: "Success getting lists with tasks.",
      lists
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    console.log(error);

    return { success: false, message: "Error. Cannot get lists with tasks." };
  }
}

interface UpdateListPayload
  extends Pick<ListSchema, "id" | "name" | "isFinal"> {
  userClerkId: UserSchema["id"];
}

export async function updateList({
  id,
  name,
  isFinal,
  userClerkId
}: UpdateListPayload) {
  try {
    // Validate user Clerk ID
    const validUserClerkId = userClerkIdSchema.parse(userClerkId);
    const userId = await userQueries.getIdByClerkId(validUserClerkId); // Get the user ID in DB

    // Check if user is the creator of the list
    if (!(await isUserListCreator(id, userId))) {
      return { success: false, message: "You are not the list creator." };
    }

    const updateData = { name, isFinal, updatedAt: new Date().toISOString() };

    // Validate update list data
    const valid = updateListSchema.parse(updateData);

    // Update data
    await listQueries.update(id, valid);

    return { success: true, message: "List updated successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    console.log(error);

    return { success: false, message: "Error. Cannot update list." };
  }
}

export async function getListById(id: ListSchema["id"]) {
  try {
    const validListId = listIdSchema.parse(id);
    const list = await listQueries.getById(validListId);

    return { success: true, message: "List updated successfully.", list };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot get list." };
  }
}

interface DeleteListParams {
  id: ListSchema["id"];
  userClerkId: UserSchema["clerkId"];
}

export async function deleteList({ id, userClerkId }: DeleteListParams) {
  try {
    const validClerkId = userClerkIdSchema.parse(userClerkId);
    const validListId = listIdSchema.parse(id);
    const validUserId = await userQueries.getIdByClerkId(validClerkId);

    if (!(await isUserListCreator(validListId, validUserId))) {
      return { success: false, message: "You are not the owner if this list." };
    }

    await listQueries.delete(validListId);
    return { success: true, message: "List deleted successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot delete list." };
  }
}
