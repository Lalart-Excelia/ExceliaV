import { NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/server/auth";
import { deductCredits } from "@/server/credits";
import { anthropicClient, chooseModel, estimateComplexity } from "@/server/ai/router";

export const runtime = "nodejs";

const Body = z.object({
  platform: z.enum(["excel","sheets"]),
  prompt: z.string().min(3),
  isFree: z.boolean().default(false),
});

export async function POST(req: Request) {
  const user = await getUser();
  const body = Body.parse(await req.json());

  const complexity = estimateComplexity(body.prompt);
  const cost = complexity >= 60 ? 2 : 1;

  if (!body.isFree) {
    if (!user) return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
    const debit = await deductCredits({ userId: user.id, amount: cost, reason: "formula_generate" });
    if (!debit.ok) return NextResponse.json({ error: debit.reason }, { status: 402 });
  }

  const model = chooseModel({ tool: "formula", isFree: body.isFree, complexity });
  const client = anthropicClient();

  const msg = await client.messages.create({
    model,
    max_tokens: 450,
    system: "Você é um especialista em fórmulas de planilhas. Responda com: formula, explanation, variants. Evite erros de sintaxe. Considere pt-BR.",
    messages: [{ role: "user", content: `Plataforma: ${body.platform}. Pedido: ${body.prompt}` }],
  });

  const text = (msg.content[0] as any)?.text ?? "";
  return NextResponse.json({ model, complexity, costCredits: cost, raw: text });
}
