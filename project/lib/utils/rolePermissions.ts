"use server";

import { Action } from "@/types/permissions";
import { ProjectSchema } from "@/types/projects";
import { UserSchema } from "@/types/users";
import projectMembersQueries from "../queries/projectMembers";

export async function hasPermission(
  userId: UserSchema["id"],
  projectId: ProjectSchema["id"],
  action: Action
) {
  const user = await projectMembersQueries.getByUserAndProject(
    projectId,
    userId
  );

  // User is not a member or role is missing
  if (!user || !user.role) return false;

  const permissions = user.role.rolePermissions.map(
    (rolePermission) => rolePermission.permission.title
  );

  return permissions.includes(action);
}
