import z from "zod";
import { stripHTML } from "../utils/formatters";

const CONTENT_MAX = 5000;
const CONTENT_MIN = 1;

const taskDiscussionSchema = z.object({
  id: z.uuidv4("Task discussion ID must be UUID").trim(),
  content: z
    .string("Content must be string.")
    .refine((val) => stripHTML(val).length > 0, "Content cannot be empty.")
    .trim()
    .min(CONTENT_MIN, `Min comment length is ${CONTENT_MIN} characters.`)
    .max(CONTENT_MAX, `Max content length is ${CONTENT_MAX} characters.`),
  taskId: z.uuidv4("Task ID must be a UUID."),
  authorId: z.uuidv4("Author ID must be a UUID."),
  createdAt: z.iso.datetime("Invalid date creation of task discussion."),
  updatedAt: z.iso.datetime("Invalid update date of task discussion.")
});

export const getTaskDiscussionsPayloadSchema = z.object({
  taskId: taskDiscussionSchema.shape.taskId
});

export const createTaskDiscussionPayloadSchema = z.object({
  taskId: taskDiscussionSchema.shape.taskId,
  content: taskDiscussionSchema.shape.content
});

export const updateTaskDiscussionPayloadSchema = z.object({
  id: taskDiscussionSchema.shape.id,
  content: taskDiscussionSchema.shape.content
});

export const deleteTaskDiscussionPayloadSchema = z.object({
  id: taskDiscussionSchema.shape.id
});
