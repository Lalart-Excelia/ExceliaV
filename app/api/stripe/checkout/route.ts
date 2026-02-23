import Stripe from "stripe";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/server/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

const Body = z.object({
  kind: z.enum(["promo10", "export_pdf", "export_pptx", "credits_pack_100", "credits_pack_300", "credits_pack_1000"]),
  // optional reference for export to a specific dashboard id
  refId: z.string().optional(),
});

function priceFor(kind: string) {
  // TODO: in production, prefer Stripe Products/Prices.
  // Here we use inline price_data for speed.
  switch (kind) {
    case "promo10": return { amount: 299, name: "Excelia • 10 créditos promocionais (1x)", meta: { type: "promo" } };
    case "export_pdf": return { amount: 499, name: "Excelia • Export Dashboard PDF (avulso)", meta: { type: "pdf" } };
    case "export_pptx": return { amount: 699, name: "Excelia • Export Dashboard PPTX (avulso)", meta: { type: "pptx" } };
    case "credits_pack_100": return { amount: 1900, name: "Excelia • Pacote 100 créditos", meta: { type: "credits_pack", credits: "100" } };
    case "credits_pack_300": return { amount: 4900, name: "Excelia • Pacote 300 créditos", meta: { type: "credits_pack", credits: "300" } };
    case "credits_pack_1000": return { amount: 13900, name: "Excelia • Pacote 1000 créditos", meta: { type: "credits_pack", credits: "1000" } };
    default: throw new Error("Unknown kind");
  }
}

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });

  const body = Body.parse(await req.json());
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const p = priceFor(body.kind);

  // record purchase intent
  const sb = supabaseAdmin();
  const { data: purchase, error } = await sb.from("purchases").insert({
    user_id: user.id,
    type: p.meta.type,
    provider: "stripe",
    amount_brl: (p.amount / 100),
    currency: "BRL",
    status: "created",
    meta: { kind: body.kind, refId: body.refId ?? null },
  }).select("id").single();
  if (error) return NextResponse.json({ error: "PURCHASE_CREATE_FAILED", details: error.message }, { status: 500 });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    currency: "brl",
    // Pix for avulsos: allow automatic methods (includes Pix when enabled) OR explicitly set payment_method_types.
    // Using automatic_payment_methods is simpler.
    automatic_payment_methods: { enabled: true },
    line_items: [{
      quantity: 1,
      price_data: {
        currency: "brl",
        unit_amount: p.amount,
        product_data: {
          name: p.name,
          metadata: { ...p.meta, purchase_id: purchase.id },
        },
      },
    }],
    success_url: `${siteUrl}/app/billing?success=1`,
    cancel_url: `${siteUrl}/app/billing?canceled=1`,
    metadata: { purchase_id: purchase.id, kind: body.kind, refId: body.refId ?? "" },
  });

  await sb.from("purchases").update({ status: "pending", provider_ref: session.id }).eq("id", purchase.id);

  return NextResponse.json({ url: session.url });
}
