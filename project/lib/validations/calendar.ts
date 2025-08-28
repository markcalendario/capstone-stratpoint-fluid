import z from "zod";
import { taskSchema } from "./tasks";

export const changeTaskDuePayloadSchema = z.object({
  id: taskSchema.shape.id,
  dueDate: taskSchema.shape.dueDate
});
