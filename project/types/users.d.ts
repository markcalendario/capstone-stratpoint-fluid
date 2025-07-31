import { users } from "@/lib/db/drizzle/schema";
import { InferSelectModel } from "drizzle-orm";

export interface UserSchema extends InferSelectModel<typeof users> {
  imageUrl: string;
}

export type User = Omit<
  UserSchema,
  "id" | "clerkId" | "createdAt" | "updatedAt"
>;

export type CreateUserPayload = Pick<UserSchema, "name" | "clerkId" | "email">;

export type UpdateUserPayload = Pick<
  UserSchema,
  "name" | "email" | "updatedAt"
>;
