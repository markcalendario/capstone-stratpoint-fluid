import { ProjectSchema } from "./projects";
import { TaskSchema } from "./tasks";

export interface ChangeTaskDuePayload
  extends Pick<TaskSchema, "id" | "dueDate"> {}

export interface ChangeProjectDuePayload
  extends Pick<ProjectSchema, "id" | "dueDate"> {}

export interface EventResource {
  id: TaskSchema["id"];
  type: "project" | "task";
}
