import { users } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { ProjectSchema } from "./projects";

export interface UserSchema extends InferSelectModel<typeof users> {
  projects: ProjectSchema[];
}

export interface User extends InferSelectModel<typeof users> {}

export type CreateUserData = Pick<
  UserSchema,
  "name" | "clerkId" | "email" | "imageUrl"
>;

export type UpdateUserData = Pick<
  UserSchema,
  "name" | "email" | "imageUrl" | "updatedAt"
>;
