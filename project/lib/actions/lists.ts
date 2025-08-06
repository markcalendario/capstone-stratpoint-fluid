"use server";

import { ListSchema } from "@/types/lists";
import { UserSchema } from "@/types/users";
import { ZodError } from "zod";
import listQueries from "../db/queries/lists";
import userQueries from "../db/queries/users";
import { isUserProjectOwner } from "../utils/projects";
import { createListSchema } from "../validations/lists";
import { userClerkIdSchema } from "../validations/users";

export interface CreateListPayload
  extends Pick<ListSchema, "name" | "isFinal" | "projectId"> {
  userClerkId: UserSchema["clerkId"];
}

export async function createList(payload: CreateListPayload) {
  try {
    const { projectId, name, isFinal, userClerkId } = payload;

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

    console.log(error);

    return { success: false, message: "Error. Cannot create list." };
  }
}
