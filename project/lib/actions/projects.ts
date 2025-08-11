"use server";

import { CreateProjectPayload, ProjectSchema } from "@/types/projects";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import projectQueries from "..//queries/projects";
import { isUserProjectOwner, toCardData } from "../utils/projects";
import { getUserId } from "../utils/users";
import {
  createProjectPayloadSchema,
  deleteProjectPayloadSchema,
  getProjectPayloadSchema,
  updateProjectPayloadSchema
} from "../validations/projects";

export async function createProject(payload: CreateProjectPayload) {
  try {
    const userId = await getUserId();
    const parsed = createProjectPayloadSchema.parse(payload);

    const data = {
      name: parsed.name,
      description: parsed.description,
      dueDate: parsed.dueDate,
      ownerId: userId
    };

    const projectId = await projectQueries.create(data);

    revalidatePath("/(dashboard)");

    return {
      success: true,
      message: "Project created successfully.",
      projectId
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: error.issues[0].message,
        projectId: null
      };
    }

    return {
      success: false,
      message: "Error. Cannot create project.",
      projectId: null
    };
  }
}

export async function getRecentProjects() {
  try {
    const userId = await getUserId();
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
      return {
        success: false,
        message: error.issues[0].message,
        recentProjects: []
      };
    }

    return {
      success: false,
      message: "Error. Cannot get recent projects.",
      recentProjects: []
    };
  }
}

export async function getProjects() {
  try {
    const userId = await getUserId();
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
      return { success: false, message: error.issues[0].message, projects: [] };
    }

    return {
      success: false,
      message: "Error. Cannot get projects.",
      projects: []
    };
  }
}

interface GetProjectPayload {
  id: ProjectSchema["id"];
}

export async function getProject(payload: GetProjectPayload) {
  try {
    const parsed = getProjectPayloadSchema.parse(payload);
    const project = await projectQueries.getById(parsed.id);
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

interface DeleteProjectPayload {
  projectId: ProjectSchema["id"];
}

export async function deleteProject(payload: DeleteProjectPayload) {
  try {
    const userId = await getUserId();
    const parsed = deleteProjectPayloadSchema.parse(payload);

    if (!(await isUserProjectOwner(userId, parsed.projectId))) {
      return { success: false, message: "You are not the project owner." };
    }

    await projectQueries.delete(userId, parsed.projectId);

    // Revalidate the cache
    revalidatePath("/(dashboard)");

    return { success: true, message: "Project deleted successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot delete project." };
  }
}

interface UpdateProjectPayload
  extends Pick<ProjectSchema, "name" | "dueDate" | "description"> {
  projectId: ProjectSchema["id"];
}

export async function updateProject(payload: UpdateProjectPayload) {
  try {
    const userId = await getUserId();
    const parsed = updateProjectPayloadSchema.parse(payload);

    if (!(await isUserProjectOwner(userId, parsed.projectId))) {
      return { success: false, message: "You are not the project owner." };
    }

    const data = {
      name: parsed.name,
      description: parsed.description,
      dueDate: parsed.dueDate,
      ownerId: userId,
      updatedAt: new Date().toISOString()
    };

    const projectId = await projectQueries.update(parsed.projectId, data);

    // Revalidate the cache
    revalidatePath("/(dashboard)");

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
