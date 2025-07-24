import z from "zod";

const MAX_NAME = 10;

export const createListSchema = z.object({
  name: z
    .string("List name must be string.")
    .trim()
    .max(MAX_NAME, `Max list name length is ${MAX_NAME} characters.`),
  projectId: z.uuidv4("Project ID must be a UUID."),
  position: z.number("Position must be a number.").positive("Invalid position.")
});

export const updateListSchema = z.object({
  name: z
    .string("List name must be string.")
    .trim()
    .max(MAX_NAME, `Max list name length is ${MAX_NAME} characters.`),
  projectId: z.uuidv4("Project ID must be a UUID."),
  position: z
    .number("Position must be a number.")
    .positive("Invalid position."),
  updatedAt: z.iso.datetime("Invalid date for date modified.")
});

export const getListByIdSchema = z.uuidv4("List ID is an invalid UUID.");

export const deleteListSchema = z.uuidv4("List ID is an invalid UUID.");
