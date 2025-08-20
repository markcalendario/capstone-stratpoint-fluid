"use server";

import {
  getActiveProjectsStatus,
  getCompletedTasksStatus,
  getPendingTasksStatus,
  getProjectMembersStatus
} from "@/lib/utils/analytics";
import { getUserId } from "@/lib/utils/users";
import { ZodError } from "zod";

export async function getDashboardStatus() {
  try {
    const userId = await getUserId();

    const [activeProjects, projectMembers, completedTasks, pendingTasks] =
      await Promise.all([
        getActiveProjectsStatus(userId),
        getProjectMembersStatus(userId),
        getCompletedTasksStatus(userId),
        getPendingTasksStatus(userId)
      ]);

    return {
      success: true,
      message: "Dashboard status retrieved successfully",
      status: { projectMembers, pendingTasks, activeProjects, completedTasks }
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot get dashboard status." };
  }
}
