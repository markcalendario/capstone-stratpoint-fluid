"use server";

import projectQueries from "../queries/projects";
import { getUserId } from "../utils/users";

export default async function getCalendarEvents() {
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
