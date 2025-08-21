import { isFutureDate } from "@/lib/utils/date-and-time";
import z from "zod";
import { projectType } from "../utils/constants";
import { userSchema } from "./users";

const MIN_NAME = 3;
const MIN_DESCRIPTION = 5;
const MAX_NAME = 50;
const MAX_DESCRIPTION = 100;

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
  projectType: z.enum(projectType, "Invalid project type."),
  imageUrl: z.url("Image URL must be a valid URL."),
  ownerId: userSchema.shape.id,
  createdAt: z.iso.datetime("Invalid date for date created.").trim(),
  updatedAt: z.iso.datetime("Invalid date for date modified.").trim(),
  dueDate: z.iso
    .date("Due date must be in YYYY-MM-DD format.")
    .trim()
    .refine(isFutureDate, "Due date cannot be in the past.")
});

// Project Payload validations

export const createProjectPayloadSchema = z.object({
  name: projectSchema.shape.name,
  description: projectSchema.shape.description,
  dueDate: projectSchema.shape.dueDate,
  projectType: projectSchema.shape.projectType,
  imageFile: z
    .file("Image file must be provided.")
    .min(1, "Image file is required.")
    .max(1024 * 1024, "Image file size must be less than 1 MB.")
    .mime("image/jpg", "Image file must be JPG.")
});

export const getProjectPayloadSchema = z.object({
  id: projectSchema.shape.id
});

export const deleteProjectPayloadSchema = z.object({
  id: projectSchema.shape.id
});

export const updateProjectPayloadSchema = z.object({
  name: projectSchema.shape.name,
  dueDate: projectSchema.shape.dueDate,
  description: projectSchema.shape.description,
  projectId: projectSchema.shape.id
});

export const getProjectOptionsPayloadSchema = z.object({
  id: projectSchema.shape.id.optional(),
  name: z.string("Project name must be string.") // Search query
});
