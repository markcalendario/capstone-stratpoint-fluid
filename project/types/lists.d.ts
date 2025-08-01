import { lists } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { Task } from "./tasks";

export interface List extends InferSelectModel<typeof lists> {
  tasks: Task[];
}

export type CreateListPayload = Omit<
  List,
  "id" | "tasks" | "createdAt" | "updatedAt"
>;

export type UpdateListPayload = Omit<List, "id" | "tasks" | "createdAt">;
