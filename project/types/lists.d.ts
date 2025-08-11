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

interface GetListsByProjectIdPayload {
  projectId: ProjectSchema["id"];
}
