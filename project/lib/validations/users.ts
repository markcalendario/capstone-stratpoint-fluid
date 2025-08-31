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

// Payload Validations

export const editProfilePayloadSchema = z.object({
  email: userSchema.shape.email,
  lastName: userSchema.shape.name,
  firstName: userSchema.shape.name,
  newProfileFile: z
    .file("Profile picture file must be provided.")
    .min(1, "Image file is required.")
    .max(1024 * 1024, "Image file size must be less than 1 MB.")
    .mime("image/jpeg", "Image file must be JPG.")
    .nullable()
});
