"use server";

import {
  AddTeamMembersPayload,
  GetNonProjectMembersOptionsPayload,
  GetProjectMembers,
  GetProjectMembersOptionsPayload
} from "@/types/teams";
import { ZodError } from "zod";
import projectQueries from "..//queries/projects";
import teamQueries from "..//queries/team";
import { isUserProjectOwner } from "../utils/projects";
import { getMembershipStatus, MEMBERSHIP_STATUS } from "../utils/teams";
import { getUserId } from "../utils/users";
import {
  addTeamMembersPayloadSchema,
  getNonProjectMembersOptionsPayloadSchema,
  getProjectMembersOptionsPayloadSchema,
  getProjectMembersPayloadSchema
} from "../validations/teams";

export async function getProjectMembersOptions(
  payload: GetProjectMembersOptionsPayload
) {
  try {
    const parsed = getProjectMembersOptionsPayloadSchema.parse(payload);
    const userId = await getUserId();

    if (!(await isUserProjectOwner(userId, parsed.projectId))) {
      return { success: false, message: "You are not the project owner." };
    }

    // TODO: Exclude declined and null isAccepted users from showing to options
    const members = await teamQueries.getByProject(parsed.projectId);
    const formatted = members.map((member) => {
      return {
        id: member.id,
        name: member.name,
        imageUrl: member.imageUrl
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

export async function getProjectNonMembersOptions(
  payload: GetNonProjectMembersOptionsPayload
) {
  try {
    const parsed = getNonProjectMembersOptionsPayloadSchema.parse(payload);
    const userId = await getUserId();

    if (!(await isUserProjectOwner(userId, parsed.projectId))) {
      return { success: false, message: "You are not the project owner." };
    }

    const nonMembers = await teamQueries.getNonProjectMembersOptions(parsed);

    // Excluse owner
    const ownerId = await projectQueries.getOwnerId(parsed.projectId);
    const excludedOwner = nonMembers
      .filter((nonMember) => nonMember.id !== ownerId)
      .slice(0, 5);

    const formatted = excludedOwner.map((m) => {
      return { id: m.id, name: m.name, imageUrl: m.imageUrl };
    });

    return {
      success: true,
      message: "Non project members retrieved successfully.",
      nonMembers: formatted
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return {
      success: false,
      message: "Error. Cannot retrieve non project members."
    };
  }
}

export async function addTeamMembers(payload: AddTeamMembersPayload) {
  try {
    const parsed = addTeamMembersPayloadSchema.parse(payload);

    for (const member of parsed.members) {
      const data = { projectId: parsed.projectId, ...member };
      await teamQueries.addMember(data);
    }

    return {
      success: true,
      message: `${parsed.members.length} user(s) added to team.`
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot add team members." };
  }
}

export async function getProjectMembers(payload: GetProjectMembers) {
  try {
    const parsed = getProjectMembersPayloadSchema.parse(payload);
    const members = await teamQueries.getByProject(parsed.projectId);

    const formatted = members.map((member) => {
      const role =
        member.teams.find((team) => team.userId === member.id)?.teamRole
          .title ?? "No Role";

      const tasksDoneCount = member.taskAssignments.filter(
        (assignment) => assignment.task.list.isFinal
      ).length;

      const tasksUndoneCount = member.taskAssignments.filter(
        (assignment) => !assignment.task.list.isFinal
      ).length;

      const isAccepted = member.teams.find((teams) => {
        return teams.projectId === parsed.projectId;
      })?.isAccepted;

      return {
        id: member.id,
        name: member.name,
        email: member.email,
        imageUrl: member.imageUrl,
        projectsCount: member.teams.filter((team) => team.isAccepted).length,
        membershipStatus: getMembershipStatus(isAccepted),
        role,
        tasksDoneCount,
        tasksUndoneCount
      };
    });

    // Include owner

    const owner = await projectQueries.getOwner(parsed.projectId);
    const ownerRole = "Project Owner";

    const ownerTasksDoneCount = owner.taskAssignments.filter(
      (assignment) => !assignment.task.list.isFinal
    ).length;

    const ownerTasksUndoneCount = owner.taskAssignments.filter(
      (assignment) => assignment.task.list.isFinal
    ).length;

    formatted.unshift({
      id: owner.id,
      name: owner.name,
      email: owner.email,
      imageUrl: owner.imageUrl,
      membershipStatus: MEMBERSHIP_STATUS.OWNER,
      role: ownerRole,
      projectsCount: owner.teams.length + 1,
      tasksDoneCount: ownerTasksDoneCount,
      tasksUndoneCount: ownerTasksUndoneCount
    });

    return {
      success: true,
      message: "Project members retrieved successfully.",
      members: formatted
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message, members: [] };
    }

    return {
      success: false,
      message: "Error. Cannot retrieve project members.",
      members: []
    };
  }
}
