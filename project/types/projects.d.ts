import { projects } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { ListSchema } from "./lists";
import { Teams } from "./teams";

export interface ProjectSchema extends InferSelectModel<typeof projects> {
  lists: ListSchema[];
  teams: Teams[];
}

export type CreateProjectData = Pick<
  ProjectSchema,
  "name" | "description" | "dueDate" | "ownerId"
>;

export type UpdateProjectPayload = Pick<
  ProjectSchema,
  "name" | "description" | "dueDate" | "ownerId" | "updatedAt"
>;

interface ProjectCard
  extends Pick<ProjectSchema, "id" | "name" | "description" | "dueDate"> {
  members: number;
  progress: number;
}
