"use server";

import {
  AddProjectMembersPayload,
  DeleteMemberPayload,
  EditProjectMemberRoleData,
  GetNonProjectMembersOptionsPayload,
  GetProjectMemberRolePayload,
  GetProjectMembersOptionsPayload,
  GetProjectMembers as GetProjectMembersPayload
} from "@/types/projectMembers";
import { UserOption } from "@/types/teamRoles";
import { ZodError } from "zod";
import projectMembersQueries from "../queries/projectMembers";
import projectQueries from "../queries/projects";
import {
  getMembershipStatus,
  MEMBERSHIP_STATUS
} from "../utils/projectMembers";
import { isUserProjectOwner } from "../utils/projects";
import { getUserId } from "../utils/users";
import {
  addProjectMembersPayloadSchema,
  editProjectMemberRoleSchema,
  getNonProjectMembersOptionsPayloadSchema,
  getProjectMembersOptionsPayloadSchema,
  getProjectMembersPayloadSchema,
  getProjectMembersRoleSchema,
  removeProjectMemberPayloadSchema
} from "../validations/projectMembers";

export async function getProjectMembersOptions(
  payload: GetProjectMembersOptionsPayload
) {
  try {
    const parsed = getProjectMembersOptionsPayloadSchema.parse(payload);
    const userId = await getUserId();

    if (!(await isUserProjectOwner(userId, parsed.projectId))) {
      return { success: false, message: "You are not the project owner." };
    }

    const members = await projectMembersQueries.getAccepted(parsed.projectId);
    const formatted = members.map((member) => {
      return {
        id: member.user.id,
        name: member.user.name,
        imageUrl: member.user.imageUrl
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

export async function getNonProjectMembersOptions(
  payload: GetNonProjectMembersOptionsPayload
) {
  try {
    const parsed = getNonProjectMembersOptionsPayloadSchema.parse(payload);
    const userId = await getUserId();

    if (!(await isUserProjectOwner(userId, parsed.projectId))) {
      return { success: false, message: "You are not the project owner." };
    }

    const nonMembers =
      await projectMembersQueries.getNonProjectMembersOptions(parsed);

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

export async function addProjectMembers(payload: AddProjectMembersPayload) {
  try {
    const parsed = addProjectMembersPayloadSchema.parse(payload);

    for (const member of parsed.members) {
      const data = { projectId: parsed.projectId, ...member };
      await projectMembersQueries.addMember(data);
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

export async function getProjectMembers(payload: GetProjectMembersPayload) {
  // Retrieves all members including those who are declined or current invited
  try {
    const parsed = getProjectMembersPayloadSchema.parse(payload);
    const projectMembers = await projectMembersQueries.getByProject(
      parsed.projectId
    );

    const members = projectMembers.map((projectMember) => {
      const { user, isAccepted } = projectMember;

      const getIsProjectTask = (
        assignment: (typeof user.taskAssignments)[number]
      ) => assignment.task.list.projectId === parsed.projectId;

      const tasksDoneCount = user.taskAssignments.filter((assignment) => {
        return getIsProjectTask(assignment) && assignment.task.list.isFinal;
      }).length;

      const tasksUndoneCount = user.taskAssignments.filter((assignment) => {
        return getIsProjectTask(assignment) && !assignment.task.list.isFinal;
      }).length;

      const projectsOwned = user.projectMembers.filter(
        (team) => team.isAccepted
      ).length;

      const projectsMemberOf = user.projects.length;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
        role: projectMember.teamRole.title,
        membershipStatus: getMembershipStatus(isAccepted),
        projectsCount: projectsMemberOf + projectsOwned,
        tasksDoneCount,
        tasksUndoneCount
      };
    });

    // Include owner

    const owner = await projectQueries.getOwner(parsed.projectId);
    const ownerRole = "Project Owner";

    const ownerTasksDoneCount = owner.taskAssignments.filter((assignment) => {
      return (
        assignment.task.list.isFinal &&
        assignment.task.list.projectId === parsed.projectId
      );
    }).length;

    const ownerTasksUndoneCount = owner.taskAssignments.filter((assignment) => {
      return (
        !assignment.task.list.isFinal &&
        assignment.task.list.projectId === parsed.projectId
      );
    }).length;

    const projectsMemberOfCount = owner.projectMembers.length;

    const projectsOwnedCount = owner.projects.length;

    members.unshift({
      id: owner.id,
      name: owner.name,
      email: owner.email,
      imageUrl: owner.imageUrl,
      membershipStatus: MEMBERSHIP_STATUS.OWNER,
      role: ownerRole,
      projectsCount: projectsMemberOfCount + projectsOwnedCount,
      tasksDoneCount: ownerTasksDoneCount,
      tasksUndoneCount: ownerTasksUndoneCount
    });

    return {
      success: true,
      message: "Members retrieved successfully.",
      members
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

export async function removeProjectMember(payload: DeleteMemberPayload) {
  try {
    const parsed = removeProjectMemberPayloadSchema.parse(payload);

    // Return when owner is being deleted
    if (await isUserProjectOwner(parsed.userId, parsed.projectId)) {
      return {
        success: false,
        message: "You cannot remove the project owner."
      };
    }

    await projectMembersQueries.removeTeamMember(parsed);

    return {
      success: true,
      message: "User removed successfully."
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot remove member." };
  }
}

export async function getProjectMemberRole(
  payload: GetProjectMemberRolePayload
) {
  // Retrieves the roles of members regardless of their membership status
  try {
    const parsed = getProjectMembersRoleSchema.parse(payload);
    const member = await projectMembersQueries.getByUser(
      parsed.projectId,
      parsed.userId
    );

    if (!member) {
      return { success: false, message: "Cannot find member." };
    }

    const data = {
      userId: member.userId,
      name: member.user.name,
      projectId: member.projectId,
      imageUrl: member.user.imageUrl,
      role: {
        id: member.teamRole.id,
        title: member.teamRole.title
      } satisfies UserOption["role"]
    };

    return {
      success: true,
      message: "Member role retrieved successfully.",
      member: data
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return {
      success: false,
      message: "Error. Cannot remove member."
    };
  }
}

export async function editProjectMemberRole(
  payload: EditProjectMemberRoleData
) {
  try {
    const parsed = editProjectMemberRoleSchema.parse(payload);

    // Return when owner's role is being edited
    if (await isUserProjectOwner(parsed.userId, parsed.projectId)) {
      return {
        success: false,
        message: "You cannot edit the project owner."
      };
    }

    await projectMembersQueries.editMemberRole(parsed);

    return {
      success: true,
      message: "Role edited successfully."
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Edit role." };
  }
}
