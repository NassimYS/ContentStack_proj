import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
const CONTENTSTACK_API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;
const CONTENTSTACK_MANAGEMENT_TOKEN = process.env.CONTENTSTACK_MANAGEMENT_TOKEN;

export async function POST(req: NextRequest) {
  // Vérifier le secret du webhook
  const secret = req.headers.get("x-webhook-secret");
  if (!WEBHOOK_SECRET || secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const event = body.event;
    const data = body.data || {};

    console.log(`[Webhook] Event: ${event}`);

    // Vérifier que c'est un changement de workflow vers "Approved"
    const workflowStage = data.workflow?.workflow_stage?.name;
    const contentTypeUid = data.content_type?.uid;
    const entryUid = data.entry?.uid;
    const locale = data.entry?.locale || "fr";

    console.log(`[Webhook] Stage: ${workflowStage}, Entry: ${entryUid}, CT: ${contentTypeUid}`);

    if (workflowStage === "Approved" && entryUid && contentTypeUid) {
      console.log(`[Webhook] Publishing entry ${entryUid}...`);

      // Appeler l'API Management Contentstack pour publier
      const publishResponse = await fetch(
        `https://api.contentstack.io/v3/content_types/${contentTypeUid}/entries/${entryUid}/publish`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            api_key: CONTENTSTACK_API_KEY || "",
            authorization: CONTENTSTACK_MANAGEMENT_TOKEN || "",
          },
          body: JSON.stringify({
            entry: {
              environments: ["production"],
              locales: [locale],
            },
          }),
        }
      );

      const result = await publishResponse.json();

      if (publishResponse.ok) {
        console.log(`[Webhook] Entry ${entryUid} published successfully`);
        return NextResponse.json({ success: true, message: `Entry ${entryUid} published` });
      } else {
        console.error(`[Webhook] Publish failed:`, result);
        return NextResponse.json({ error: "Publish failed", details: result }, { status: 500 });
      }
    }

    return NextResponse.json({ message: "Event received, no action needed" });
  } catch (error) {
    console.error("[Webhook] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
