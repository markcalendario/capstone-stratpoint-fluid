import z from "zod";
import { projectSchema } from "./projects";
import { userSchema } from "./users";

const MIN_NAME = 3;
const MAX_NAME = 20;

export const listSchema = z.object({
  id: z.uuidv4("List ID is an invalid UUID.").trim(),
  name: z
    .string("List name must be string.")
    .trim()
    .min(MIN_NAME, `Minimum list name length is ${MIN_NAME} characters.`)
    .max(MAX_NAME, `Maximum list name length is ${MAX_NAME} characters.`),
  projectId: projectSchema.shape.id,
  createdBy: userSchema.shape.id,
  updatedAt: z.iso.datetime("Invalid date for date modified.").trim(),
  createdAt: z.iso.datetime("Invalid date for date created.").trim(),
  isFinal: z.boolean("isFinal field must be boolean.")
});

// List Query Schema

export const createListDataSchema = z.object({
  name: listSchema.shape.name,
  projectId: listSchema.shape.projectId,
  createdBy: listSchema.shape.createdBy,
  isFinal: listSchema.shape.isFinal
});

export const updateListSchema = z.object({
  name: listSchema.shape.name,
  updatedAt: listSchema.shape.updatedAt,
  isFinal: listSchema.shape.isFinal
});

// Action Params Validations

export const createListPayloadSchema = z.object({
  projectId: projectSchema.shape.id,
  name: listSchema.shape.name,
  isFinal: listSchema.shape.isFinal,
  userClerkId: userSchema.shape.clerkId
});

export const getListsByProjectIdSchema = z.object({
  projectId: projectSchema.shape.id
});

export const updateListPayloadSchema = z.object({
  id: listSchema.shape.id,
  name: listSchema.shape.name,
  isFinal: listSchema.shape.isFinal,
  userClerkId: userSchema.shape.clerkId
});

export const deleteListPayloadSchema = z.object({
  id: listSchema.shape.id,
  userClerkId: userSchema.shape.clerkId
});
