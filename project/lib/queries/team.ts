import { ProjectSchema } from "@/types/projects";
import { AddMemberData, GetNonProjectMembersOptionsData } from "@/types/teams";
import { and, eq, isNull, or } from "drizzle-orm";
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

  getNonProjectMembersOptions: async (
    data: GetNonProjectMembersOptionsData
  ) => {
    const members = await db
      .select({ id: teams.userId })
      .from(teams)
      .where(
        and(
          eq(teams.projectId, data.projectId),
          or(
            eq(teams.isAccepted, true),
            isNull(teams.isAccepted) // Invited users will not be included in options
          )
        )
      );

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
  },

  addMember: async (data: AddMemberData) => {
    const insertData = { ...data, isAccepted: null };

    await db
      .insert(teams)
      .values(insertData)
      .onConflictDoUpdate({
        target: [teams.projectId, teams.userId],
        set: { isAccepted: null }
      });
  }
};

export default teamQueries;
