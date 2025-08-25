import z from "zod";

const taskDiscussionsSchema = z.object({
  id: z.uuidv4("Task discussion ID must be UUID").trim(),
  content: z.string("Content must be string.").trim(),
  taskId: z.uuidv4("Task ID must be a UUID."),
  authorId: z.uuidv4("Author ID must be a UUID."),
  createdAt: z.iso.datetime("Invalid date creation of task discussion."),
  updatedAt: z.iso.datetime("Invalid update date of task discussion.")
});

export const addTaskDiscussionSchema = z.object({
  taskId: taskDiscussionsSchema.shape.taskId,
  content: taskDiscussionsSchema.shape.content,
  authorId: taskDiscussionsSchema.shape.authorId
});

export const updateTaskDiscussionSchema = z.object({
  content: taskDiscussionsSchema.shape.content,
  taskId: taskDiscussionsSchema.shape.taskId,
  authorId: taskDiscussionsSchema.shape.authorId,
  updatedAt: taskDiscussionsSchema.shape.updatedAt
});
