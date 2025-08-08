import { currentUser } from "@clerk/nextjs/server";
import userQueries from "../db/queries/users";

export async function getUserId() {
  const user = await currentUser();

  if (!user) {
    throw new Error("Cannot find user.");
  }

  return await userQueries.getIdByClerkId(user.id);
}
