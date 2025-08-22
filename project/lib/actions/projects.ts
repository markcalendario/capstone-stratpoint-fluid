"use server";

import {
  CreateProjectPayload,
  DeleteProjectPayload,
  GetProjectDataPayload,
  GetProjectInfoPayload,
  GetProjectOptionsPayload,
  ProjectInfo,
  UpdateProjectPayload
} from "@/types/projects";
import { ZodError } from "zod";
import projectQueries from "..//queries/projects";
import { formatDate } from "../utils/date-and-time";
import { upload } from "../utils/files";
import { isUserProjectOwner, toCardData } from "../utils/projects";
import { getUserId } from "../utils/users";
import {
  createProjectPayloadSchema,
  deleteProjectPayloadSchema,
  getProjectOptionsPayloadSchema,
  getProjectPayloadSchema,
  updateProjectPayloadSchema
} from "../validations/projects";

export async function createProject(payload: CreateProjectPayload) {
  try {
    const userId = await getUserId();
    const parsed = createProjectPayloadSchema.parse(payload);

    let imageUrl: string | undefined = undefined;

    if (parsed.image) {
      imageUrl = await upload({ file: parsed.image });
    }

    const data: any = {
      name: parsed.name,
      description: parsed.description,
      dueDate: parsed.dueDate,
      ownerId: userId,
      projectType: parsed.projectType,
      ...(imageUrl && { imageUrl })
    };

    const projectId = await projectQueries.create(data);

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
    console.log(error);

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
    const projects = await projectQueries.getAll(userId);

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
    const projects = await projectQueries.getAll(userId);

    const formattedProjects = toCardData(projects);

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

export async function getProjectEditData(payload: GetProjectDataPayload) {
  try {
    const parsed = getProjectPayloadSchema.parse(payload);
    const project = await projectQueries.get(parsed.id);

    if (!project) return { success: false, message: "Project not found." };

    const formatted = {
      id: project.id,
      name: project.name,
      dueDate: project.dueDate,
      imageUrl: project.imageUrl,
      description: project.description,
      projectType: project.projectType
    };

    return {
      success: true,
      message: "Project retrieved successfully.",
      project: formatted
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot get project." };
  }
}

export async function getProjectSlug(payload: GetProjectInfoPayload) {
  try {
    const parsed = getProjectPayloadSchema.parse(payload);
    const project = await projectQueries.get(parsed.id);

    if (!project) return { success: true, message: "Project not found." };

    const formatted = {
      id: project.id,
      name: project.name,
      imageUrl: project.imageUrl,
      description: project.description,
      projectType: project.projectType,
      ownerImage: project.user.imageUrl,
      dueDate: formatDate(project.dueDate),
      memberImages: project.projectMembers.map((m) => m.user.imageUrl)
    } satisfies ProjectInfo;

    return {
      success: true,
      message: "Project retrieved successfully.",
      project: formatted
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot get project." };
  }
}

export async function deleteProject(payload: DeleteProjectPayload) {
  try {
    const userId = await getUserId();
    const parsed = deleteProjectPayloadSchema.parse(payload);

    if (!(await isUserProjectOwner(userId, parsed.id))) {
      return { success: false, message: "You are not the project owner." };
    }

    await projectQueries.delete(parsed.id, userId);

    return { success: true, message: "Project deleted successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot delete project." };
  }
}

export async function updateProject(payload: UpdateProjectPayload) {
  try {
    const userId = await getUserId();
    const parsed = updateProjectPayloadSchema.parse(payload);
    console.log(parsed);

    let imageUrl: string | undefined = undefined;

    if (parsed.image) {
      imageUrl = await upload({ file: parsed.image });
    }

    if (!(await isUserProjectOwner(userId, parsed.projectId))) {
      return { success: false, message: "You are not the project owner." };
    }

    const data = {
      name: parsed.name,
      description: parsed.description,
      dueDate: parsed.dueDate,
      ownerId: userId,
      projectType: parsed.projectType,
      updatedAt: new Date().toISOString(),
      ...(imageUrl && { imageUrl })
    };

    await projectQueries.update(parsed.projectId, data);

    return {
      success: true,
      message: "Project updated successfully."
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

export async function getProjectOptions(payload: GetProjectOptionsPayload) {
  try {
    const userId = await getUserId();

    const parsed = getProjectOptionsPayloadSchema.parse(payload);
    const projects = await projectQueries.getOptions(parsed.name, userId);

    const formatted = projects.map((project) => ({
      id: project.id,
      name: project.name,
      imageUrl: project.imageUrl,
      projectType: project.projectType
    }));

    return {
      success: true,
      message: "Project options retrieved successfully.",
      projects: formatted
    };
  } catch (error) {
    console.log(error);

    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot retrieve projects." };
  }
}
