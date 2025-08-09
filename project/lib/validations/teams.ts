import z from "zod";
import { projectSchema } from "./projects";
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
