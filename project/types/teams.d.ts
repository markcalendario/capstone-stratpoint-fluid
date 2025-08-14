import { teams } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { ProjectSchema } from "./projects";
import { UserSchema } from "./users";

export interface TeamsSchema extends InferSelectModel<typeof teams> {
  project: ProjectSchema;
  user: UserSchema;
}

export interface Team extends InferSelectModel<typeof teams> {}

// Query Data

export interface GetNonProjectMembersOptionsData {
  projectId: ProjectSchema["id"];
  name: UserSchema["name"];
}

export interface AddMemberData {
  projectId: ProjectSchema["id"];
  userId: UserSchema["id"];
  roleId: UserSchema["id"];
}

// Payloads

export interface GetProjectMembersOptionsPayload {
  projectId: ProjectSchema["id"];
}

export interface GetNonProjectMembersOptionsPayload {
  projectId: ProjectSchema["id"];
  name: UserSchema["name"];
}

interface AddTeamMembersPayload {
  projectId: ProjectSchema["id"];
  members: {
    userId: UserSchema["id"];
    roleId: TeamRoles["id"];
  }[];
}

export interface GetProjectMembers {
  projectId: ProjectSchema["id"];
}
