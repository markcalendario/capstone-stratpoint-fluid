import { projects } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { ListSchema } from "./lists";
import { Teams } from "./teams";

export interface ProjectSchema extends InferSelectModel<typeof projects> {
  lists: ListSchema[];
  teams: Teams[];
}

type Project = InferSelectModel<typeof projects>;

// Queries Data

export type CreateProjectData = Pick<
  ProjectSchema,
  "name" | "description" | "dueDate" | "ownerId"
>;

interface CreateProjectPayload
  extends Pick<ProjectSchema, "name" | "description" | "dueDate"> {}

export type UpdateProjectData = Pick<
  ProjectSchema,
  "name" | "description" | "dueDate" | "ownerId" | "updatedAt"
>;

// Payloads

interface UpdateProjectPayload
  extends Pick<ProjectSchema, "name" | "dueDate" | "description"> {
  projectId: ProjectSchema["id"];
}

interface DeleteProjectPayload {
  id: ProjectSchema["id"];
}

export interface GetProjectPayload {
  id: ProjectSchema["id"];
}

// Misc

interface ProjectCard
  extends Pick<ProjectSchema, "id" | "name" | "description" | "dueDate"> {
  members: number;
  progress: number;
}

export interface ProjectOption extends Pick<ProjectSchema, "id" | "name"> {}

interface GetProjectOptionsPayload {
  name: ProjectSchema["name"];
}
