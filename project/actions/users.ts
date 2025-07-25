import userQueries from "@/lib/db/queries/users";
import { createUserSchema } from "@/lib/validations/users";
import { User } from "@/types/users";
import z from "zod";

export async function createUserAccount(data: User) {
  try {
    const newUser = createUserSchema.parse(data);
    await userQueries.create(newUser);

    return { success: true, message: "Account created successfully." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    if (error instanceof Error) {
      return { success: false, message: error.message };
    }

    return { success: false, message: "An unexpected error occurred." };
  }
}
