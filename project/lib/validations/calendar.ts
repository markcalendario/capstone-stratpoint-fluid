import z from "zod";
import { projectSchema } from "./projects";
import { taskSchema } from "./tasks";

export const changeTaskDuePayloadSchema = z.object({
  id: taskSchema.shape.id,
  dueDate: taskSchema.shape.dueDate
});

export const changeProjectDuePayloadSchema = z.object({
  id: projectSchema.shape.id,
  dueDate: projectSchema.shape.dueDate
});
