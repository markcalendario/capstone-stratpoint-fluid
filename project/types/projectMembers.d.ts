import { projectMembers } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { ProjectSchema } from "./projects";
import { Role } from "./roles";
import { UserSchema } from "./users";

export interface ProjectMemberSchema
  extends InferSelectModel<typeof projectMembers> {
  project: ProjectSchema;
  user: UserSchema;
}

export interface ProjectMember
  extends InferSelectModel<typeof projectMembers> {}

// Query Data

export interface GetNonProjectMembersOptionsData {
  projectId: ProjectSchema["id"];
  name: UserSchema["name"];
}

export interface AddProjectMemberData {
  projectId: ProjectSchema["id"];
  userId: UserSchema["id"];
  roleId: UserSchema["id"];
}

export interface RemoveProjectMemberData {
  projectId: ProjectSchema["id"];
  userId: UserSchema["id"];
}

export interface EditProjectMemberRoleData {
  projectId: ProjectSchema["id"];
  userId: UserSchema["id"];
  roleId: Role["id"];
}

// Payloads

export interface GetProjectMembersOptionsPayload {
  projectId: ProjectSchema["id"];
}

export interface GetNonProjectMembersOptionsPayload {
  projectId: ProjectSchema["id"];
  name: UserSchema["name"];
}

interface AddProjectMembersPayload {
  projectId: ProjectSchema["id"];
  members: {
    userId: UserSchema["id"];
    roleId: Role["id"] | null;
  }[];
}

export interface GetProjectMembers {
  projectId: ProjectSchema["id"];
}

export interface DeleteMemberPayload {
  projectId: ProjectSchema["id"];
  userId: UserSchema["id"];
}

export interface EditProjectMemberRolePayload {
  projectId: ProjectSchema["id"];
  userId: UserSchema["id"];
  roleId: Role["id"];
}

export interface GetProjectMemberRolePayload {
  projectId: ProjectSchema["id"];
  userId: UserSchema["id"];
}

export interface AcceptInvitePayload {
  id: ProjectMember["id"];
}

export interface InvitationEventData {
  message: string;
}
