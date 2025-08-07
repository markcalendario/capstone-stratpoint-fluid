import { lists } from "@/lib/db/drizzle/migrations/schema";
import { CreateListData, ListSchema, UpdateListData } from "@/types/lists";
import { ProjectSchema } from "@/types/projects";
import { eq } from "drizzle-orm";
import db from "..";

const listQueries = {
  getAll: async () => {
    return await db.select().from(lists);
  },

  getById: async (id: ListSchema["id"]) => {
    const [list] = await db.select().from(lists).where(eq(lists.id, id));
    return list;
  },

  getByProjectId: async (projectId: ProjectSchema["id"]) => {
    return await db.select().from(lists).where(eq(lists.projectId, projectId));
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
