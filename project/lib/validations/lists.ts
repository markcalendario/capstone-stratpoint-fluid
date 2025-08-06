import z from "zod";

const MAX_NAME = 20;
const MIN_NAME = 3;

export const createListSchema = z.object({
  name: z
    .string("List name must be string.")
    .trim()
    .min(MIN_NAME, `Minimum list name length is ${MIN_NAME} characters.`)
    .max(MAX_NAME, `Maximum list name length is ${MAX_NAME} characters.`),
  projectId: z.uuidv4("Project ID must be a UUID."),
  createdBy: z.uuidv4("List creator ID must be UUID."),
  isFinal: z.boolean("isFinal field must be boolean.")
});

export const updateListSchema = z.object({
  name: z
    .string("List name must be string.")
    .trim()
    .min(MIN_NAME, `Minimum list name length is ${MIN_NAME} characters.`)
    .max(MAX_NAME, `Maximum list name length is ${MAX_NAME} characters.`),
  updatedAt: z.iso.datetime("Invalid date for date modified."),
  isFinal: z.boolean("isFinal field must be boolean.")
});

export const listIdSchema = z.uuidv4("List ID is an invalid UUID.");
