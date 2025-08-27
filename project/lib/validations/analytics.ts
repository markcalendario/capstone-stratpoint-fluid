import z from "zod";
import { projectSchema } from "./projects";

export const getProjectProgressSchema = z.object({
  projectId: projectSchema.shape.id
});
