import { List } from "./lists";
import { ProjectSchema } from "./projects";
import { Task } from "./tasks";

export interface KanbanTask
  extends Pick<
    Task,
    "id" | "title" | "listId" | "priority" | "description" | "label"
  > {
  isDone: boolean;
  isOverdue: boolean;
  remainingDays: string;
  assigneesImages: string[];
  projectId: ProjectSchema["id"];
}

export interface KanbanList
  extends Pick<List, "id" | "name" | "isFinal" | "projectId"> {
  tasksCount: number;
  tasks: KanbanTask[];
}
