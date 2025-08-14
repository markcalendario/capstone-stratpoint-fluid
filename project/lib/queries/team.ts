import { ProjectSchema } from "@/types/projects";
import { AddMemberData, GetNonProjectMembersOptionsData } from "@/types/teams";
import { and, eq, isNull, or } from "drizzle-orm";
import db from "../db";
import { teams } from "../db/drizzle/migrations/schema";

const teamQueries = {
  getByProject: async (projectId: ProjectSchema["id"]) => {
    return await db.query.users.findMany({
      with: {
        taskAssignments: { with: { task: { with: { list: true } } } },
        teams: {
          with: { teamRole: true },
          where: (teams, { and, eq }) => {
            return and(eq(teams.projectId, projectId));
          }
        }
      },
      where: (users, { and, exists, eq }) => {
        return and(
          eq(users.isDeleted, false),
          exists(
            db
              .select()
              .from(teams)
              .where((teams) =>
                and(eq(teams.userId, users.id), eq(teams.projectId, projectId))
              )
          )
        );
      }
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
