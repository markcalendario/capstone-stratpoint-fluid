import { projects } from "@/lib/db/drizzle/schema";
import {
  CreateProjectPayload,
  Project,
  UpdateProjectPayload
} from "@/types/projects";
import { eq } from "drizzle-orm";
import db from "..";

const projectQueries = {
  getAll: async () => {
    return await db.select().from(projects);
  },
  getById: async (id: Project["id"]) => {
    return await db.select().from(projects).where(eq(projects.id, id));
  },
  create: async (data: CreateProjectPayload) => {
    const [newProject] = await db
      .insert(projects)
      .values([data])
      .returning({ id: projects.id });

    return newProject.id;
  },
  update: async (id: Project["id"], data: UpdateProjectPayload) => {
    const [updatedProject] = await db
      .update(projects)
      .set(data)
      .where(eq(projects.id, id))
      .returning({ id: projects.id });

    return updatedProject.id;
  },
  delete: async (id: Project["id"]) => {
    const [deletedProject] = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning({ id: projects.id, name: projects.name });

    return deletedProject;
  }
};

export default projectQueries;
