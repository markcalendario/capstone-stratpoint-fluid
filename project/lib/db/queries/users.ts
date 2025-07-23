import { users } from "@/lib/db/drizzle/schema";
import { CreateUserPayload, UpdateUserPayload, User } from "@/types/users";
import { eq } from "drizzle-orm";
import db from "..";

const userQueries = {
  getAll: async () => {
    return await db.select().from(users);
  },
  getById: async (id: User["id"]) => {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  },
  create: async (data: CreateUserPayload) => {
    const [newUser] = await db
      .insert(users)
      .values(data)
      .returning({ id: users.id });

    return newUser.id;
  },
  update: async (data: UpdateUserPayload) => {
    const [updatedUser] = await db
      .update(users)
      .set(data)
      .returning({ id: users.id });

    return updatedUser.id;
  },
  delete: async (id: User["id"]) => {
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id, name: users.name });

    return deletedUser;
  }
};

export default userQueries;
