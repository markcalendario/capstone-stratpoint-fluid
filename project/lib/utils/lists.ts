"use server";

import { ListSchema } from "@/types/lists";
import { UserSchema } from "@/types/users";
import listQueries from "..//queries/lists";

export async function isUserListCreator(
  listId: ListSchema["id"],
  userId: UserSchema["id"]
) {
  const createdBy = await listQueries.getCreatorId(listId);
  return userId === createdBy;
}
