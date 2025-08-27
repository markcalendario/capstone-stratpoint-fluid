import { rolePermissions } from "@/lib/db/drizzle/migrations/schema";
import { Permissions } from "./permissions";
import { ProjectSchema } from "./projects";
import { Role } from "./roles";

export interface RolePermissionSchema
  extends InferSelectModel<typeof rolePermissions> {
  role: Role;
  permissions: Permissions;
}

interface RolePermission extends InferSelectModel<typeof rolePermissions> {}

export interface GetPermissionsPayload {
  projectId: ProjectSchema["id"];
}
