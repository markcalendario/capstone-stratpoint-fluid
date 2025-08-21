import { UserSchema } from "@/types/users";
import projectQueries from "..//queries/projects";

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
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(new Date().getDate() - 7);

  const projects = await projectQueries.ownedOrMember(userId);

  const currentCount = projects.length;
  const previousCount = projects.filter((p) => {
    const isOneWeekAgo = new Date(p.createdAt) < oneWeekAgo;
    const isActive = p.isActive;
    return isOneWeekAgo && isActive;
  }).length;

  const change = calcChange(currentCount, previousCount);

  return {
    count: currentCount,
    change: change.value,
    changeType: change.type
  };
}

export async function getProjectMembersStatus(userId: UserSchema["id"]) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(new Date().getDate() - 7);

  const projects = await projectQueries.ownedOrMember(userId);

  const currentMembers = new Set(
    projects.flatMap((p) =>
      p.projectMembers.map((projectMember) => projectMember.userId)
    )
  );

  const previousMembers = new Set(
    projects.flatMap((p) =>
      p.projectMembers
        .filter((projectMember) => {
          return (
            projectMember.isAccepted &&
            projectMember.invitedAt &&
            new Date(projectMember.invitedAt) < oneWeekAgo
          );
        })
        .map((projectMember) => projectMember.userId)
    )
  );

  const change = calcChange(currentMembers.size, previousMembers.size);

  return {
    count: currentMembers.size,
    change: change.value,
    changeType: change.type
  };
}

export async function getCompletedTasksStatus(userId: UserSchema["id"]) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(new Date().getDate() - 7);

  const projects = await projectQueries.ownedOrMember(userId);

  let current = 0;
  let previous = 0;

  for (const project of projects) {
    for (const list of project.lists) {
      if (!list.isFinal) continue;

      for (const task of list.tasks) {
        const taskDate = new Date(task.createdAt);
        current++;
        if (taskDate < oneWeekAgo) previous++;
      }
    }
  }

  const change = calcChange(current, previous);

  return {
    count: current,
    change: change.value,
    changeType: change.type
  };
}

export async function getPendingTasksStatus(userId: UserSchema["id"]) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(new Date().getDate() - 7);

  const projects = await projectQueries.ownedOrMember(userId);

  let current = 0;
  let previous = 0;

  for (const project of projects) {
    for (const list of project.lists) {
      if (list.isFinal) continue;

      for (const task of list.tasks) {
        const taskDate = new Date(task.createdAt);
        current++;
        if (taskDate < oneWeekAgo) previous++;
      }
    }
  }

  const change = calcChange(current, previous);

  return {
    count: current,
    change: change.value,
    changeType: change.type
  };
}
