import { tasks } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { CommentSchema } from "./comments";
import { UserSchema } from "./users";

export interface TaskSchema extends InferSelectModel<typeof tasks> {
  comments: CommentSchema[];
  taskAssignments: UserSchema[];
}

export interface Task extends InferSelectModel<typeof tasks> {}

// Query Data

export interface CreateTaskData
  extends Pick<
    TaskSchema,
    | "description"
    | "dueDate"
    | "listId"
    | "priority"
    | "position"
    | "title"
    | "createdBy"
    | "attachment"
    | "label"
  > {}

export interface UpdateTaskData
  extends Pick<
    TaskSchema,
    | "id"
    | "title"
    | "description"
    | "dueDate"
    | "priority"
    | "updatedAt"
    | "label"
  > {
  attachment?: TaskSchema["attachment"];
}

// Payload

export interface GetListTasksPayload {
  listId: ListSchema["id"];
}

export interface CreateAndAssignTaskPayload
  extends Pick<Task, "listId" | "title" | "description" | "dueDate" | "label"> {
  attachment: File | null;
  priority: string;
  projectId: ProjectSchema["id"];
  assignees: UserSchema["id"][];
}

export interface EditTaskPayload
  extends Pick<Task, "id" | "title" | "label" | "dueDate" | "description"> {
  priority: string;
}

export interface DeleteTaskPayload {
  id: TaskSchema["id"];
  projectId: ProjectSchema["id"];
}

export interface MoveTaskPayload {
  taskId: TaskSchema["id"];
  newListId: ListSchema["id"];
  newPosition: TaskSchema["position"];
}

export interface GetTaskSlugPayload extends Pick<TaskSchema, "id"> {}

export interface GetTaskEditDataPayload extends Pick<TaskSchema, "id"> {}

// Misc

export interface TaskCard
  extends Pick<
    TaskSchema,
    "id" | "title" | "description" | "priority" | "dueDate"
  > {
  assigneesImages: UserSchema["imageUrl"][];
}

export type TaskStatus = {
  name: string;
  Done: number;
  Pending: number;
};
