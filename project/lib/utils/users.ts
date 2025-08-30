import { UserSchema } from "@/types/users";
import { currentUser } from "@clerk/nextjs/server";
import userQueries from "..//queries/users";

export async function getUserId() {
  const user = await currentUser();

  if (!user) {
    throw new Error("Cannot find user.");
  }

  return await userQueries.getIdByClerkId(user.id);
}

export async function getClerkIdByUserId(id: UserSchema["id"]) {
  return await userQueries.getClerkIdById(id);
}
