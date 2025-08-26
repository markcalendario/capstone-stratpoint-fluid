import z from "zod";

export const rolesSchema = z.object({
  id: z.uuidv4("Role must be provided."),
  title: z.uuidv4("Title must be string."),
  description: z.uuidv4("Description must be string.")
});
