import { ListSchema } from "@/types/lists";
import { Project } from "@/types/projects";
import { TeamsSchema } from "@/types/teams";
import { formatDate } from "./date-and-time";

interface ToCardData extends Project {
  lists: Pick<ListSchema, "tasks" | "isFinal">[];
  teams: TeamsSchema[];
}

export function toCardData(projects: ToCardData[]) {
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
