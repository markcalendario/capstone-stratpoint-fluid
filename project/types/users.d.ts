import { users } from "@/lib/db/drizzle/schema";
import { InferSelectModel } from "drizzle-orm";

export type UserSchema = InferSelectModel<typeof users>;

export type User = Omit<
  UserSchema,
  "id" | "clerkId" | "createdAt" | "updatedAt"
>;

export type CreateUserPayload = Omit<
  UserSchema,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateUserPayload = Omit<
  UserSchema,
  "id" | "clerkId" | "createdAt"
>;
