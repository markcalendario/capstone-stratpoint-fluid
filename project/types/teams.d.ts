import { team } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { ProjectSchema } from "./projects";
import { UserSchema } from "./users";

export interface TeamsSchema extends InferSelectModel<typeof team> {
  project: ProjectSchema;
  user: UserSchema;
}

export interface Team extends InferSelectModel<typeof team> {}

// Query Data

export interface GetNonProjectMembersOptionsData {
  projectId: ProjectSchema["id"];
  name: UserSchema["name"];
}

// Payloads

export interface GetProjectMembersOptionsPayload {
  projectId: ProjectSchema["id"];
}

export interface GetNonProjectMembersOptionsPayload {
  projectId: ProjectSchema["id"];
  name: UserSchema["name"];
}
