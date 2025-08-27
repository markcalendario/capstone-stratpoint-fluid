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
): Promise<Permissions[]> {
  const isOwner = await isUserProjectOwner(userId, projectId);

  if (isOwner) {
    const allPermissions = await permissionsQueries.getAll();
    return allPermissions.map((p) => p.title) as Permissions[];
  }

  const member = await projectMembersQueries.getByUserAndProject(
    projectId,
    userId
  );

  const hasValidRole = member?.isAccepted && member.role;
  if (!hasValidRole) return [];

  return member.role.rolePermissions.map(
    (rp) => rp.permission.title
  ) as Permissions[];
}

export async function hasPermission(
  userId: UserSchema["id"],
  projectId: ProjectSchema["id"],
  action: Permissions
) {
  const permissions = await getPermissions(userId, projectId);
  return permissions.includes(action);
}
