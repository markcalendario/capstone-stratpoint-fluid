"use server";

import {
  ChangeProjectDuePayload,
  ChangeTaskDuePayload
} from "@/types/calendar";
import { ZodError } from "zod";
import projectQueries from "../queries/projects";
import taskQueries from "../queries/tasks";
import { getDaysRemaining } from "../utils/date-and-time";
import { PERMISSION } from "../utils/permission-enum";
import { hasPermission } from "../utils/rolePermissions";
import { getUserId } from "../utils/users";
import {
  changeProjectDuePayloadSchema,
  changeTaskDuePayloadSchema
} from "../validations/calendar";

export async function getCalendarEvents() {
  try {
    const userId = await getUserId();
    const projects = await projectQueries.getAll(userId);

    const projectDeadlines = projects.map((project) => ({
      allDay: true,
      title: `[PROJECT] ${project.name}`,
      start: new Date(project.dueDate),
      end: new Date(project.dueDate),
      resource: {
        id: project.id,
        type: "project"
      }
    }));

    const taskDeadlines = projects
      .flatMap((project) => project.lists)
      .flatMap((list) => list.tasks)
      .map((task) => ({
        allDay: true,
        title: `[TASK] ${task.title}`,
        start: new Date(task.dueDate),
        end: new Date(task.dueDate),
        resource: {
          id: task.id,
          type: "task"
        }
      }));

    const events = [...taskDeadlines, ...projectDeadlines];

    return {
      success: true,
      message: "Calendar events retrieved successfully.",
      events
    };
  } catch {
    return {
      success: false,
      message: "Error. Cannot retrieve calendar events."
    };
  }
}

export async function getUpcomingDeadlines() {
  try {
    const userId = await getUserId();
    const projects = await projectQueries.getAll(userId);

    const projectDeadlines = projects.map((project) => ({
      id: project.id,
      type: "project" as const,
      title: project.name,
      dueDate: new Date(project.dueDate),
      daysRemaining: getDaysRemaining(project.dueDate)
    }));

    const taskDeadlines = projects
      .flatMap((project) => project.lists)
      .flatMap((list) => list.tasks)
      .map((task) => ({
        id: task.id,
        type: "task" as const,
        title: task.title,
        dueDate: new Date(task.dueDate),
        daysRemaining: getDaysRemaining(task.dueDate)
      }));

    const allEvents = [...taskDeadlines, ...projectDeadlines];

    // Filter out past deadlines
    const upcomingEvents = allEvents.filter(
      (event) => event.dueDate.getTime() >= new Date().setHours(0, 0, 0, 0)
    );

    // Sort by soonest deadline
    const sortedUpcomingEvents = upcomingEvents.sort(
      (a, b) => a.dueDate.getTime() - b.dueDate.getTime()
    );

    // Get first 5
    const deadlines = sortedUpcomingEvents.slice(0, 3);

    return {
      success: true,
      message: "Upcoming deadlines retrieved successfully.",
      deadlines
    };
  } catch {
    return {
      success: false,
      message: "Error. Cannot retrieve upcomign deadlines."
    };
  }
}

export async function changeTaskDue(payload: ChangeTaskDuePayload) {
  try {
    const parsed = changeTaskDuePayloadSchema.parse(payload);
    const task = await taskQueries.getTask(parsed.id);

    if (!task) {
      return { success: false, message: "Task not found." };
    }

    const userId = await getUserId();
    const projectId = task.list.projectId;

    const isPermitted = await hasPermission(
      userId,
      projectId,
      PERMISSION.EDIT_TASK
    );

    if (!isPermitted) {
      return {
        success: false,
        message: "Unauthorized. You are not permitted to change task due date."
      };
    }

    await taskQueries.updateDueDate(parsed.id, parsed.dueDate);
    return { success: true, message: "Task due date updated successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }
    console.log(error);

    return { success: false, message: "Error. Cannot change task due date." };
  }
}

export async function changeProjectDue(payload: ChangeProjectDuePayload) {
  try {
    const parsed = changeProjectDuePayloadSchema.parse(payload);
    const userId = await getUserId();

    const isPermitted = await hasPermission(
      userId,
      parsed.id,
      PERMISSION.EDIT_PROJECT
    );

    if (!isPermitted) {
      return {
        success: false,
        message:
          "Unauthorized. You are not permitted to change project due date."
      };
    }

    await projectQueries.updateDueDate(parsed.id, parsed.dueDate);
    return { success: true, message: "Project due date updated successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }
    console.log(error);

    return {
      success: false,
      message: "Error. Cannot change project due date."
    };
  }
}
