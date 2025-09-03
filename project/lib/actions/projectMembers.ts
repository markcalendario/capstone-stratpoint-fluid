"use server";

import {
  AcceptInvitePayload,
  AddProjectMembersPayload,
  DeleteMemberPayload,
  EditProjectMemberRoleData,
  GetNonProjectMembersOptionsPayload,
  GetProjectMemberRolePayload,
  GetProjectMembersOptionsPayload,
  GetProjectMembers as GetProjectMembersPayload,
  InvitationEventData,
  LeaveProjectModal
} from "@/types/projectMembers";
import { UserOption } from "@/types/roles";
import { ZodError } from "zod";
import projectMembersQueries from "../queries/projectMembers";
import projectQueries from "../queries/projects";
import { getTimeDifference } from "../utils/date-and-time";
import { dispatchError, handleDispatchError } from "../utils/dispatch-error";
import { PERMISSION } from "../utils/permission-enum";
import {
  getMembershipStatus,
  MEMBERSHIP_STATUS
} from "../utils/projectMembers";
import {
  getProjectOwner,
  getProjectOwnerId,
  isUserProjectOwner
} from "../utils/projects";
import pusher from "../utils/pusher";
import { EVENTS } from "../utils/pusher-client";
import { hasPermission } from "../utils/rolePermissions";
import { unassignUserToProjectTasks } from "../utils/tasks";
import { getClerkIdByUserId, getUserId } from "../utils/users";
import {
  acceptInvitePayloadSchema,
  addProjectMembersPayloadSchema,
  denyInvitePayloadSchema,
  editProjectMemberRoleSchema,
  getNonProjectMembersOptionsPayloadSchema,
  getProjectMembersOptionsPayloadSchema,
  getProjectMembersPayloadSchema,
  getProjectMembersRoleSchema,
  leaveProjectPayloadSchema,
  removeProjectMemberPayloadSchema
} from "../validations/projectMembers";

export async function getProjectMembersOptions(
  payload: GetProjectMembersOptionsPayload
) {
  try {
    const parsed = getProjectMembersOptionsPayloadSchema.parse(payload);
    const userId = await getUserId();

    const isPermitted = await hasPermission(
      userId,
      parsed.projectId,
      PERMISSION.VIEW_PROJECT_MEMBER
    );

    if (!isPermitted) return dispatchError(401);

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
    if (!owner) return dispatchError(404);

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

    const isPermitted = await hasPermission(
      userId,
      parsed.projectId,
      PERMISSION.VIEW_PROJECT_MEMBER
    );

    if (!isPermitted) return dispatchError(401);

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
    handleDispatchError(error);
  }
}

export async function addProjectMembers(payload: AddProjectMembersPayload) {
  try {
    const userId = await getUserId();
    const parsed = addProjectMembersPayloadSchema.parse(payload);

    const isPermitted = await hasPermission(
      userId,
      parsed.projectId,
      PERMISSION.CREATE_PROJECT_MEMBER
    );

    if (!isPermitted) return dispatchError(401);

    for (const member of parsed.members) {
      const data = { projectId: parsed.projectId, ...member };
      await projectMembersQueries.addMember(data);

      const project = await projectQueries.get(parsed.projectId);
      const userClerkId = await getClerkIdByUserId(member.userId);

      const message = `You have an invitation to join in ${project?.name}.`;
      const eventData = { message } satisfies InvitationEventData;
      await pusher.trigger(userClerkId, EVENTS.INVITATION, eventData);
    }

    return {
      success: true,
      message: `${parsed.members.length} users invited to the team.`
    };
  } catch (error) {
    handleDispatchError(error);
  }
}

export async function getProjectMembers(payload: GetProjectMembersPayload) {
  // Retrieves all members including those who are declined or current invited
  try {
    const userId = await getUserId();
    const parsed = getProjectMembersPayloadSchema.parse(payload);

    const isPermitted = await hasPermission(
      userId,
      parsed.projectId,
      PERMISSION.VIEW_PROJECT_MEMBER
    );

    if (!isPermitted) return dispatchError(401);

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
        role: projectMember.role.title,
        membershipStatus: getMembershipStatus(isAccepted),
        projectsCount: projectsMemberOf + projectsOwned,
        tasksDoneCount,
        tasksUndoneCount
      };
    });

    // Include owner

    const ownerRole = "Project Owner";
    const owner = await getProjectOwner(parsed.projectId);
    if (!owner) return dispatchError(400);

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
    handleDispatchError(error);
  }
}

export async function removeProjectMember(payload: DeleteMemberPayload) {
  try {
    const userId = await getUserId();
    const parsed = removeProjectMemberPayloadSchema.parse(payload);

    const isPermitted = await hasPermission(
      userId,
      parsed.projectId,
      PERMISSION.DELETE_PROJECT_MEMBER
    );

    if (!isPermitted) return dispatchError(401);

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

    await projectMembersQueries.removeTeamMember(parsed);

    await unassignUserToProjectTasks(parsed.userId, parsed.projectId);

    return {
      success: true,
      message: "User removed successfully."
    };
  } catch (error) {
    handleDispatchError(error);
  }
}

export async function getProjectMemberRole(
  payload: GetProjectMemberRolePayload
) {
  // Retrieves the roles of members regardless of their membership status
  try {
    const userId = await getUserId();
    const parsed = getProjectMembersRoleSchema.parse(payload);

    const isPermitted = await hasPermission(
      userId,
      parsed.projectId,
      PERMISSION.VIEW_PROJECT_MEMBER
    );

    if (!isPermitted) return dispatchError(401);

    const member = await projectMembersQueries.getByUserAndProject(
      parsed.projectId,
      parsed.userId
    );

    if (!member) return dispatchError(404);

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
    handleDispatchError(error);
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
        message: "You cannot edit the role of project owner."
      };
    }

    const isPermitted = await hasPermission(
      userId,
      parsed.projectId,
      PERMISSION.EDIT_PROJECT_MEMBER
    );

    if (!isPermitted) return dispatchError(401);

    await projectMembersQueries.editMemberRole(parsed);

    return {
      success: true,
      message: "Role edited successfully."
    };
  } catch (error) {
    handleDispatchError(error);
  }
}

export async function getInvites() {
  // Retrieves all invitations where user hasn't responded yet. (isAccepted === null)
  try {
    const userId = await getUserId();
    const invites = await projectMembersQueries.getByUserId(userId);

    const formatted = invites
      .filter((invite) => invite.isAccepted === null)
      .map((invite) => ({
        id: invite.id,
        role: invite.role.title,
        isAccepted: invite.isAccepted,
        projectName: invite.project.name,
        projectImage: invite.project.imageUrl,
        inviteElapsedTime: getTimeDifference(invite.invitedAt)
      }));

    return {
      success: true,
      message: "Invites retrieved successfully.",
      invites: formatted
    };
  } catch (error) {
    handleDispatchError(error);
  }
}

export async function acceptInvite(payload: AcceptInvitePayload) {
  try {
    const parsed = acceptInvitePayloadSchema.parse(payload);
    await projectMembersQueries.acceptInvite(parsed.id);
    return { success: true, message: "Project invitation has been accepted." };
  } catch (error) {
    handleDispatchError(error);
  }
}

export async function denyInvite(payload: AcceptInvitePayload) {
  try {
    const parsed = denyInvitePayloadSchema.parse(payload);
    await projectMembersQueries.denyInvite(parsed.id);
    return { success: true, message: "Project invitation has been denied." };
  } catch (error) {
    handleDispatchError(error);
  }
}

export async function leaveProject(payload: LeaveProjectModal) {
  try {
    const userId = await getUserId();
    const parsed = leaveProjectPayloadSchema.parse(payload);

    await projectMembersQueries.removeTeamMember({
      userId,
      projectId: parsed.projectId
    });

    await unassignUserToProjectTasks(userId, parsed.projectId);

    return { success: true, message: "You successfully left the project." };
  } catch (error) {
    handleDispatchError(error);
  }
}
