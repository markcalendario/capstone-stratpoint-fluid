import { ProjectSchema } from "@/types/projects";
import { formatDate } from "./date-and-time";

export function toCardData(projects: ProjectSchema[]) {
  const projectCardData = [];

  for (const project of projects) {
    const doneTasks = project.lists.reduce((count, list) => {
      return list.isFinal ? count + list.tasks.length : count;
    }, 0);

    const pendingTasks = project.lists.reduce((count, list) => {
      return !list.isFinal ? count + list.tasks.length : count;
    }, 0);

    const totalTasks = doneTasks + pendingTasks;
    const progress = totalTasks === 0 ? 0 : doneTasks / totalTasks;

    projectCardData.push({
      id: project.id,
      name: project.name,
      description: project.description,
      dueDate: formatDate(project.dueDate),
      members: project.teams.length + 1, // Plus the owner
      progress
    });
  }

  return projectCardData;
}
