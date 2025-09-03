"use server";

import { getUserId } from "@/lib/utils/users";
import {
  GetAnalyticsSummaryPayload,
  GetProjectProgressPayload,
  GetStatusByPriorityPayload
} from "@/types/analytics";
import { ZodError } from "zod";
import projectQueries from "../queries/projects";
import { priorities } from "../utils/constants";
import { dayStartOfWeek, isOverdue } from "../utils/date-and-time";
import { dispatchError, handleDispatchError } from "../utils/dispatch-error";
import { toTitleCase } from "../utils/formatters";
import { PERMISSION } from "../utils/permission-enum";
import { hasPermission } from "../utils/rolePermissions";
import {
  getAnalyticsSummarySchema,
  getProjectProgressSchema,
  getStatusByPrioritySchema
} from "../validations/analytics";

export async function getDashboardStatus() {
  try {
    const userId = await getUserId();
    const projects = await projectQueries.getAll(userId);
    const startOfWeek = dayStartOfWeek();

    // Active Projects
    const activeProjects = projects.filter((p) => p.isActive);
    const activeProjectsThisWeek = activeProjects.filter(
      (p) => new Date(p.createdAt) >= startOfWeek
    );

    // Project Members
    const allMembers = projects.flatMap((p) => p.projectMembers);
    const membersThisWeek = allMembers.filter(
      (member) =>
        member.isAccepted &&
        member.acceptedAt &&
        new Date(member.acceptedAt) >= startOfWeek
    );

    // Tasks
    let completedTasks = 0;
    let completedTasksThisWeek = 0;
    let pendingTasks = 0;
    let pendingTasksThisWeek = 0;

    for (const project of projects) {
      for (const list of project.lists) {
        for (const task of list.tasks) {
          // Done task
          if (list.isFinal) {
            completedTasks++;
            if (new Date(task.dueDate) >= startOfWeek) {
              completedTasksThisWeek++;
            }
          }
          // Pending task
          else {
            pendingTasks++;
            if (new Date(task.createdAt) >= startOfWeek) {
              pendingTasksThisWeek++;
            }
          }
        }
      }
    }

    return {
      success: true,
      message: "Dashboard status retrieved successfully",
      status: {
        activeProjects: {
          overall: activeProjects.length,
          thisWeek: activeProjectsThisWeek.length
        },
        projectMembers: {
          overall: allMembers.length,
          thisWeek: membersThisWeek.length
        },
        completedTasks: {
          overall: completedTasks,
          thisWeek: completedTasksThisWeek
        },
        pendingTasks: {
          overall: pendingTasks,
          thisWeek: pendingTasksThisWeek
        }
      }
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    handleDispatchError(error);
  }
}

export async function getProjectProgress(payload: GetProjectProgressPayload) {
  try {
    const userId = await getUserId();
    const parsed = getProjectProgressSchema.parse(payload);
    const projectId = parsed.projectId;

    const project = await projectQueries.get(projectId);

    if (!project) return dispatchError(401);

    const isPermitted = await hasPermission(
      userId,
      projectId,
      PERMISSION.VIEW_PROJECT
    );

    if (!isPermitted) return dispatchError(401);

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

    handleDispatchError(error);
  }
}

export async function getStatusByPriority(payload: GetStatusByPriorityPayload) {
  try {
    const userId = await getUserId();
    const parsed = getStatusByPrioritySchema.parse(payload);
    const projectId = parsed.projectId;

    const project = await projectQueries.get(projectId);

    if (!project) return dispatchError(404);

    const isPermitted = await hasPermission(
      userId,
      projectId,
      PERMISSION.VIEW_PROJECT
    );

    if (!isPermitted) return dispatchError(401);

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

    handleDispatchError(error);
  }
}

export async function getAnalyticsSummary(payload: GetAnalyticsSummaryPayload) {
  try {
    const userId = await getUserId();
    const parsed = getAnalyticsSummarySchema.parse(payload);
    const projectId = parsed.projectId;

    const isPermitted = await hasPermission(
      userId,
      projectId,
      PERMISSION.VIEW_PROJECT
    );

    if (!isPermitted) return dispatchError(401);

    const project = await projectQueries.get(parsed.projectId);

    if (!project) return dispatchError(404);

    // Done tasks
    const doneTasksCount = project.lists
      .filter((list) => list.isFinal)
      .reduce((count, list) => count + list.tasks.length, 0);

    // Pending tasks
    const pendingTasksCount = project.lists
      .filter((list) => !list.isFinal)
      .reduce((count, list) => count + list.tasks.length, 0);

    const overdueTasksCount = project.lists
      .filter((list) => !list.isFinal)
      .flatMap((list) => list.tasks)
      .filter((task) => isOverdue(task.dueDate)).length;

    const total = doneTasksCount + pendingTasksCount;
    const completionRate = total > 0 ? (doneTasksCount / total) * 100 : 0;

    return {
      success: true,
      message: "Dashboard status retrieved successfully",
      status: {
        tasksDone: doneTasksCount,
        tasksPending: pendingTasksCount,
        completionRate: completionRate.toFixed(2),
        overdueTasks: overdueTasksCount
      }
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    handleDispatchError(error);
  }
}
