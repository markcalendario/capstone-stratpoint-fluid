import { lists } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { TaskSchema } from "./tasks";

export interface ListSchema extends InferSelectModel<typeof lists> {
  tasks: TaskSchema[];
}

export type CreateListData = Pick<
  ListSchema,
  "name" | "position" | "isFinal" | "projectId"
>;

export type UpdateListPayload = Pick<
  ListSchema,
  "name" | "position" | "isFinal" | "projectId" | "updatedAt"
>;
