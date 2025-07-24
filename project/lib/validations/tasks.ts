import { priority } from "@/lib/db/drizzle/schema";
import { isFutureDate } from "@/lib/utils/date-and-time";
import z from "zod";

const TITLE_LENGTH = 20;
const DESCRIPTION_LENGTH = 50;

export const createTaskSchema = z.object({
  title: z
    .string("Task name must be string.")
    .trim()
    .max(TITLE_LENGTH, `Max title length is ${TITLE_LENGTH} characters.`),
  description: z
    .string("Description must be a string.")
    .trim()
    .max(
      DESCRIPTION_LENGTH,
      `Max description length is ${DESCRIPTION_LENGTH} characters.`
    ),
  listId: z.uuidv4("List ID must be a valid UUID."),
  assigneeId: z.uuidv4("Assignee ID must be a valid UUID."),
  priority: z.enum(priority.enumValues),
  dueDate: z.iso
    .date("Due date must be a valid date.")
    .refine(isFutureDate, "Due date cannot be today or in the past."),
  position: z.number("Position must be a number").positive("Invalid position.")
});

export const updateTaskSchema = z.object({
  title: z
    .string("Task name must be string.")
    .trim()
    .max(TITLE_LENGTH, `Max title length is ${TITLE_LENGTH} characters.`),
  description: z
    .string("Description must be a string.")
    .trim()
    .max(
      DESCRIPTION_LENGTH,
      `Max description length is ${DESCRIPTION_LENGTH} characters.`
    ),
  listId: z.uuidv4("List ID must be a valid UUID."),
  assigneeId: z.uuidv4("Assignee ID must be a valid UUID."),
  priority: z.enum(priority.enumValues),
  dueDate: z.iso
    .date("Due date must be a valid date.")
    .refine(isFutureDate, "Due date cannot be today or in the past."),
  position: z
    .number("Position must be a number.")
    .positive("Invalid position."),
  updatedAt: z.iso.datetime("Invalid date for date modified.")
});

export const taskIdSchema = z.uuidv4("Task ID is an invalid UUID.");
