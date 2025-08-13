import { ProjectSchema } from "@/types/projects";
import { GetNonProjectMembersOptionsData } from "@/types/teams";
import { eq } from "drizzle-orm";
import db from "../db";
import { teams } from "../db/drizzle/migrations/schema";

const teamQueries = {
  getByProject: async (projectId: ProjectSchema["id"]) => {
    const members = await db
      .select({ id: teams.userId })
      .from(teams)
      .where(eq(teams.projectId, projectId));

    const memberIds = members.map((m) => m.id);

    return await db.query.users.findMany({
      where: (users, { and, inArray, eq }) =>
        and(inArray(users.id, memberIds), eq(users.isDeleted, false))
    });
  },

  getNonProjectMembers: async (data: GetNonProjectMembersOptionsData) => {
    const members = await db
      .select({ id: teams.userId })
      .from(teams)
      .where(eq(teams.projectId, data.projectId));

    const memberIds = members.map((m) => m.id);

    return await db.query.users.findMany({
      where: (users, { and, notInArray, eq, ilike }) => {
        const conditions = [
          notInArray(users.id, memberIds),
          eq(users.isDeleted, false)
        ];

        if (data.name) conditions.push(ilike(users.name, `%${data.name}%`));
        return and(...conditions);
      }
    });
  }
};

export default teamQueries;
