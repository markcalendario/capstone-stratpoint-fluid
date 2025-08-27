import { rolePermissions } from "@/lib/db/drizzle/migrations/schema";
import { Permissions } from "./permissions";
import { ProjectSchema } from "./projects";
import { Roles } from "./roles";

export interface RolePermissionSchema
  extends InferSelectModel<typeof rolePermissions> {
  role: Roles;
  permissions: Permissions;
}

interface RolePermission extends InferSelectModel<typeof rolePermissions> {}

export interface GetPermissionsPayload {
  projectId: ProjectSchema["id"];
}
