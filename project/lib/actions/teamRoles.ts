"use server";

import teamRolesQueries from "../queries/teamRoles";

export async function getTeamRolesOptions() {
  try {
    const roles = await teamRolesQueries.getAll();
    const formatted = roles.map((r) => ({ id: r.id, title: r.title }));
    return {
      success: true,
      message: "Roles retrieved successfully.",
      roles: formatted
    };
  } catch {
    return {
      success: false,
      message: "Error. Cannot retrieve roles.",
      roles: []
    };
  }
}
