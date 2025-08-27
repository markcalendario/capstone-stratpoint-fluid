import z from "zod";
import { projectSchema } from "./projects";

export const permissionSchema = z.object({
  id: z.uuid("Permission ID must be UUID."),
  title: z.string("Permission title must be string")
});

// Payload Validation

export const getPermissionsPayloadSchema = z.object({
  projectId: projectSchema.shape.id
});
