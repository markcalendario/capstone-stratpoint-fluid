import z from "zod";
import { projectSchema } from "./projects";
import { teamRolesSchema } from "./teamRoles";
import { userSchema } from "./users";

export const teamSchema = z.object({
  id: z.uuidv4("Team ID must be UUID."),
  userId: userSchema.shape.id,
  projectId: projectSchema.shape.id,
  isAccepted: z.boolean("Field 'isAccepted' must be a boolean."),
  invitedAt: z.iso.datetime("Field 'invitedAt' must be datetime."),
  acceptedAt: z.iso.datetime("Field 'acceptedAt' must be datetime.")
});

// Payload Validations

export const getProjectMembersOptionsPayloadSchema = z.object({
  projectId: teamSchema.shape.projectId
});

export const getNonProjectMembersOptionsPayloadSchema = z.object({
  projectId: teamSchema.shape.projectId,
  name: userSchema.shape.name
});

export const addTeamMembersPayloadSchema = z.object({
  projectId: teamSchema.shape.projectId,
  members: z
    .array(
      z.object({
        userId: teamSchema.shape.userId,
        roleId: teamRolesSchema.shape.id
      }),
      "Members must contain ID and role ID."
    )
    .min(1, "Select at least 1 user to add to team.")
});

export const getProjectMembersPayloadSchema = z.object({
  projectId: teamSchema.shape.projectId
});
