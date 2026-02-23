import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type CreditType = "monthly" | "rollover" | "promo" | "purchase";

export const DeductRequestSchema = z.object({
  userId: z.string().uuid(),
  amount: z.number().int().positive(),
  reason: z.string().min(1),
});

export async function getCreditSummary(userId: string) {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("credit_ledger")
    .select("type, remaining, expires_at")
    .eq("user_id", userId)
    .gt("remaining", 0);
  if (error) throw error;

  const now = new Date();
  const active = data.filter((x) => x.type === "monthly").reduce((a, b) => a + (b.remaining ?? 0), 0);
  const rollover = data
    .filter((x) => x.type === "rollover")
    .filter((x) => !x.expires_at || new Date(x.expires_at) > now)
    .reduce((a, b) => a + (b.remaining ?? 0), 0);
  const promo = data
    .filter((x) => x.type === "promo")
    .filter((x) => !x.expires_at || new Date(x.expires_at) > now)
    .reduce((a, b) => a + (b.remaining ?? 0), 0);
  const purchase = data
    .filter((x) => x.type === "purchase")
    .filter((x) => !x.expires_at || new Date(x.expires_at) > now)
    .reduce((a, b) => a + (b.remaining ?? 0), 0);

  return { active, rollover, promo, purchase, total: active + rollover + promo + purchase };
}

/**
 * Deduct credits using order:
 * monthly -> rollover -> promo -> purchase
 * NOTE: You specified: "acumulados (rollover) são os últimos a ser utilizados".
 * Promo should also be last-ish and expires in 30 days, but product-wise we keep promo after rollover
 * only if you prefer. Here we follow the requested order:
 * monthly -> promo -> purchase -> rollover (rollover last)
 *
 * If you want the earlier order, change `ORDER`.
 */
const ORDER: CreditType[] = ["monthly", "promo", "purchase", "rollover"];

export async function deductCredits(input: z.infer<typeof DeductRequestSchema>) {
  const parsed = DeductRequestSchema.parse(input);
  const sb = supabaseAdmin();

  // Fetch ledgers in the chosen priority order.
  const { data, error } = await sb
    .from("credit_ledger")
    .select("id,type,remaining,expires_at,created_at")
    .eq("user_id", parsed.userId)
    .gt("remaining", 0)
    .order("created_at", { ascending: true });

  if (error) throw error;

  const now = new Date();
  const valid = (row: any) => !row.expires_at || new Date(row.expires_at) > now;

  let needed = parsed.amount;
  const updates: Array<{ id: string; newRemaining: number }> = [];

  for (const t of ORDER) {
    if (needed <= 0) break;
    const bucket = data.filter((r) => r.type === t).filter(valid);
    for (const row of bucket) {
      if (needed <= 0) break;
      const take = Math.min(needed, row.remaining);
      const newRemaining = row.remaining - take;
      updates.push({ id: row.id, newRemaining });
      needed -= take;
    }
  }

  if (needed > 0) {
    return { ok: false, reason: "INSUFFICIENT_CREDITS" as const };
  }

  // Apply updates
  for (const u of updates) {
    const { error: e2 } = await sb.from("credit_ledger").update({ remaining: u.newRemaining }).eq("id", u.id);
    if (e2) throw e2;
  }

  // Log
  await sb.from("usage_events").insert({
    user_id: parsed.userId,
    tool: "credits",
    model: "n/a",
    input_tokens_est: 0,
    output_tokens_est: 0,
    cost_est_brl: 0,
    meta: { reason: parsed.reason, amount: parsed.amount, debits: updates },
  });

  return { ok: true as const };
}

export async function grantPromoCreditsOnce(userId: string) {
  const sb = supabaseAdmin();
  const { data: user, error } = await sb.from("users").select("id,promo_used").eq("id", userId).single();
  if (error) throw error;
  if (user.promo_used) return { ok: false, reason: "PROMO_ALREADY_USED" as const };

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await sb.from("credit_ledger").insert({
    user_id: userId,
    type: "promo",
    amount: 10,
    remaining: 10,
    expires_at: expiresAt.toISOString(),
  });

  await sb.from("users").update({ promo_used: true }).eq("id", userId);
  return { ok: true as const };
}
