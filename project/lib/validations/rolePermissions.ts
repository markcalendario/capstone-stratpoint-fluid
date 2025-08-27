import z from "zod";
import { permissionSchema } from "./permissions";
import { roleSchema } from "./roles";

export const rolePermissionSchema = z.object({
  roleId: roleSchema.shape.id,
  permissionId: permissionSchema.shape.id
});
