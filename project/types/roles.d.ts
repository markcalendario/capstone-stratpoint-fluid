import { roles } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { UserSchema } from "./users";

export interface RoleSchema extends InferSelectModel<typeof roles> {}

export interface Role extends InferSelectModel<typeof roles> {}

export interface UserOption
  extends Pick<UserSchema, "id" | "name" | "imageUrl"> {
  role: Pick<Role, "id" | "title"> | null;
}
