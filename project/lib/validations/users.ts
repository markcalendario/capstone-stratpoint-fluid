import z from "zod";

export const createUserSchema = z.object({
  name: z.string("Name must be a string.").trim(),
  clerkId: z.string("Clerk ID must be string."),
  email: z.email("Invalid email address.").trim()
});

export const updateUserSchema = z.object({
  name: z.string("Name must be a string.").trim(),
  clerkId: z.string("Clerk ID is invalid."),
  email: z.email("Invalid email address.").trim(),
  updatedAt: z.iso.datetime("Invalid update date and time.")
});

export const userIdSchema = z.uuidv4("User ID is an invalid UUID.");
