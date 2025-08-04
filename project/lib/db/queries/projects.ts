import { projects, teams } from "@/lib/db/drizzle/migrations/schema";
import {
  CreateProjectData,
  Project,
  UpdateProjectPayload
} from "@/types/projects";
import { UserSchema } from "@/types/users";
import { eq, inArray } from "drizzle-orm";
import db from "..";

const projectQueries = {
  create: async (data: CreateProjectData) => {
    const [newProject] = await db
      .insert(projects)
      .values(data)
      .returning({ id: projects.id });

    return newProject.id;
  },

  ownedOrMember: async (userId: UserSchema["id"]) => {
    return await db.query.projects.findMany({
      with: { teams: true, lists: { with: { tasks: true } } },
      where: (projects, { eq, and, or }) =>
        or(
          and(eq(projects.ownerId, userId), eq(projects.active, true)),
          and(
            eq(projects.active, true),
            inArray(
              projects.id,
              db
                .select({ projectId: teams.projectId })
                .from(teams)
                .where(
                  and(eq(teams.userId, userId), eq(teams.isAccepted, true))
                )
            )
          )
        )
    });
  },

  getOwned: async (userId: UserSchema["id"]) => {
    return await db.query.projects.findMany({
      with: { teams: true, lists: { with: { tasks: true } } },
      where: (projects, { eq, and }) =>
        and(eq(projects.ownerId, userId), eq(projects.active, true))
    });
  },

  getFromTeam: async (userId: UserSchema["id"]) => {
    return await db.query.projects.findMany({
      with: { teams: true, lists: { with: { tasks: true } } },
      where: (projects, { inArray, and }) =>
        and(
          eq(projects.active, true),
          inArray(
            projects.id,
            db
              .select({ projectId: teams.projectId })
              .from(teams)
              .where(and(eq(teams.userId, userId), eq(teams.isAccepted, true)))
          )
        )
    });
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
