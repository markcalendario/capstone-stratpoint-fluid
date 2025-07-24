import z from "zod";

export const createCommentSchema = z.object({
  content: z.string("Content must be string.").trim(),
  taskId: z.uuidv4("Task ID must be a UUID."),
  authorId: z.uuidv4("Author ID must be a UUID.")
});

export const updateCommentSchema = z.object({
  content: z.string("Content must be string.").trim(),
  taskId: z.uuidv4("Task ID must be a UUID."),
  authorId: z.uuidv4("Author ID must be a UUID."),
  updatedAt: z.iso.datetime("Invalid date for date modified.")
});

export const commentIDSchema = z.uuidv4("Comment ID is an invalid UUID.");
