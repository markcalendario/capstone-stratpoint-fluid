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
  const previousCount = projects.filter((p) =>
    p.createdAt ? new Date(p.createdAt) < oneWeekAgo : false
  ).length;

  const change = calcChange(currentCount, previousCount);

  return {
    count: currentCount,
    change: change.value,
    changeType: change.type
  };
}

export async function getTeamMembersStatus(userId: UserSchema["id"]) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(new Date().getDate() - 7);

  const projects = await projectQueries.ownedOrMember(userId);

  const currentMembers = new Set(
    projects.flatMap((p) => p.teams.map((m) => m.userId))
  );

  const previousMembers = new Set(
    projects.flatMap((p) =>
      p.teams
        .filter(
          (m) =>
            m.isAccepted && m.invitedAt && new Date(m.invitedAt) < oneWeekAgo
        )
        .map((m) => m.userId)
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
