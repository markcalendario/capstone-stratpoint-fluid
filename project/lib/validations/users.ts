import z from "zod";

export const userSchema = z.object({
  id: z.uuid("User ID must be a UUID.").trim(),
  clerkId: z.string("Clerk ID must be a string."),
  email: z.email("Invalid email address.").trim(),
  name: z.string("Name must be a string.").trim(),
  createdAt: z.iso
    .datetime("Value for 'createdAt' field must be datetime.")
    .trim(),
  updatedAt: z.iso
    .datetime("Value for 'updatedAt' field must be datetime.")
    .trim(),
  imageUrl: z.url("Image URL must be a valid URL.")
});

// Query Validations

export const createUserSchema = z.object({
  name: userSchema.shape.name,
  email: userSchema.shape.email,
  clerkId: userSchema.shape.clerkId,
  imageUrl: userSchema.shape.imageUrl
});

export const updateUserSchema = z.object({
  name: userSchema.shape.name,
  email: userSchema.shape.email,
  imageUrl: userSchema.shape.imageUrl,
  updatedAt: userSchema.shape.updatedAt
});

export const userIdSchema = z.uuidv4("User ID is an invalid UUID.");

export const userClerkIdSchema = z.string("Clerk ID must be a string.").trim();
