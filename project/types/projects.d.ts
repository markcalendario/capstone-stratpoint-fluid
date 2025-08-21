import { projects } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { ListSchema } from "./lists";
import { ProjectMember } from "./projectMembers";
import { UserSchema } from "./users";

export interface ProjectSchema extends InferSelectModel<typeof projects> {
  lists: ListSchema[];
  projectMembers: ProjectMember[];
}

type Project = InferSelectModel<typeof projects>;

// Queries Data

export type CreateProjectData = Pick<
  ProjectSchema,
  "name" | "description" | "dueDate" | "ownerId" | "imageUrl" | "projectType"
>;

export interface UpdateProjectData
  extends Pick<
    ProjectSchema,
    "name" | "description" | "dueDate" | "ownerId" | "updatedAt" | "projectType"
  > {
  imageUrl?: ProjectSchema["imageUrl"];
}

// Payloads

export interface CreateProjectPayload
  extends Pick<ProjectSchema, "name" | "description" | "dueDate"> {
  projectType: string;
  image: File | null;
}

interface UpdateProjectPayload
  extends Pick<ProjectSchema, "name" | "dueDate" | "description"> {
  projectId: ProjectSchema["id"];
  projectType: string;
  image: File | null;
}

interface DeleteProjectPayload {
  id: ProjectSchema["id"];
}

export interface GetProjectPayload {
  id: ProjectSchema["id"];
}

// Misc

export interface ProjectCardData
  extends Pick<ProjectSchema, "id" | "name" | "description" | "imageUrl"> {
  isActive: boolean;
  openTasks: number;
  isOverdue: boolean;
  daysRemaining: string;
  progress: number; // In Percent
  memberImages: UserSchema["imageUrl"][];
  projectType: ProjectSchema["projectType"];
}

export interface ProjectOption extends Pick<ProjectSchema, "id" | "name"> {}

interface GetProjectOptionsPayload {
  name: ProjectSchema["name"];
}
