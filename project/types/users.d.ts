import { users } from "@/lib/db/drizzle/schema";
import { InferSelectModel } from "drizzle-orm";

export type User = InferSelectModel<typeof users>;

export type CreateUserPayload = Omit<User, "id" | "createdAt" | "updatedAt">;

export type UpdateUserPayload = Omit<User, "id" | "createdAt">;
