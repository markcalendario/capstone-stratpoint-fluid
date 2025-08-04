"use server";

import { UserSchema } from "@/types/users";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import projectQueries from "../db/queries/projects";
import userQueries from "../db/queries/users";
import { toCardData } from "../utils/projects";
import { createProjectSchema } from "../validations/projects";
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

    const projects = await projectQueries.ownedOrMember(userId);

    const recentProjects = projects
      .sort((a, b) => {
        const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return bTime - aTime; // Most recent first
      })
      .slice(0, 3);

    return {
      success: true,
      message: "Success getting recent projects.",
      recentProjects: toCardData(recentProjects)
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot get recent projects." };
  }
}

export async function getProjects(userClerkId: UserSchema["clerkId"]) {
  try {
    const validUserClerkId = userClerkIdSchema.parse(userClerkId);
    const userId = await userQueries.getIdByClerkId(validUserClerkId);
    const projects = await projectQueries.ownedOrMember(userId);

    const sortedProjects = projects.sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    const formattedProjects = toCardData(sortedProjects);

    return {
      success: true,
      message: "Success getting all projects.",
      projects: formattedProjects
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot get projects." };
  }
}
