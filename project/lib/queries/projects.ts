import { projectMembers, projects } from "@/lib/db/drizzle/migrations/schema";
import {
  CreateProjectData,
  ProjectSchema,
  UpdateProjectData
} from "@/types/projects";
import { UserSchema } from "@/types/users";
import { and, eq } from "drizzle-orm";
import db from "../db";

const projectQueries = {
  create: async (data: CreateProjectData) => {
    const [newProject] = await db
      .insert(projects)
      .values(data)
      .returning({ id: projects.id });

    return newProject.id;
  },

  get: async (id: ProjectSchema["id"]) => {
    return await db.query.projects.findFirst({
      with: { projectMembers: true, lists: { with: { tasks: true } } },
      where: (projects, { eq }) => eq(projects.id, id)
    });
  },

  ownedOrMember: async (userId: UserSchema["id"]) => {
    const memberProjects = await db
      .select({ projectId: projectMembers.projectId })
      .from(projectMembers)
      .where(
        and(
          eq(projectMembers.userId, userId),
          eq(projectMembers.isAccepted, true)
        )
      );

    const projectIds = memberProjects.map((m) => m.projectId);

    return await db.query.projects.findMany({
      with: { projectMembers: true, lists: { with: { tasks: true } } },
      where: (projects, { eq, or, and, inArray }) => {
        return or(
          and(eq(projects.ownerId, userId), eq(projects.active, true)),
          and(eq(projects.active, true), inArray(projects.id, projectIds))
        );
      },
      orderBy: (projects, { asc }) => asc(projects.name)
    });
  },

  getOwnerId: async (id: ProjectSchema["id"]) => {
    const [owner] = await db
      .select({ ownerId: projects.ownerId })
      .from(projects)
      .where(eq(projects.id, id));

    return owner.ownerId;
  },

  getOwner: async (id: ProjectSchema["id"]) => {
    const [owner] = await db.query.projects.findMany({
      where: (projects, { eq }) => eq(projects.id, id),
      with: {
        user: {
          with: {
            projects: true,
            projectMembers: { with: { teamRole: true } },
            taskAssignments: { with: { task: { with: { list: true } } } }
          }
        }
      }
    });

    return owner.user;
  },

  update: async (id: ProjectSchema["id"], data: UpdateProjectData) => {
    const [updatedProject] = await db
      .update(projects)
      .set(data)
      .where(eq(projects.id, id))
      .returning({ id: projects.id });

    return updatedProject.id;
  },

  delete: async (id: ProjectSchema["id"], userId: UserSchema["id"]) => {
    await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.ownerId, userId)));
  },

  getOptions: async (name: ProjectSchema["name"], userId: UserSchema["id"]) => {
    const memberProjects = await db
      .select({ projectId: projectMembers.projectId })
      .from(projectMembers)
      .where(
        and(
          eq(projectMembers.userId, userId),
          eq(projectMembers.isAccepted, true)
        )
      );

    const projectIds = memberProjects.map((m) => m.projectId);

    return await db.query.projects.findMany({
      with: { projectMembers: true, lists: { with: { tasks: true } } },
      where: (projects, { eq, or, and, ilike, inArray }) =>
        and(
          or(
            and(eq(projects.ownerId, userId), eq(projects.active, true)),
            and(eq(projects.active, true), inArray(projects.id, projectIds))
          ),
          ilike(projects.name, `%${name}%`)
        )
    });
  }
};

export default projectQueries;
