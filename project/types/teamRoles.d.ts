import { teamRoles } from "@/lib/db/drizzle/migrations/schema";
import { InferSelectModel } from "drizzle-orm";
import { UserSchema } from "./users";

export interface TeamRolesSchema extends InferSelectModel<typeof teamRoles> {}

export interface TeamRoles extends InferSelectModel<typeof teamRoles> {}

export interface UserOption
  extends Pick<UserSchema, "id" | "name" | "imageUrl"> {
  role: {
    id: TeamRoles["id"];
    title: TeamRoles["title"];
  } | null;
}
