import z from "zod";

export const createUserSchema = z.object({
  name: z.string("Name must be a string."),
  clerkId: z.uuidv4("Clerk ID is invalid."),
  email: z.email("Invalid email address.")
});

export const updateUserSchema = z.object({
  name: z.string("Name must be a string."),
  clerkId: z.uuidv4("Clerk ID is invalid."),
  email: z.email("Invalid email address."),
  updatedAt: z.iso.datetime("Invalid update date and time.")
});

export const getUserByIdSchema = z.uuidv4("User ID is an invalid UUID.");

export const deleteUserSchema = z.uuidv4("User ID is an invalid UUID.");
