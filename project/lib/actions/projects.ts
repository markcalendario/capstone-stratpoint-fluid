"use server";

import { ProjectSchema } from "@/types/projects";
import { UserSchema } from "@/types/users";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import projectQueries from "../db/queries/projects";
import userQueries from "../db/queries/users";
import { isUserProjectOwner, toCardData } from "../utils/projects";
import {
  createProjectPayloadSchema,
  createProjectSchema,
  deleteProjectPayloadSchema,
  getProjectPayloadSchema,
  getProjectsPayloadSchema,
  getRecentProjectsPayloadSchema,
  updateProjectPayloadSchema,
  updateProjectSchema
} from "../validations/projects";
import { userClerkIdSchema } from "../validations/users";

interface CreateProjectPayload
  extends Pick<ProjectSchema, "name" | "description" | "dueDate"> {
  ownerClerkId: UserSchema["clerkId"];
}

export async function createProject(payload: CreateProjectPayload) {
  try {
    const parsed = createProjectPayloadSchema.parse(payload);
    const ownerId = await userQueries.getIdByClerkId(payload.ownerClerkId);

    const data = {
      name: parsed.name,
      description: parsed.description,
      dueDate: parsed.dueDate,
      ownerId
    };

    const createProject = createProjectSchema.parse(data);
    const projectId = await projectQueries.create(createProject);

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

interface GetRecentProjectsPayload {
  userClerkId: UserSchema["clerkId"];
}

export async function getRecentProjects(payload: GetRecentProjectsPayload) {
  try {
    const parsed = getRecentProjectsPayloadSchema.parse(payload);
    const userId = await userQueries.getIdByClerkId(parsed.userClerkId);

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

interface GetProjectsPayload {
  userClerkId: UserSchema["clerkId"];
}

export async function getProjects(payload: GetProjectsPayload) {
  try {
    const parsed = getProjectsPayloadSchema.parse(payload);
    const userId = await userQueries.getIdByClerkId(parsed.userClerkId);
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
  userClerkId: UserSchema["clerkId"];
  projectId: ProjectSchema["id"];
}

export async function deleteProject(payload: DeleteProjectPayload) {
  try {
    const parsed = deleteProjectPayloadSchema.parse(payload);
    const validClerkId = userClerkIdSchema.parse(parsed.userClerkId);
    const userId = await userQueries.getIdByClerkId(validClerkId);

    if (!(await isUserProjectOwner(userId, parsed.projectId))) {
      return { success: false, message: "You are not the project owner." };
    }

    await projectQueries.delete(userId, parsed.projectId);

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
  userClerkId: UserSchema["clerkId"];
}

export async function updateProject(payload: UpdateProjectPayload) {
  try {
    const parsed = updateProjectPayloadSchema.parse(payload);
    const userId = await userQueries.getIdByClerkId(parsed.userClerkId);

    const data = {
      name: parsed.name,
      description: parsed.description,
      dueDate: parsed.dueDate,
      ownerId: userId,
      updatedAt: new Date().toISOString()
    };

    const updateData = updateProjectSchema.parse(data);

    if (!(await isUserProjectOwner(userId, parsed.projectId))) {
      return { success: false, message: "You are not the project owner." };
    }

    const projectId = await projectQueries.update(parsed.projectId, updateData);

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
