import { lists } from "@/lib/db/drizzle/migrations/schema";
import { CreateListData, ListSchema, UpdateListData } from "@/types/lists";
import { ProjectSchema } from "@/types/projects";
import { eq } from "drizzle-orm";
import db from "../db";

const listQueries = {
  get: async (id: ListSchema["id"]) => {
    const [list] = await db.select().from(lists).where(eq(lists.id, id));
    return list;
  },

  getListsAndTasks: async (projectId: ProjectSchema["id"]) => {
    return await db.query.lists.findMany({
      with: {
        tasks: {
          with: { taskAssignments: { with: { user: true } } },
          orderBy: (tasks, { asc }) => asc(tasks.position)
        }
      },
      where: (lists, { eq }) => eq(lists.projectId, projectId),
      orderBy: (lists, { asc }) => asc(lists.position)
    });
  },

  getCreatorId: async (id: ListSchema["id"]) => {
    const [result] = await db
      .select({ createdBy: lists.createdBy })
      .from(lists)
      .where(eq(lists.id, id));

    return result.createdBy;
  },

  create: async (data: CreateListData) => {
    const [newList] = await db
      .insert(lists)
      .values(data)
      .returning({ id: lists.id });

    return newList.id;
  },

  update: async (id: ListSchema["id"], data: UpdateListData) => {
    const [updatedList] = await db
      .update(lists)
      .set(data)
      .where(eq(lists.id, id))
      .returning({ id: lists.id });

    return updatedList.id;
  },

  delete: async (id: ListSchema["id"]) => {
    await db.delete(lists).where(eq(lists.id, id));
  }
};

export default listQueries;
