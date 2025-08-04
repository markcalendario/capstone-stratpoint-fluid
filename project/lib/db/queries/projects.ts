import { projects } from "@/lib/db/drizzle/migrations/schema";
import { formatDate } from "@/lib/utils/date-and-time";
import {
  CreateProjectPayload,
  Project,
  UpdateProjectPayload
} from "@/types/projects";
import { UserSchema } from "@/types/users";
import { desc, eq, inArray } from "drizzle-orm";
import db from "..";

const projectQueries = {
  getAll: async (userId: UserSchema["id"]) => {
    const userTeams = await db.query.team.findMany({
      columns: { projectId: true },
      where: (team, { eq }) => eq(team.userId, userId)
    });

    const projectIds = userTeams.map((t) => t.projectId);

    const results = await db.query.projects.findMany({
      where: (projects, { eq, or }) =>
        or(eq(projects.ownerId, userId), inArray(projects.id, projectIds)),
      columns: { id: true, name: true, description: true, dueDate: true },
      with: {
        teams: { columns: { id: true } },
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

  getById: async (id: Project["id"]) => {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id));

    return project;
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
