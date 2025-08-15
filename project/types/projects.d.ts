import { projects } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { ListSchema } from "./lists";
import { Teams } from "./teams";

export interface ProjectSchema extends InferSelectModel<typeof projects> {
  lists: ListSchema[];
  teams: Teams[];
}

type Project = InferSelectModel<typeof projects>;

// Create Project

export type CreateProjectData = Pick<
  ProjectSchema,
  "name" | "description" | "dueDate" | "ownerId"
>;

interface CreateProjectPayload
  extends Pick<ProjectSchema, "name" | "description" | "dueDate"> {}

// Update Project

export type UpdateProjectData = Pick<
  ProjectSchema,
  "name" | "description" | "dueDate" | "ownerId" | "updatedAt"
>;

interface UpdateProjectPayload
  extends Pick<ProjectSchema, "name" | "dueDate" | "description"> {
  projectId: ProjectSchema["id"];
}

// Delete Project

interface DeleteProjectPayload {
  id: ProjectSchema["id"];
}

// Get Project

export interface GetProjectPayload {
  id: ProjectSchema["id"];
}

// Project Card

interface ProjectCard
  extends Pick<ProjectSchema, "id" | "name" | "description" | "dueDate"> {
  members: number;
  progress: number;
}
