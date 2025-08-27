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

export interface CreateProjectData
  extends Pick<
    ProjectSchema,
    "name" | "description" | "dueDate" | "ownerId" | "projectType"
  > {
  imageUrl?: ProjectSchema["imageUrl"];
}

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

export interface GetProjectEditDataPayload {
  id: ProjectSchema["id"];
}

export interface GetProjectSlugPayload {
  id: ProjectSchema["id"];
}

export interface GetProjectOptionsPayload {
  name: ProjectSchema["name"];
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

export interface ProjectOption
  extends Pick<ProjectSchema, "id" | "name" | "imageUrl" | "projectType"> {}

export interface ProjectInfo
  extends Pick<
    ProjectSchema,
    "id" | "name" | "dueDate" | "imageUrl" | "projectType" | "description"
  > {
  memberImages: string[];
  ownerImage: UserSchema["imageUrl"];
}
