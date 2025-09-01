import { users } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { ProjectSchema } from "./projects";

export interface UserSchema extends InferSelectModel<typeof users> {
  projects: ProjectSchema[];
}

export interface User extends InferSelectModel<typeof users> {}

// Payload

interface EditProfilePayload {
  email: UserSchema["email"];
  lastName: UserSchema["name"];
  firstName: UserSchema["name"];
  newProfileFile: File | null;
}

interface CreateUserPayload
  extends Pick<UserSchema, "name" | "clerkId" | "email" | "imageUrl"> {}

interface UpdateUserPayload
  extends Pick<UserSchema, "email" | "name" | "updatedAt" | "imageUrl"> {}

interface DeleteUserPayload extends Pick<UserSchema, "clerkId"> {}

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// Query

export type CreateUserData = Pick<
  UserSchema,
  "name" | "clerkId" | "email" | "imageUrl"
>;

export type UpdateUserData = Pick<
  UserSchema,
  "name" | "email" | "imageUrl" | "updatedAt" | "clerkId"
>;
