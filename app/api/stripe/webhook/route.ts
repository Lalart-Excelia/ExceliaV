import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export async function POST(req: Request) {
  const sig = headers().get("stripe-signature");
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);

    // TODO: handle:
    // - checkout.session.completed (promo credits, credit packs, export single)
    // - invoice.paid / customer.subscription.* (subscriptions)
    // Write to purchases table + grant credits if needed.

    const sb = supabaseAdmin();
    await sb.from("usage_events").insert({
      user_id: null,
      tool: "stripe_webhook",
      model: "n/a",
      input_tokens_est: 0,
      output_tokens_est: 0,
      cost_est_brl: 0,
      meta: { type: event.type },
    });

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
