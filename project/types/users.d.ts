import { users } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { ProjectSchema } from "./projects";

export interface UserSchema extends InferSelectModel<typeof users> {
  projects: ProjectSchema[];
}

export interface User extends InferSelectModel<typeof users> {}

// Payload Validation

interface EditProfilePayload {
  email: UserSchema["email"];
  lastName: UserSchema["name"];
  firstName: UserSchema["name"];
  newProfileFile: File | null;
}

// Query Validation

export type CreateUserData = Pick<
  UserSchema,
  "name" | "clerkId" | "email" | "imageUrl"
>;

export type UpdateUserData = Pick<
  UserSchema,
  "name" | "email" | "imageUrl" | "updatedAt"
>;
