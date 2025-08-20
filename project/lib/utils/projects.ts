import { List } from "@/types/lists";
import { ProjectMember } from "@/types/projectMembers";
import { Project, ProjectSchema } from "@/types/projects";
import { Task } from "@/types/tasks";
import { UserSchema } from "@/types/users";
import projectQueries from "..//queries/projects";
import { formatDate } from "./date-and-time";

interface ToCardDataList extends List {
  tasks: Task[];
}

interface ToCardData extends Project {
  projectMembers: ProjectMember[];
  lists: ToCardDataList[];
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
      members: project.projectMembers.length + 1, // Plus the owner
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
