import { UserSchema } from "@/types/users";
import projectQueries from "..//queries/projects";
import { dayStartOfWeek } from "./date-and-time";

// Helper: Calculate percentage and type
function calcChange(
  current: number,
  previous: number
): { value: string; type: "positive" | "negative" } {
  if (previous === 0) {
    return {
      value: current === 0 ? "0%" : "100%",
      type: current >= 0 ? "positive" : "negative"
    };
  }

  const change = ((current - previous) / previous) * 100;
  return {
    value: `${change.toFixed(1)}%`,
    type: change >= 0 ? "positive" : "negative"
  };
}

export async function getActiveProjectsStatus(userId: UserSchema["id"]) {
  const projects = await projectQueries.getAll(userId);
  const overall = projects.length;

  const thisWeek = projects.filter((p) => {
    const isCreatedThisWeek = new Date(p.createdAt) >= dayStartOfWeek();
    const isActive = p.isActive;
    return isCreatedThisWeek && isActive;
  }).length;

  return { overall, thisWeek };
}

export async function getProjectMembersStatus(userId: UserSchema["id"]) {
  const projects = await projectQueries.getAll(userId);
  const allMembers = projects.flatMap((p) => p.projectMembers);
  const overall = allMembers.length;

  const thisWeek = allMembers.filter((member) => {
    return (
      member.isAccepted &&
      member.acceptedAt &&
      new Date(member.acceptedAt) >= dayStartOfWeek()
    );
  }).length;

  return { overall, thisWeek };
}

export async function getCompletedTasksStatus(userId: UserSchema["id"]) {
  const projects = await projectQueries.getAll(userId);

  let overall = 0;
  let thisWeek = 0;

  for (const project of projects) {
    for (const list of project.lists) {
      if (!list.isFinal) continue;

      for (const task of list.tasks) {
        overall++;
        const taskDate = new Date(task.dueDate);
        if (taskDate >= dayStartOfWeek()) thisWeek++;
      }
    }
  }

  return { overall, thisWeek };
}

export async function getPendingTasksStatus(userId: UserSchema["id"]) {
  const projects = await projectQueries.getAll(userId);

  let overall = 0;
  let thisWeek = 0;

  for (const project of projects) {
    for (const list of project.lists) {
      if (list.isFinal) continue;

      for (const task of list.tasks) {
        const taskDate = new Date(task.createdAt);
        overall++;
        if (taskDate >= dayStartOfWeek()) thisWeek++;
      }
    }
  }

  return { overall, thisWeek };
}
