import { lists } from "@/lib/db/drizzle/migrations/schema";
import {
  CreateListPayload,
  ListSchema,
  UpdateListPayload
} from "@/types/lists";
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
  create: async (data: CreateListPayload) => {
    const [newList] = await db
      .insert(lists)
      .values(data)
      .returning({ id: lists.id });

    return newList.id;
  },
  update: async (id: ListSchema["id"], data: UpdateListPayload) => {
    const [updatedList] = await db
      .update(lists)
      .set(data)
      .where(eq(lists.id, id))
      .returning({ id: lists.id });

    return updatedList.id;
  },
  delete: async (id: ListSchema["id"]) => {
    const [deletedList] = await db
      .delete(lists)
      .where(eq(lists.id, id))
      .returning({ id: lists.id, name: lists.name });

    return deletedList;
  }
};

export default listQueries;
