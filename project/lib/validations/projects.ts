import { isFutureDate } from "@/lib/utils/date-and-time";
import z from "zod";

const MIN_NAME = 3;
const MIN_DESCRIPTION = 5;
const MAX_NAME = 20;
const MAX_DESCRIPTION = 50;

export const createProjectSchema = z.object({
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
  dueDate: z.iso
    .date("Due date must be in YYYY-MM-DD format.")
    .refine(isFutureDate, "Due date cannot be in the past."),
  ownerId: z.uuidv4("Owner ID must be a UUID.")
});

export const updateProjectSchema = z.object({
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
  dueDate: z.iso
    .date("Due date must be in YYYY-MM-DD format.")
    .refine(isFutureDate, "Due date cannot be in the past."),
  ownerId: z.uuidv4("Owner ID must be a UUID."),
  updatedAt: z.iso.datetime("Invalid date for date modified.")
});

export const projectIdSchema = z.uuidv4("Project ID is an invalid UUID.");
