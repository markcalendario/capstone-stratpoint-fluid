"use server";

import {
  getActiveProjectsStatus,
  getCompletedTasksStatus,
  getPendingTasksStatus,
  getProjectMembersStatus
} from "@/lib/utils/analytics";
import { getUserId } from "@/lib/utils/users";
import {
  GetProjectProgressPayload,
  GetStatusByPriorityPayload
} from "@/types/analytics";
import { ZodError } from "zod";
import projectQueries from "../queries/projects";
import { priorities } from "../utils/constants";
import { toTitleCase } from "../utils/formatters";
import { PERMISSION } from "../utils/permission-enum";
import { hasPermission } from "../utils/rolePermissions";
import { getProjectProgressSchema } from "../validations/analytics";

export async function getDashboardStatus() {
  try {
    const userId = await getUserId();

    const [activeProjects, projectMembers, completedTasks, pendingTasks] =
      await Promise.all([
        getActiveProjectsStatus(userId),
        getProjectMembersStatus(userId),
        getCompletedTasksStatus(userId),
        getPendingTasksStatus(userId)
      ]);

    return {
      success: true,
      message: "Dashboard status retrieved successfully",
      status: { projectMembers, pendingTasks, activeProjects, completedTasks }
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot get dashboard status." };
  }
}

export async function getProjectProgress(payload: GetProjectProgressPayload) {
  try {
    const userId = await getUserId();
    const parsed = getProjectProgressSchema.parse(payload);
    const projectId = parsed.projectId;

    const project = await projectQueries.get(projectId);

    if (!project) {
      return { success: false, message: "Project is not found." };
    }

    const isPermitted = await hasPermission(
      userId,
      projectId,
      PERMISSION.VIEW_PROJECT
    );

    if (!isPermitted) {
      return { success: false, message: "Error. Cannot view project." };
    }

    const pendingCount = project.lists
      .filter((list) => !list.isFinal)
      .reduce((count, list) => count + list.tasks.length, 0);

    const doneCount = project.lists
      .filter((list) => list.isFinal)
      .reduce((count, list) => count + list.tasks.length, 0);

    const total = pendingCount + doneCount;

    const donePercent = total === 0 ? 0 : (doneCount / total) * 100;
    const pendingPercent = total === 0 ? 0 : (pendingCount / total) * 100;

    const progress = {
      donePercent,
      pendingPercent,
      name: project.name
    };

    return {
      progress,
      success: true,
      message: "Project progress retrieved successfully."
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return {
      success: false,
      message: "Error. Cannot retrieve project progress."
    };
  }
}

export async function getStatusByPriority(payload: GetStatusByPriorityPayload) {
  try {
    const userId = await getUserId();
    const parsed = getProjectProgressSchema.parse(payload);
    const projectId = parsed.projectId;

    const project = await projectQueries.get(projectId);

    if (!project) {
      return { success: false, message: "Project is not found." };
    }

    const isPermitted = await hasPermission(
      userId,
      projectId,
      PERMISSION.VIEW_PROJECT
    );

    if (!isPermitted) {
      return { success: false, message: "Error. Cannot view project." };
    }

    // Build the initial structure
    const priorityMap = {
      low: { done: 0, pending: 0 },
      medium: { done: 0, pending: 0 },
      high: { done: 0, pending: 0 }
    };

    // Process all tasks
    for (const list of project.lists) {
      for (const task of list.tasks) {
        const priority = task.priority;
        const isDone = list.isFinal;

        if (isDone) priorityMap[priority].done++;
        else priorityMap[priority].pending++;
      }
    }

    // Convert to chart data format
    const statusByPriorty = priorities.map((priority) => ({
      name: toTitleCase(priority),
      done: priorityMap[priority].done,
      pending: priorityMap[priority].pending
    }));

    return {
      statusByPriorty,
      success: true,
      message: "Project status by priority retrieved successfully."
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return {
      success: false,
      message: "Error. Cannot retrieve project status by priority."
    };
  }
}
