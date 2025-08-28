import { TaskSchema } from "./tasks";

export interface ChangeTaskDuePayload
  extends Pick<TaskSchema, "id" | "dueDate"> {}

export interface EventResource {
  id: TaskSchema["id"];
  type: "project" | "task";
}
