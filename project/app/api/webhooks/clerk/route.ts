import userQueries from "@/lib/queries/users";
import {
  createUserSchema,
  updateUserSchema,
  userClerkIdSchema
} from "@/lib/validations/users";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
  const CLERK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  const { data, type } = await verifyWebhook(req, {
    signingSecret: CLERK_SECRET
  });

  try {
    // Webhook Action: On user created
    if (type === "user.created") {
      const validatedData = createUserSchema.parse({
        clerkId: data.id,
        email: data.email_addresses[0].email_address,
        name: `${data.first_name} ${data.last_name}`,
        imageUrl: data.image_url
      });

      await userQueries.create(validatedData);
      return new Response("[Synced] Account created.", { status: 200 });
    }

    // Webhook: On user updated
    else if (type === "user.updated") {
      const validatedData = updateUserSchema.parse({
        email: data.email_addresses[0].email_address,
        name: `${data.first_name} ${data.last_name}`,
        updatedAt: new Date().toISOString(),
        imageUrl: data.image_url
      });

      await userQueries.updateByClerkId(data.id, validatedData);
      return new Response("[Synced] Account updated.", { status: 200 });
    }

    // Webhook: On user deleted
    else if (type === "user.deleted") {
      const validatedClerkId = userClerkIdSchema.parse(data.id);
      await userQueries.deleteByClerkId(validatedClerkId);
      return new Response("[Synced] Account deleted.", { status: 200 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.issues[0].message, { status: 400 });
    }

    if (error instanceof Error) {
      return new Response(error.message, { status: 400 });
    }

    return new Response("Unexpected Error Occured.", { status: 500 });
  }
}
