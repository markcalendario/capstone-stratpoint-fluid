import { users } from "@/lib/db/drizzle/migrations/schema";
import {
  CreateUserPayload,
  UpdateUserPayload,
  UserSchema
} from "@/types/users";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import db from "..";

const userQueries = {
  getAll: async () => {
    return await db.select().from(users);
  },
  getById: async (id: UserSchema["id"]) => {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  },
  getIdByClerkId: async (clerkId: UserSchema["clerkId"]) => {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId));

    return user.id;
  },
  create: async (data: CreateUserPayload) => {
    const [newUser] = await db
      .insert(users)
      .values(data)
      .returning({ id: users.id });

    return newUser.id;
  },
  update: async (id: UserSchema["id"], data: UpdateUserPayload) => {
    const [updatedUser] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning({ id: users.id });

    return updatedUser.id;
  },
  updateByClerkId: async (
    clerkId: UserSchema["clerkId"],
    data: UpdateUserPayload
  ) => {
    const [updatedUser] = await db
      .update(users)
      .set(data)
      .where(eq(users.clerkId, clerkId))
      .returning({ clerkId: users.clerkId });

    return updatedUser.clerkId;
  },
  delete: async (id: UserSchema["id"]) => {
    const deletedEmail = `${uuidv4()}@deleted.com`;
    const now = new Date().toISOString();

    const [deletedUser] = await db
      .update(users)
      .set({
        email: deletedEmail,
        name: "[Deleted User]",
        updatedAt: now
      })
      .where(eq(users.id, id))
      .returning({ id: users.id });

    return deletedUser;
  },

  deleteByClerkId: async (clerkId: UserSchema["clerkId"]) => {
    const deletedEmail = `${uuidv4()}@deleted.com`;
    const now = new Date().toISOString();

    const [deletedUser] = await db
      .update(users)
      .set({
        email: deletedEmail,
        name: "[Deleted User]",
        updatedAt: now
      })
      .where(eq(users.clerkId, clerkId))
      .returning({ id: users.id, clerkId: users.clerkId });

    return deletedUser;
  }
};

export default userQueries;
