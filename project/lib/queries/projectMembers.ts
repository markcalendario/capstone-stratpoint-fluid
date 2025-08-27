import {
  AddProjectMemberData,
  EditProjectMemberRoleData,
  GetNonProjectMembersOptionsData,
  RemoveProjectMemberData
} from "@/types/projectMembers";
import { ProjectSchema } from "@/types/projects";
import { UserSchema } from "@/types/users";
import { and, eq, isNull, or } from "drizzle-orm";
import db from "../db";
import { projectMembers } from "../db/drizzle/migrations/schema";

const projectMembersQueries = {
  // Retrive all project members regardless of their accepted status
  getByProject: async (projectId: ProjectSchema["id"]) => {
    return await db.query.projectMembers.findMany({
      where: (projectMembers, { eq }) => {
        return eq(projectMembers.projectId, projectId);
      },
      with: {
        role: true,
        user: {
          with: {
            projects: true,
            taskAssignments: { with: { task: { with: { list: true } } } },
            projectMembers: {
              where: (projectMembers, { eq }) =>
                eq(projectMembers.isAccepted, true)
            }
          }
        }
      }
    });
  },

  // Retrive all project members with accepted status
  getAcceptedByProject: async (projectId: ProjectSchema["id"]) => {
    return await db.query.projectMembers.findMany({
      where: (projectMembers, { eq, and }) => {
        return and(
          eq(projectMembers.projectId, projectId),
          eq(projectMembers.isAccepted, true)
        );
      },
      with: {
        role: true,
        user: {
          with: {
            taskAssignments: { with: { task: { with: { list: true } } } },
            projectMembers: {
              where: (projectMembers, { eq }) =>
                eq(projectMembers.isAccepted, true)
            }
          }
        }
      }
    });
  },

  getNonProjectMembersOptions: async (
    data: GetNonProjectMembersOptionsData
  ) => {
    const members = await db
      .select({ id: projectMembers.userId })
      .from(projectMembers)
      .where(
        and(
          eq(projectMembers.projectId, data.projectId),
          or(
            eq(projectMembers.isAccepted, true),
            isNull(projectMembers.isAccepted) // Invited users will not be included in options
          )
        )
      );

    const memberIds = members.map((member) => member.id);

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

  getByUserAndProject: async (
    projectId: ProjectSchema["id"],
    userId: UserSchema["id"]
  ) => {
    return await db.query.projectMembers.findFirst({
      where: (projectMembers, { eq, and }) => {
        return and(
          eq(projectMembers.projectId, projectId),
          eq(projectMembers.userId, userId)
        );
      },
      with: {
        role: { with: { rolePermissions: { with: { permission: true } } } },
        user: {
          with: {
            taskAssignments: { with: { task: { with: { list: true } } } },
            projectMembers: {
              where: (projectMembers, { eq }) => {
                return eq(projectMembers.isAccepted, true);
              }
            }
          }
        }
      }
    });
  },

  addMember: async (data: AddProjectMemberData) => {
    const insertData = { ...data, isAccepted: null };

    await db
      .insert(projectMembers)
      .values(insertData)
      .onConflictDoUpdate({
        target: [projectMembers.projectId, projectMembers.userId],
        set: { isAccepted: null }
      });
  },

  removeTeamMember: async (data: RemoveProjectMemberData) => {
    await db
      .delete(projectMembers)
      .where(
        and(
          eq(projectMembers.userId, data.userId),
          eq(projectMembers.projectId, data.projectId)
        )
      );
  },

  editMemberRole: async (data: EditProjectMemberRoleData) => {
    return db
      .update(projectMembers)
      .set({ roleId: data.roleId })
      .where(
        and(
          eq(projectMembers.userId, data.userId),
          eq(projectMembers.projectId, data.projectId)
        )
      );
  }
};

export default projectMembersQueries;
