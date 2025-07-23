import { users } from "@/lib/db/drizzle/schema";
import { InferSelectModel } from "drizzle-orm";

export type User = InferSelectModel<typeof users>;

export type CreateUserPayload = Omit<User, "createdAt" | "updatedAt">;

export type UpdateUserPayload = Omit<User, "createdAt">;
