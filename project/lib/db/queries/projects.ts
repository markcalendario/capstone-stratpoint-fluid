import { projects, teams } from "@/lib/db/drizzle/migrations/schema";
import {
  CreateProjectData,
  ProjectSchema,
  UpdateProjectData
} from "@/types/projects";
import { UserSchema } from "@/types/users";
import { and, eq, inArray } from "drizzle-orm";
import db from "..";

const projectQueries = {
  create: async (data: CreateProjectData) => {
    const [newProject] = await db
      .insert(projects)
      .values(data)
      .returning({ id: projects.id });

    return newProject.id;
  },

  getById: async (id: ProjectSchema["id"]) => {
    return await db.query.projects.findFirst({
      with: { teams: true, lists: { with: { tasks: true } } },
      where: (projects, { eq }) => eq(projects.id, id)
    });
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

  getOwnerId: async (id: ProjectSchema["id"]) => {
    const [owner] = await db
      .select({ ownerId: projects.ownerId })
      .from(projects)
      .where(eq(projects.id, id));
    return owner.ownerId;
  },

  update: async (id: ProjectSchema["id"], data: UpdateProjectData) => {
    const [updatedProject] = await db
      .update(projects)
      .set(data)
      .where(eq(projects.id, id))
      .returning({ id: projects.id });

    return updatedProject.id;
  },

  delete: async (userId: UserSchema["id"], projectId: ProjectSchema["id"]) => {
    await db
      .delete(projects)
      .where(and(eq(projects.id, projectId), eq(projects.ownerId, userId)));
  }
};

export default projectQueries;
