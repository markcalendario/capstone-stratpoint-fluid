"use server";

import {
  getActiveProjectsStatus,
  getCompletedTasksStatus,
  getPendingTasksStatus,
  getTeamMembersStatus
} from "@/lib/utils/analytics";
import { getUserId } from "@/lib/utils/users";
import { ZodError } from "zod";

export async function getDashboardStatus() {
  try {
    const userId = await getUserId();

    const [activeProjects, teamMembers, completedTasks, pendingTasks] =
      await Promise.all([
        getActiveProjectsStatus(userId),
        getTeamMembersStatus(userId),
        getCompletedTasksStatus(userId),
        getPendingTasksStatus(userId)
      ]);

    return {
      success: true,
      message: "Dashboard status retrieved successfully",
      status: { teamMembers, pendingTasks, activeProjects, completedTasks }
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot get dashboard status." };
  }
}
