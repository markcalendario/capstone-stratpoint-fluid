"use server";

import { UserSchema } from "@/types/users";
import { ZodError } from "zod";
import userQueries from "../db/queries/users";
import {
  getActiveProjectsStatus,
  getCompletedTasksStatus,
  getPendingTasksStatus,
  getTeamMembersStatus
} from "../utils/analytics";
import { userClerkIdSchema } from "../validations/users";

export async function getDashboardStatus(userClerkId: UserSchema["clerkId"]) {
  try {
    const validUserClerkId = userClerkIdSchema.parse(userClerkId);
    const userId = await userQueries.getIdByClerkId(validUserClerkId);

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
