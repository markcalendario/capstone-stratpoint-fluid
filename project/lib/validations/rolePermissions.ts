import z from "zod";
import { permissionsSchema } from "./permissions";
import { rolesSchema } from "./roles";

export const rolePermissionSchema = z.object({
  roleId: rolesSchema.shape.id,
  permissionId: permissionsSchema.shape.id
});
