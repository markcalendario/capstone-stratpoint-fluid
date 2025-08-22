import { lists } from "@/lib/db/drizzle/migrations/schema";
import { CreateListData, ListSchema, UpdateListData } from "@/types/lists";
import { ProjectSchema } from "@/types/projects";
import { eq, sql } from "drizzle-orm";
import db from "../db";

const listQueries = {
  get: async (id: ListSchema["id"]) => {
    const [list] = await db.select().from(lists).where(eq(lists.id, id));
    return list;
  },

  getListsWithTasks: async (projectId: ProjectSchema["id"]) => {
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

  getMaxPosition: async (projectId: ListSchema["id"]) => {
    const [{ max }] = await db
      .select({ max: sql<number>`COALESCE(MAX(${lists.position}), 0)` })
      .from(lists)
      .where(eq(lists.projectId, projectId));

    return max;
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
  },

  changePosition: async (
    id: ListSchema["id"],
    position: ListSchema["position"]
  ) => {
    await db.update(lists).set({ position }).where(eq(lists.id, id));
  }
};

export default listQueries;
