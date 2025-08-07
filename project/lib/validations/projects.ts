import { isFutureDate } from "@/lib/utils/date-and-time";
import z from "zod";
import { userSchema } from "./users";

const MIN_NAME = 3;
const MIN_DESCRIPTION = 5;
const MAX_NAME = 20;
const MAX_DESCRIPTION = 50;

export const projectSchema = z.object({
  id: z.uuidv4("Project ID must be UUID.").trim(),
  name: z
    .string("Project name must be string.")
    .trim()
    .min(MIN_NAME, `Project name must be at least ${MIN_NAME} characters.`)
    .max(MAX_NAME, `Max project name length is ${MAX_NAME} characters.`),
  description: z
    .string("Description must be a string.")
    .trim()
    .min(
      MIN_DESCRIPTION,
      `Description must be at least ${MIN_DESCRIPTION} characters.`
    )
    .max(
      MAX_DESCRIPTION,
      `Max description length is ${MAX_DESCRIPTION} characters.`
    ),
  ownerId: userSchema.shape.id,
  createdAt: z.iso.datetime("Invalid date for date created.").trim(),
  updatedAt: z.iso.datetime("Invalid date for date modified.").trim(),
  dueDate: z.iso
    .date("Due date must be in YYYY-MM-DD format.")
    .trim()
    .refine(isFutureDate, "Due date cannot be in the past.")
});

// Project Queries Validations

export const createProjectSchema = z.object({
  name: projectSchema.shape.name,
  description: projectSchema.shape.description,
  dueDate: projectSchema.shape.dueDate,
  ownerId: projectSchema.shape.ownerId
});

export const updateProjectSchema = z.object({
  name: projectSchema.shape.name,
  description: projectSchema.shape.description,
  dueDate: projectSchema.shape.dueDate,
  ownerId: projectSchema.shape.ownerId,
  updatedAt: projectSchema.shape.updatedAt
});

export const projectIdSchema = projectSchema.shape.id;

// Project Payload validations

export const createProjectPayloadSchema = z.object({
  name: projectSchema.shape.name,
  description: projectSchema.shape.description,
  dueDate: projectSchema.shape.dueDate,
  ownerClerkId: userSchema.shape.clerkId
});

export const getRecentProjectsPayloadSchema = z.object({
  userClerkId: userSchema.shape.clerkId
});

export const getProjectPayloadSchema = z.object({
  id: projectSchema.shape.id
});

export const deleteProjectPayloadSchema = z.object({
  userClerkId: userSchema.shape.clerkId,
  projectId: projectSchema.shape.id
});

export const updateProjectPayloadSchema = z.object({
  name: projectSchema.shape.name,
  dueDate: projectSchema.shape.dueDate,
  description: projectSchema.shape.description,
  projectId: projectSchema.shape.id,
  userClerkId: userSchema.shape.clerkId
});
