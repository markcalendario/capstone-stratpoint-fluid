"use server";

import {
  AcceptInvitePayload,
  AddProjectMembersPayload,
  DeleteMemberPayload,
  EditProjectMemberRoleData,
  GetNonProjectMembersOptionsPayload,
  GetProjectMemberRolePayload,
  GetProjectMembersOptionsPayload,
  GetProjectMembers as GetProjectMembersPayload
} from "@/types/projectMembers";
import { UserOption } from "@/types/roles";
import { ZodError } from "zod";
import projectMembersQueries from "../queries/projectMembers";
import { getTimeDifference } from "../utils/date-and-time";
import {
  getMembershipStatus,
  MEMBERSHIP_STATUS
} from "../utils/projectMembers";
import {
  getProjectOwner,
  getProjectOwnerId,
  isUserProjectOwner
} from "../utils/projects";
import { hasPermission } from "../utils/rolePermissions";
import { getUserId } from "../utils/users";
import {
  acceptInvitePayloadSchema,
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

    if (
      !(await hasPermission(userId, parsed.projectId, "view_project_member"))
    ) {
      return {
        success: false,
        message: "Unauthorized. Cannot retrieve members options."
      };
    }

    const members = await projectMembersQueries.getAcceptedByProject(
      parsed.projectId
    );
    const formatted = members.map((member) => {
      return {
        id: member.user.id,
        name: member.user.name,
        imageUrl: member.user.imageUrl
      };
    });

    // Include owner
    const owner = await getProjectOwner(parsed.projectId);

    if (!owner) {
      return { success: false, message: "Cannot find project owner." };
    }

    formatted.push({
      id: owner.id,
      name: owner.name,
      imageUrl: owner.imageUrl
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

    if (
      !(await hasPermission(userId, parsed.projectId, "view_project_member"))
    ) {
      return {
        success: false,
        message: "Unauthorized. Cannot retrieve members options."
      };
    }

    const nonMembers =
      await projectMembersQueries.getNonProjectMembersOptions(parsed);

    // Excluse owner
    const ownerId = await getProjectOwnerId(parsed.projectId);
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
    const userId = await getUserId();
    const parsed = addProjectMembersPayloadSchema.parse(payload);

    if (
      !(await hasPermission(userId, parsed.projectId, "create_project_member"))
    ) {
      return { success: false, message: "Unauthorized. Cannot add members." };
    }

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
    const userId = await getUserId();
    const parsed = getProjectMembersPayloadSchema.parse(payload);
    const projectMembers = await projectMembersQueries.getByProject(
      parsed.projectId
    );

    if (
      !(await hasPermission(userId, parsed.projectId, "view_project_member"))
    ) {
      return {
        success: false,
        message: "Unauthorized. Cannot retrieve project members."
      };
    }

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
        role: projectMember.role.title,
        membershipStatus: getMembershipStatus(isAccepted),
        projectsCount: projectsMemberOf + projectsOwned,
        tasksDoneCount,
        tasksUndoneCount
      };
    });

    // Include owner

    const owner = await getProjectOwner(parsed.projectId);
    const ownerRole = "Project Owner";

    if (!owner) {
      return { success: false, message: "Cannot find project owner." };
    }

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
    const userId = await getUserId();
    const parsed = removeProjectMemberPayloadSchema.parse(payload);

    // Return when owner is being deleted
    if (await isUserProjectOwner(parsed.userId, parsed.projectId)) {
      return {
        success: false,
        message: "You cannot remove the project owner."
      };
    }

    // If user is trying to remove his record
    if (parsed.userId === userId) {
      return { success: false, message: "You cannot remove yourself." };
    }

    if (
      !(await hasPermission(userId, parsed.projectId, "delete_project_member"))
    ) {
      return {
        success: false,
        message: "Unauthorized. Cannot remove members."
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
    const userId = await getUserId();
    const parsed = getProjectMembersRoleSchema.parse(payload);

    if (
      !(await hasPermission(userId, parsed.projectId, "view_project_member"))
    ) {
      return {
        success: false,
        message: "Unauthorized. Cannot retrieve project member roles."
      };
    }

    const member = await projectMembersQueries.getByUserAndProject(
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
        id: member.role.id,
        title: member.role.title
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
    const userId = await getUserId();
    const parsed = editProjectMemberRoleSchema.parse(payload);

    // Return when owner's role is being edited
    if (await isUserProjectOwner(parsed.userId, parsed.projectId)) {
      return {
        success: false,
        message: "You cannot edit the project owner."
      };
    }

    if (
      !(await hasPermission(userId, parsed.projectId, "edit_project_member"))
    ) {
      return { success: false, message: "Unauthorized. Cannot edit members." };
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

export async function getInvites() {
  try {
    // Retrieves all invites regardless of the invite status
    const userId = await getUserId();
    const invites = await projectMembersQueries.getByUserId(userId);

    const formatted = invites.map((invite) => ({
      id: invite.id,
      isAccepted: invite.isAccepted,
      projectName: invite.project.name,
      inviteElapsedTime: getTimeDifference(invite.invitedAt)
    }));

    return {
      success: true,
      message: "Invites retrieved successfully.",
      invites: formatted
    };
  } catch {
    return { success: false, message: "Error. Cannot retrieve invitations." };
  }
}

export async function acceptInvite(payload: AcceptInvitePayload) {
  try {
    const parsed = acceptInvitePayloadSchema.parse(payload);
    await projectMembersQueries.acceptInvite(parsed.id);
    return { success: false, message: "Project invitation has been accepted." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot accept invite." };
  }
}
