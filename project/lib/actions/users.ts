"use server";

import {
  CreateUserPayload,
  DeleteUserPayload,
  EditProfilePayload,
  UpdateUserPayload
} from "@/types/users";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { ZodError } from "zod";
import userQueries from "../queries/users";
import {
  createUserPayloadSchema,
  deleteUserPayloadSchema,
  editProfilePayloadSchema,
  updateUserPayloadSchema
} from "../validations/users";

export async function getProfileEditData() {
  try {
    const user = await currentUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized. You are not logged in."
      };
    }

    const { imageUrl, lastName, firstName, emailAddresses } = user;

    const data = {
      imageUrl: imageUrl,
      lastName: lastName ?? "",
      firstName: firstName ?? "",
      email: emailAddresses[0].emailAddress
    };

    return {
      success: true,
      message: "Profile settings data retrieved successfully.",
      data
    };
  } catch {
    return {
      success: false,
      message: "Error. Cannot retrieve profile settings data."
    };
  }
}

export async function editProfile(payload: EditProfilePayload) {
  try {
    // Validate the incoming payload using Zod schema
    const parsed = editProfilePayloadSchema.parse(payload);

    // Retrieve the currently logged-in user
    const user = await currentUser();

    // If no user is logged in, return an unauthorized response
    if (!user) {
      return {
        success: false,
        message: "Unauthorized. You are not logged in."
      };
    }

    // Initialize the Clerk client
    const client = await clerkClient();

    // Store the current primary email ID for demotion later
    const currentPrimaryEmailId = user.primaryEmailAddressId;
    const currentEmail = user.primaryEmailAddress?.emailAddress as string;

    if (currentEmail && currentEmail !== parsed.email) {
      try {
        // Create the new email address (not primary yet to avoid conflict)
        const newEmailResponse = await client.emailAddresses.createEmailAddress(
          {
            userId: user.id,
            emailAddress: parsed.email,
            primary: false,
            verified: true
          }
        );

        // Promote the new email to be the primary and verified one
        await client.emailAddresses.updateEmailAddress(newEmailResponse.id, {
          verified: true,
          primary: true
        });

        // If a current primary email exists, demote it
        if (currentPrimaryEmailId) {
          await client.emailAddresses.deleteEmailAddress(currentPrimaryEmailId);
        }
      } catch (error) {
        return {
          success: false,
          message: "Email is already in used or cannot be used."
        };
      }
    }

    // Update the user's first and last name
    client.users.updateUser(user.id, {
      firstName: parsed.firstName,
      lastName: parsed.lastName
    });

    // Handle profile update
    if (parsed.newProfileFile) {
      await client.users.updateUserProfileImage(user.id, {
        file: parsed.newProfileFile
      });
    }

    return { success: true, message: "Profile saved successfully." };
  } catch (error) {
    console.log(error);

    // Handle validation errors from Zod
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    // Fallback error message for all other exceptions
    return { success: false, message: "Error. cannot edit profile." };
  }
}

export async function createUser(payload: CreateUserPayload) {
  try {
    const parsed = createUserPayloadSchema.parse(payload);
    await userQueries.create(parsed);
    return { success: true, message: "User created successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot create user." };
  }
}

export async function updateUser(payload: UpdateUserPayload) {
  try {
    const parsed = updateUserPayloadSchema.parse(payload);
    await userQueries.updateByClerkId(parsed);
    return { success: true, message: "User updated successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot update user." };
  }
}

export async function deleteUser(payload: DeleteUserPayload) {
  try {
    const parsed = deleteUserPayloadSchema.parse(payload);
    await userQueries.softDeleteByClerkId(parsed.clerkId);
    return { success: true, message: "User deleted successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return { success: false, message: "Error. Cannot delete user." };
  }
}
