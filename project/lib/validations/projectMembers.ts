import z from "zod";
import { projectSchema } from "./projects";
import { teamRolesSchema } from "./teamRoles";
import { userSchema } from "./users";

export const projectMembersSchema = z.object({
  id: z.uuidv4("Team ID must be UUID."),
  userId: userSchema.shape.id,
  projectId: projectSchema.shape.id,
  isAccepted: z.boolean("Field 'isAccepted' must be a boolean."),
  invitedAt: z.iso.datetime("Field 'invitedAt' must be datetime."),
  acceptedAt: z.iso.datetime("Field 'acceptedAt' must be datetime.")
});

// Payload Validations

export const getProjectMembersOptionsPayloadSchema = z.object({
  projectId: projectMembersSchema.shape.projectId
});

export const getNonProjectMembersOptionsPayloadSchema = z.object({
  projectId: projectMembersSchema.shape.projectId,
  name: userSchema.shape.name
});

export const addProjectMembersPayloadSchema = z.object({
  projectId: projectMembersSchema.shape.projectId,
  members: z
    .array(
      z.object({
        userId: projectMembersSchema.shape.userId,
        roleId: teamRolesSchema.shape.id
      }),
      "Members must contain ID and role ID."
    )
    .min(1, "Select at least 1 user to add as a project member.")
});

export const getProjectMembersPayloadSchema = z.object({
  projectId: projectMembersSchema.shape.projectId
});

export const removeProjectMemberPayloadSchema = z.object({
  userId: userSchema.shape.id,
  projectId: projectSchema.shape.id
});

export const editProjectMemberRoleSchema = z.object({
  userId: userSchema.shape.id,
  projectId: projectSchema.shape.id,
  roleId: teamRolesSchema.shape.id
});

export const getProjectMembersRoleSchema = z.object({
  projectId: projectSchema.shape.id,
  userId: userSchema.shape.id
});
