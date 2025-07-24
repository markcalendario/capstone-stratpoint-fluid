import z from "zod";

export const createUserSchema = z.object({
  name: z.string("Name must be a string.").trim(),
  clerkId: z.uuidv4("Clerk ID is invalid."),
  email: z.email("Invalid email address.").trim()
});

export const updateUserSchema = z.object({
  name: z.string("Name must be a string.").trim(),
  clerkId: z.uuidv4("Clerk ID is invalid."),
  email: z.email("Invalid email address.").trim(),
  updatedAt: z.iso.datetime("Invalid update date and time.")
});

export const getUserByIdSchema = z.uuidv4("User ID is an invalid UUID.");

export const deleteUserSchema = z.uuidv4("User ID is an invalid UUID.");
