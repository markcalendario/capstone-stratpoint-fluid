import { priority } from "@/lib/db/drizzle/schema";
import { getCurrentDate } from "@/lib/utils/date-and-time";
import z from "zod";

const TITLE_LENGTH = 20;
const DESCRIPTION_LENGTH = 50;

export const createTaskSchema = z.object({
  title: z
    .string()
    .max(TITLE_LENGTH, `Max title length is ${TITLE_LENGTH} characters.`)
    .trim(),
  description: z
    .string("Description must be a string.")
    .max(
      DESCRIPTION_LENGTH,
      `Max description length is ${DESCRIPTION_LENGTH} characters.`
    )
    .trim(),
  listId: z.uuidv4("List ID must be a valid UUID."),
  assigneeId: z.uuidv4("Assignee ID must be a valid UUID."),
  priority: z.enum(priority.enumValues),
  dueDate: z
    .date("Due date must be a valid date.")
    .min(getCurrentDate(), "Due date cannot be today or in the past."),
  position: z.number().min(1, "Invalid position.")
});

export const updateUserSchema = z.object({
  title: z
    .string()
    .max(TITLE_LENGTH, `Max title length is ${TITLE_LENGTH} characters.`)
    .trim(),
  description: z
    .string("Description must be a string.")
    .max(
      DESCRIPTION_LENGTH,
      `Max description length is ${DESCRIPTION_LENGTH} characters.`
    )
    .trim(),
  listId: z.uuidv4("List ID must be a valid UUID."),
  assigneeId: z.uuidv4("Assignee ID must be a valid UUID."),
  priority: z.enum(priority.enumValues),
  dueDate: z
    .date("Due date must be a valid date.")
    .min(getCurrentDate(), "Due date cannot be today or in the past."),
  position: z.number().min(1, "Invalid position."),
  updatedAt: z.iso.datetime("Invalid date for date modified.")
});

export const getTaskByIdSchema = z.uuidv4("Task ID is an invalid UUID.");

export const deleteTaskSchema = z.uuidv4("Task ID is an invalid UUID.");
