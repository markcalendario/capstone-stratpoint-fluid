"use server";

import { Permissions } from "@/types/permissions";
import { ProjectSchema } from "@/types/projects";
import { UserSchema } from "@/types/users";
import permissionsQueries from "../queries/permissions";
import projectMembersQueries from "../queries/projectMembers";
import { isUserProjectOwner } from "./projects";

export async function getPermissions(
  userId: UserSchema["id"],
  projectId: ProjectSchema["id"]
) {
  // Project owner has all permissions
  if (await isUserProjectOwner(userId, projectId)) {
    const permissions = await permissionsQueries.getAll();
    return permissions.map((permission) => permission.title);
  }

  const user = await projectMembersQueries.getByUserAndProject(
    projectId,
    userId
  );

  // If user is not accepted or has no role, return empty permissions
  if (!user?.isAccepted || !user.role) {
    return [];
  }

  return user.role.rolePermissions.map(
    (rolePermission) => rolePermission.permission.title
  );
}

export async function hasPermission(
  userId: UserSchema["id"],
  projectId: ProjectSchema["id"],
  action: Permissions
) {
  const permissions = await getPermissions(userId, projectId);
  return permissions.includes(action);
}
