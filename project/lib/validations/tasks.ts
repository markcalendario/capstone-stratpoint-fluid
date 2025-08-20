import { priority } from "@/lib/db/drizzle/migrations/schema";
import { isFutureDate } from "@/lib/utils/date-and-time";
import z from "zod";
import { listSchema } from "./lists";
import { projectSchema } from "./projects";
import { userSchema } from "./users";

const TITLE_MAX = 20;
const TITLE_MIN = 3;
const DESCRIPTION_MIN = 6;
const DESCRIPTION_MAX = 300;

export const taskSchema = z.object({
  id: z.uuidv4("Task ID must be UUID").trim(),
  title: z
    .string("Task name must be string.")
    .trim()
    .min(TITLE_MIN, `Min title length is ${TITLE_MIN} characters.`)
    .max(TITLE_MAX, `Max title length is ${TITLE_MAX} characters.`),
  description: z
    .string("Description must be a string.")
    .trim()
    .min(
      DESCRIPTION_MIN,
      `Min description length is ${DESCRIPTION_MIN} characters.`
    )
    .max(
      DESCRIPTION_MAX,
      `Max description length is ${DESCRIPTION_MAX} characters.`
    ),
  listId: z.uuidv4("List ID must be a valid UUID."),
  priority: z.enum(priority.enumValues, "Please select a priority."),
  dueDate: z.iso
    .date("Due date must be a valid date.")
    .refine(isFutureDate, "Due date cannot be today or in the past."),
  position: z.number("Position must be a number").min(0, "Invalid position."),
  createdAt: z.iso.datetime("Field 'createdAt' must be datetime."),
  updatedAt: z.iso.datetime("Field 'updatedAt' must be datetime."),
  attachment: z.url("Attachment must be URL."),
  label: z.string("Label must be string"),
  createdBy: userSchema.shape.id
});

// Payload Validations

export const getListTasksPayloadSchema = z.object({
  listId: listSchema.shape.id
});

export const createAndAssignTaskPayloadSchema = z.object({
  listId: listSchema.shape.id,
  title: taskSchema.shape.title,
  description: taskSchema.shape.description,
  assignees: z.array(listSchema.shape.id, "Assignees must be array."),
  priority: taskSchema.shape.priority,
  dueDate: taskSchema.shape.dueDate,
  label: taskSchema.shape.label,
  attachment: z.file("Attachment must be a file.").nullable(),
  projectId: projectSchema.shape.id
});

export const deleteTaskPayloadSchema = z.object({
  id: taskSchema.shape.id,
  projectId: projectSchema.shape.id
});

export const updateTaskPayloadSchema = z.object({
  id: taskSchema.shape.id,
  listId: listSchema.shape.id,
  title: taskSchema.shape.title,
  description: taskSchema.shape.description,
  assignees: z.array(listSchema.shape.id, "Assignees must be array."),
  priority: taskSchema.shape.priority,
  dueDate: taskSchema.shape.dueDate,
  label: taskSchema.shape.label,
  attachment: z.file("Attachment must be a file.").nullable(),
  projectId: projectSchema.shape.id
});

export const moveTaskPayloadSchema = z.object({
  taskId: taskSchema.shape.id,
  newListId: listSchema.shape.id,
  newPosition: taskSchema.shape.position
});
