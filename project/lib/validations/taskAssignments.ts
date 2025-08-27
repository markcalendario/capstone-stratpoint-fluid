import z from "zod";
import { taskSchema } from "./tasks";
import { userSchema } from "./users";

const taskAssignmentSchema = z.object({
  id: z.uuidv4("Task assignment ID must be UUID.").trim(),
  taskId: taskSchema.shape.id,
  userId: userSchema.shape.id,
  assignedAt: z.iso.datetime("Invalid date for assigned date.").trim()
});

// Payload Validation

export const getTaskAssignmentsPayloadSchema = z.object({
  taskId: taskAssignmentSchema.shape.taskId
});

export const updateAssignmentPayloadSchema = z.object({
  taskId: taskAssignmentSchema.shape.taskId,
  userIds: taskAssignmentSchema.shape.userId.array()
});
