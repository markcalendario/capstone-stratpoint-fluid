"use server";

import {
  GetTaskAssignmentsPayload,
  UpdateTaskAssignmentsPayload
} from "@/types/taskAssignments";
import { ZodError } from "zod";
import taskAssignmentsQueries from "../queries/taskAssignments";
import {
  getTaskAssignmentsPayloadSchema,
  updateAssignmentPayloadSchema
} from "../validations/taskAssignments";

export async function getTaskAssignments(payload: GetTaskAssignmentsPayload) {
  try {
    const parsed = getTaskAssignmentsPayloadSchema.parse(payload);
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
    const parsed = updateAssignmentPayloadSchema.parse(payload);
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
