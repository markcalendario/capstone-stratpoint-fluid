import { createUserAccount } from "@/actions/users";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const CLERK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  const evt = await verifyWebhook(req, { signingSecret: CLERK_SECRET });

  const { data, type } = evt;

  // Webhook Action: On user created
  if (type === "user.created") {
    const { email_addresses, id: clerkId, first_name, last_name } = data;
    const email = email_addresses[0].email_address;
    const name = `${first_name} ${last_name}`;

    const { success, message } = await createUserAccount({
      name,
      email,
      clerkId
    });

    if (!success) return new Response(message, { status: 400 });
  }

  return new Response("Webhook Process Done", { status: 200 });
}
