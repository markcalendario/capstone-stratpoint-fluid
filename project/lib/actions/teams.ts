"use server";

import { GetProjectMembersOptionsPayload } from "@/types/teams";
import { ZodError } from "zod";
import projectQueries from "..//queries/projects";
import teamQueries from "..//queries/team";
import { isUserProjectOwner } from "../utils/projects";
import { getUserId } from "../utils/users";
import { getProjectMembersOptionsPayloadSchema } from "../validations/teams";

export async function getProjectMembersOptions(
  payload: GetProjectMembersOptionsPayload
) {
  try {
    const parsed = getProjectMembersOptionsPayloadSchema.parse(payload);
    const userId = await getUserId();

    if (!(await isUserProjectOwner(userId, parsed.projectId))) {
      return { success: false, message: "You are not the project owner." };
    }

    const members = await teamQueries.getByProject(parsed.projectId);
    const formatted = members.map((m) => {
      return {
        id: m.user.id,
        name: m.user.name,
        imageUrl: m.user.imageUrl
      };
    });

    // Include owner

    const user = await projectQueries.getOwner(parsed.projectId);

    formatted.push({
      id: user.id,
      name: user.name,
      imageUrl: user.imageUrl
    });

    return {
      success: true,
      message: "Project members retrieved successfully.",
      members: formatted
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return {
      success: false,
      message: "Error. Cannot retrieve project members."
    };
  }
}
