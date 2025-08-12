import { lists } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { TaskSchema } from "./tasks";

export interface ListSchema extends InferSelectModel<typeof lists> {
  tasks: TaskSchema[];
}

export interface List extends InferSelectModel<typeof lists> {}

export interface CreateListData
  extends Pick<ListSchema, "name" | "isFinal" | "projectId" | "createdBy"> {}

export interface UpdateListData
  extends Pick<ListSchema, "name" | "isFinal" | "updatedAt"> {}

// Payloads

export interface GetProjectListsPayload {
  projectId: ProjectSchema["id"];
}

export interface UpdateListPayload
  extends Pick<ListSchema, "id" | "name" | "isFinal"> {}

export interface GetListPayload {
  id: ListSchema["id"];
}

export interface CreateListPayload
  extends Pick<ListSchema, "name" | "isFinal" | "projectId"> {}

export interface DeleteListPayload {
  id: ListSchema["id"];
}
