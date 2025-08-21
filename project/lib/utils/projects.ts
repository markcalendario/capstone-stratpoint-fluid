import { List } from "@/types/lists";
import { ProjectMember } from "@/types/projectMembers";
import { Project, ProjectCardData, ProjectSchema } from "@/types/projects";
import { Task } from "@/types/tasks";
import { User, UserSchema } from "@/types/users";
import projectQueries from "..//queries/projects";
import { getDaysRemaining, isOverdue } from "./date-and-time";

interface ToCardDataList extends List {
  tasks: Task[];
}

interface ToCardDataProjectMembers extends ProjectMember {
  user: User;
}

interface ToCardData extends Project {
  projectMembers: ToCardDataProjectMembers[];
  lists: ToCardDataList[];
  user: User;
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
      progress: progress,
      imageUrl: project.imageUrl,
      isActive: project.isActive,
      description: project.description,
      isOverdue: isOverdue(project.dueDate),
      daysRemaining: getDaysRemaining(project.dueDate),
      memberImages: [
        project.user.imageUrl,
        ...project.projectMembers.map((member) => member.user.imageUrl)
      ]
    });
  }

  return projectCardData satisfies ProjectCardData[];
}

export async function isUserProjectOwner(
  userId: UserSchema["id"],
  projectId: ProjectSchema["id"]
) {
  const ownerId = await projectQueries.getOwnerId(projectId);
  return userId === ownerId;
}
