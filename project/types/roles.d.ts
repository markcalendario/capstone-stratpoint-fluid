import { roles } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { UserSchema } from "./users";

export interface RolesSchema extends InferSelectModel<typeof roles> {}

export interface Roles extends InferSelectModel<typeof roles> {}

export interface UserOption
  extends Pick<UserSchema, "id" | "name" | "imageUrl"> {
  role: Pick<Roles, "id" | "title"> | null;
}
