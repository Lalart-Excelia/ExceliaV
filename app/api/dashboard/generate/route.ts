import { NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/server/auth";
import { deductCredits } from "@/server/credits";
import { anthropicClient, chooseModel, estimateComplexity } from "@/server/ai/router";

export const runtime = "nodejs";

const Body = z.object({
  prompt: z.string().min(3),
  // In production: fileId + summarized dataset
  datasetSummary: z.any().optional(),
  isFree: z.boolean().default(false),
});

export async function POST(req: Request) {
  const user = await getUser();
  const body = Body.parse(await req.json());

  // Credits: dashboard costs 8 for paid generation (free has 1 free/month logic handled elsewhere).
  if (!body.isFree) {
    if (!user) return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
    const debit = await deductCredits({ userId: user.id, amount: 8, reason: "dashboard_generate" });
    if (!debit.ok) return NextResponse.json({ error: debit.reason }, { status: 402 });
  }

  const complexity = estimateComplexity(body.prompt);
  const model = chooseModel({ tool: "dashboard", isFree: body.isFree, complexity });

  const client = anthropicClient();

  // TODO: Replace with multi-step pipeline.
  const msg = await client.messages.create({
    model,
    max_tokens: 900,
    system: "Você é o agente de Dashboards da Excelia. Gere um deck 16:9 com 5 slides (cover, overview, table, insights, closing). Responda em JSON estrito.",
    messages: [{ role: "user", content: body.prompt }],
  });

  const text = (msg.content[0] as any)?.text ?? "";
  return NextResponse.json({ model, complexity, raw: text });
}
