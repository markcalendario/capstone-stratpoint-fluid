import { UserSchema } from "@/types/users";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import userQueries from "../db/queries/users";

export async function getUserId() {
  const user = await currentUser();

  if (!user) {
    throw new Error("Cannot find user.");
  }

  return await userQueries.getIdByClerkId(user.id);
}

export async function getUserProfileById(id: UserSchema["id"]) {
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(id);
  return user.imageUrl;
}
