import { Permissions } from "@/types/permissions";
import { GetPermissionsPayload } from "@/types/rolePermissions";
import { ZodError } from "zod";
import permissionsQueries from "../queries/permissions";
import projectMembersQueries from "../queries/projectMembers";
import { isUserProjectOwner } from "../utils/projects";
import { getUserId } from "../utils/users";
import { getPermissionsPayloadSchema } from "../validations/permissions";

export default async function getPermissions(payload: GetPermissionsPayload) {
  try {
    const userId = await getUserId();
    const parsed = getPermissionsPayloadSchema.parse(payload);

    if (await isUserProjectOwner(userId, parsed.projectId)) {
      const permissions = await permissionsQueries.getAll();
      return permissions.map((permission) => permission.title) as Permissions[];
    }

    const user = await projectMembersQueries.getByUserAndProject(
      parsed.projectId,
      userId
    );

    // If user is not accepted or has no role, return empty permissions
    if (!user?.isAccepted || !user.role) {
      return [];
    }

    return user.role.rolePermissions.map(
      (rolePermission) => rolePermission.permission.title
    ) as Permissions[];
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot get permissions." };
  }
}
