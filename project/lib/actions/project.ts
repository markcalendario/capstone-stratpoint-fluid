"use server";

import { UserSchema } from "@/types/users";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import projectQueries from "../db/queries/projects";
import userQueries from "../db/queries/users";
import { createProjectSchema } from "../validations/project";
import { userClerkIdSchema } from "../validations/users";

export async function createProject(formData: FormData) {
  const name = formData.get("name");
  const description = formData.get("description");
  const dueDate = formData.get("dueDate");
  const ownerClerkId = formData.get("ownerClerkId");
  const ownerId = await userQueries.getIdByClerkId(ownerClerkId as string);

  const payload = { name, description, dueDate, ownerId };

  try {
    const valid = createProjectSchema.parse(payload);
    const projectId = await projectQueries.create(valid);

    revalidatePath("/dashboard");
    revalidatePath("/projects");

    return {
      success: true,
      message: "Project created successfully.",
      projectId
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot create project." };
  }
}

export async function getRecentProjects(userClerkId: UserSchema["clerkId"]) {
  try {
    const validUserClerkId = userClerkIdSchema.parse(userClerkId);
    const userId = await userQueries.getIdByClerkId(validUserClerkId);
    const recentProjects = await projectQueries.getAll(userId);

    return {
      success: true,
      message: "Success getting recent projects.",
      recentProjects: recentProjects.slice(0, 3)
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot get recent projects." };
  }
}
