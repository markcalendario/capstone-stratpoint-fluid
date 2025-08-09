import { List } from "@/types/lists";
import { Project, ProjectSchema } from "@/types/projects";
import { Task } from "@/types/tasks";
import { Team } from "@/types/teams";
import { UserSchema } from "@/types/users";
import projectQueries from "../db/queries/projects";
import { formatDate } from "./date-and-time";

interface ToCardData extends Omit<Project, "teams" | "lists"> {
  teams: Team[];
  lists: Array<
    List & {
      tasks: Task[];
    }
  >;
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
    const progress =
      totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

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

export async function isUserProjectOwner(
  userId: UserSchema["id"],
  projectId: ProjectSchema["id"]
) {
  const ownerId = await projectQueries.getOwnerId(projectId);
  return userId === ownerId;
}
