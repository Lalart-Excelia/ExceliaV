import Anthropic from "@anthropic-ai/sdk";

export type AiModel = "claude-3-5-haiku-latest" | "claude-3-5-sonnet-latest";
export type Tool = "dashboard" | "excel_master" | "formula" | "template" | "script";

export function chooseModel(params: { tool: Tool; isFree: boolean; complexity: number }) {
  // Free: economical by default
  if (params.isFree) return "claude-3-5-haiku-latest" as AiModel;

  // Paid: Dashboard & Excel Master always premium
  if (params.tool === "dashboard" || params.tool === "excel_master") return "claude-3-5-sonnet-latest" as AiModel;

  // Others: route by complexity
  return params.complexity >= 60 ? ("claude-3-5-sonnet-latest" as AiModel) : ("claude-3-5-haiku-latest" as AiModel);
}

export function estimateComplexity(text: string) {
  const t = text.toLowerCase();
  const hits = [
    "lambda","let","arrayformula","query","regex","pivot","janela","window","join","xlookup","procv","proch","xm","matriz","dinâmica"
  ].filter((k) => t.includes(k)).length;
  const lenScore = Math.min(40, Math.floor(text.length / 40));
  return Math.min(100, hits * 15 + lenScore);
}

export function anthropicClient() {
  const key = process.env.ANTHROPIC_API_KEY!;
  return new Anthropic({ apiKey: key });
}
