"use server";

import rolesQueries from "../queries/roles";

export async function getRoleOptions() {
  try {
    const roles = await rolesQueries.getAll();
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
