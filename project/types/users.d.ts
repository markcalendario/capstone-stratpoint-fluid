import { users } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";

export interface UserSchema extends InferSelectModel<typeof users> {
  imageUrl: string;
}

export type CreateUserData = Pick<UserSchema, "name" | "clerkId" | "email">;

export type UpdateUserData = Pick<UserSchema, "name" | "email" | "updatedAt">;
