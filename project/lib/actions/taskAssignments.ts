"use server";

import {
  GetTaskAssignmentsPayload,
  UpdateTaskAssignmentsPayload
} from "@/types/taskAssignments";
import { ZodError } from "zod";
import taskAssignmentsQueries from "../queries/taskAssignments";
import taskQueries from "../queries/tasks";
import { hasPermission } from "../utils/rolePermissions";
import { getUserId } from "../utils/users";
import {
  getTaskAssignmentsPayloadSchema,
  updateAssignmentPayloadSchema
} from "../validations/taskAssignments";

export async function getTaskAssignments(payload: GetTaskAssignmentsPayload) {
  try {
    const userId = await getUserId();
    const parsed = getTaskAssignmentsPayloadSchema.parse(payload);
    const task = await taskQueries.getTask(parsed.taskId);

    if (!task) return { success: false, message: "Task not found." };

    if (!(await hasPermission(userId, task.list.projectId, "view_task"))) {
      return {
        success: false,
        message: "Unauthorized. Cannot retrieve assigned members."
      };
    }

    const assignments = await taskAssignmentsQueries.getByTask(parsed.taskId);
    const formatted = assignments.map((assignment) => assignment.userId);

    return {
      success: true,
      message: "Task assignments retrieved successfully",
      assignments: formatted
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return {
      success: false,
      message: "Error. Cannot retrieve task assignments."
    };
  }
}

export async function updateTaskAssignment(
  payload: UpdateTaskAssignmentsPayload
) {
  try {
    const userId = await getUserId();
    const parsed = updateAssignmentPayloadSchema.parse(payload);
    const task = await taskQueries.getTask(parsed.taskId);

    if (!task) return { success: false, message: "Task not found." };

    if (!(await hasPermission(userId, task.list.projectId, "edit_task"))) {
      return {
        success: false,
        message: "Unauthorized. Cannot updated assignees."
      };
    }

    await taskAssignmentsQueries.unassignAllByTask(parsed.taskId);

    if (parsed.userIds.length) {
      await taskAssignmentsQueries.assignMany({
        taskId: parsed.taskId,
        userIds: parsed.userIds
      });
    }

    return { success: true, message: "Task assigned successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot assign task." };
  }
}
