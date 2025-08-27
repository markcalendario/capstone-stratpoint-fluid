"use server";

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

    let permissions: Permissions[];

    const user = await projectMembersQueries.getByUserAndProject(
      parsed.projectId,
      userId
    );

    // If project owner, return all permissions
    if (await isUserProjectOwner(userId, parsed.projectId)) {
      const allPermissions = await permissionsQueries.getAll();
      permissions = allPermissions.map((p) => p.title) as Permissions[];
    }

    // If user is not accepted or has no role, return empty permissions
    else if (!user?.isAccepted || !user.role) {
      permissions = [];
    }

    // If a user has a role, return permissions
    else {
      permissions = user.role.rolePermissions.map(
        (rolePermission) => rolePermission.permission.title
      ) as Permissions[];
    }

    return {
      success: true,
      message: "Permissions retrieved successfully.",
      permissions
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot get permissions." };
  }
}
