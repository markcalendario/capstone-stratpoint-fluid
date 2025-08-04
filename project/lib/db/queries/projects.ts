import { projects, team } from "@/lib/db/drizzle/migrations/schema";
import { formatDate } from "@/lib/utils/date-and-time";
import { Project, UpdateProjectPayload } from "@/types/projects";
import { UserSchema } from "@/types/users";
import { desc, eq, inArray } from "drizzle-orm";
import db from "..";

const projectQueries = {
  getAll: async (userId: UserSchema["id"]) => {
    const userTeams = await db.query.team.findMany({
      columns: { projectId: true },
      where: (team, { eq, and }) =>
        and(eq(team.userId, userId), eq(team.isAccepted, true))
    });

    const projectIds = userTeams.map((t) => t.projectId);

    const results = await db.query.projects.findMany({
      where: (projects, { eq, or, and }) =>
        and(
          or(eq(projects.ownerId, userId), inArray(projects.id, projectIds)),
          eq(projects.active, true)
        ),
      columns: { id: true, name: true, description: true, dueDate: true },
      with: {
        teams: {
          columns: { id: true },
          where: (teams, { eq }) => eq(teams.isAccepted, true)
        },
        lists: {
          columns: { id: true, isFinal: true },
          with: { tasks: { columns: { id: true } } }
        }
      },
      orderBy: [desc(projects.updatedAt)]
    });

    const recentProjects = [];

    for (const result of results) {
      const doneTasks = result.lists.reduce((count, list) => {
        return list.isFinal ? count + list.tasks.length : count;
      }, 0);

      const pendingTasks = result.lists.reduce((count, list) => {
        return !list.isFinal ? count + list.tasks.length : count;
      }, 0);

      const totalTasks = doneTasks + pendingTasks;
      const progress = totalTasks === 0 ? 0 : doneTasks / totalTasks;

      recentProjects.push({
        id: result.id,
        name: result.name,
        description: result.description,
        dueDate: formatDate(result.dueDate),
        members: result.teams.length + 1, // Plus the owner
        progress
      });
    }

    return recentProjects;
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
                .select({ projectId: team.projectId })
                .from(team)
                .where(and(eq(team.userId, userId), eq(team.isAccepted, true)))
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
              .select({ projectId: team.projectId })
              .from(team)
              .where(and(eq(team.userId, userId), eq(team.isAccepted, true)))
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
