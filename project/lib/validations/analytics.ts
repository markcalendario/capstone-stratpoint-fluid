import z from "zod";
import { projectSchema } from "./projects";

export const getProjectProgressSchema = z.object({
  projectId: projectSchema.shape.id
});

export const getStatusByPrioritySchema = z.object({
  projectId: projectSchema.shape.id
});

export const getAnalyticsSummarySchema = z.object({
  projectId: projectSchema.shape.id
});
