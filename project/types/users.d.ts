import { users } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";

export interface UserSchema extends InferSelectModel<typeof users> {
  imageUrl: string;
}

export type CreateUserPayload = Pick<UserSchema, "name" | "clerkId" | "email">;

export type UpdateUserPayload = Pick<
  UserSchema,
  "name" | "email" | "updatedAt"
>;
