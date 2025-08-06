"use server";

import { ProjectSchema } from "@/types/projects";
import { UserSchema } from "@/types/users";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import projectQueries from "../db/queries/projects";
import userQueries from "../db/queries/users";
import { isUserProjectOwner, toCardData } from "../utils/projects";
import {
  createProjectSchema,
  projectIdSchema,
  updateProjectSchema
} from "../validations/projects";
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

export async function getProject(id: ProjectSchema["id"]) {
  try {
    const validId = projectIdSchema.parse(id);
    const project = await projectQueries.getById(validId);
    return {
      success: true,
      message: "Project retrieved successfully.",
      project
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot get project." };
  }
}

export async function deleteProject(
  userClerkId: UserSchema["clerkId"],
  projectId: ProjectSchema["id"]
) {
  try {
    const validProjectId = projectIdSchema.parse(projectId);
    const validClerkId = userClerkIdSchema.parse(userClerkId);
    const userId = await userQueries.getIdByClerkId(validClerkId);

    if (!(await isUserProjectOwner(userId, validProjectId))) {
      return { success: false, message: "You are not the project owner." };
    }

    await projectQueries.delete(userId, validProjectId);

    return { success: true, message: "Project deleted successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot delete project." };
  }
}

export async function updateProject(formData: FormData) {
  const name = formData.get("name");
  const id = formData.get("projectId");
  const dueDate = formData.get("dueDate");
  const description = formData.get("description");
  const userClerkId = formData.get("userClerkId");
  const userId = await userQueries.getIdByClerkId(userClerkId as string);
  const updatedAt = new Date().toISOString();

  const payload = {
    id,
    name,
    description,
    dueDate,
    ownerId: userId,
    updatedAt
  };

  if (typeof id !== "string") {
    return { success: false, message: "Missing project ID from the payload." };
  }

  try {
    const valid = updateProjectSchema.parse(payload);

    if (!(await isUserProjectOwner(userId, id))) {
      return { success: false, message: "You are not the project owner." };
    }

    const projectId = await projectQueries.update(id, valid);

    revalidatePath("/dashboard");
    revalidatePath("/projects");

    return {
      success: true,
      message: "Project updated successfully.",
      projectId
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot create project." };
  }
}
