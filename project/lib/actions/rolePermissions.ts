"use server";

import { GetPermissionsPayload } from "@/types/rolePermissions";
import { ZodError } from "zod";
import { handleDispatchError } from "../utils/dispatch-error";
import { getPermissions as getPermissionsUtil } from "../utils/rolePermissions";
import { getUserId } from "../utils/users";
import { getPermissionsPayloadSchema } from "../validations/permissions";

export default async function getPermissions(payload: GetPermissionsPayload) {
  try {
    const userId = await getUserId();
    const parsed = getPermissionsPayloadSchema.parse(payload);

    return {
      success: true,
      message: "Permissions retrieved successfully.",
      permissions: await getPermissionsUtil(userId, parsed.projectId)
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    handleDispatchError(error);
  }
}
