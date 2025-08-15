import { ProjectSchema } from "@/types/projects";
import {
  AddMemberData,
  GetNonProjectMembersOptionsData,
  RemoveMemberData
} from "@/types/teams";
import { and, eq, isNull, or } from "drizzle-orm";
import db from "../db";
import { teams } from "../db/drizzle/migrations/schema";

const teamQueries = {
  // Retrive all project members with any status
  getAllByProject: async (projectId: ProjectSchema["id"]) => {
    return await db.query.teams.findMany({
      where: (teams, { eq }) => eq(teams.projectId, projectId),
      with: {
        teamRole: true,
        user: {
          with: {
            taskAssignments: { with: { task: { with: { list: true } } } },
            teams: { where: (teams, { eq }) => eq(teams.isAccepted, true) }
          }
        }
      }
    });
  },

  // Retrive all project members with accepted status
  getAcceptedByProject: async (projectId: ProjectSchema["id"]) => {
    return await db.query.teams.findMany({
      where: (teams, { eq, and }) => {
        return and(eq(teams.projectId, projectId), eq(teams.isAccepted, true));
      },
      with: {
        teamRole: true,
        user: {
          with: {
            taskAssignments: { with: { task: { with: { list: true } } } },
            teams: { where: (teams, { eq }) => eq(teams.isAccepted, true) }
          }
        }
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
  },

  removeTeamMember: async (data: RemoveMemberData) => {
    await db
      .delete(teams)
      .where(
        and(eq(teams.userId, data.userId), eq(teams.projectId, data.projectId))
      );
  }
};

export default teamQueries;
