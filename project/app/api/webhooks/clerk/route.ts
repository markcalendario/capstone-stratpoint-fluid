import { createUser, deleteUser, updateUser } from "@/lib/actions/users";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const CLERK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  const { data, type } = await verifyWebhook(req, {
    signingSecret: CLERK_SECRET
  });

  // Webhook Action: On user created
  if (type === "user.created") {
    const payload = {
      clerkId: data.id,
      email: data.email_addresses[0].email_address,
      name: `${data.first_name} ${data.last_name}`,
      imageUrl: data.image_url
    };

    const { success, message } = await createUser(payload);
    return new Response(message, { status: success ? 200 : 400 });
  }

  // Webhook: On user updated
  else if (type === "user.updated") {
    const payload = {
      clerkId: data.id,
      imageUrl: data.image_url,
      updatedAt: new Date().toISOString(),
      email: data.email_addresses[0].email_address,
      name: `${data.first_name} ${data.last_name}`
    };

    const { success, message } = await updateUser(payload);
    return new Response(message, { status: success ? 200 : 400 });
  }

  // Webhook: On user deleted
  else if (type === "user.deleted") {
    if (!data.id) {
      return new Response("[Error] Account cannot be deleted.", {
        status: 404
      });
    }

    const payload = { clerkId: data.id };

    await deleteUser(payload);
    return new Response("[Synced] Account deleted.", { status: 200 });
  }
}
