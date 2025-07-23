import { projects } from "@/lib/db/drizzle/schema";
import { InferSelectModel } from "drizzle-orm";
import { List } from "./lists";

export interface Project extends InferSelectModel<typeof projects> {
  lists: List[];
}

export type CreateProjectPayload = Omit<
  Project,
  "lists" | "createdAt" | "updatedAt"
>;

export type UpdateProjectPayload = Omit<Project, "lists" | "createdAt">;
