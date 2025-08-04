import { projects } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { List } from "./lists";
import { Teams } from "./teams";

export interface Project extends InferSelectModel<typeof projects> {
  lists: List[];
  teams: Teams[];
}

export type CreateProjectData = Pick<
  Project,
  "name" | "description" | "dueDate" | "ownerId"
>;

export type UpdateProjectPayload = Omit<Project, "id" | "lists" | "createdAt">;

interface ProjectCard
  extends Pick<Project, "id" | "name" | "description" | "dueDate"> {
  members: number;
  progress: number;
}
