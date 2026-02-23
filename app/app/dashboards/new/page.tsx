"use client";

import React from "react";
import { UploadCloud, Sparkles, FileDown, ArrowRight } from "lucide-react";

type Slide = { title: string; body: string; kind: "cover"|"overview"|"table"|"insights"|"closing" };

export default function NewDashboardPage() {
  const [step, setStep] = React.useState<1|2|3|4|5>(1);
  const [fileName, setFileName] = React.useState<string>("");
  const [objective, setObjective] = React.useState("automático");
  const [detail, setDetail] = React.useState("resumo");
  const [slides, setSlides] = React.useState<Slide[]>([]);
  const [isFree, setIsFree] = React.useState(true);
  const [usePromoCredits, setUsePromoCredits] = React.useState(false);

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    setStep(2);
  }

  async function generate() {
    setStep(3);
    // Simula pipeline. Na integração real, chamar /api/dashboard/generate.
    await new Promise((r) => setTimeout(r, 900));
    const kpis = (isFree && !usePromoCredits) ? "3 KPIs, 2 gráficos, insight resumido (watermark)" : "5 KPIs, 4 gráficos, insights premium";
    setSlides([
      { kind:"cover", title:"Relatório Executivo", body:`Objetivo: ${objective}. Nível: ${detail}.`},
      { kind:"overview", title:"Visão Geral", body:`Resumo com ${kpis}.`},
      { kind:"table", title:"Tabela & Gráfico", body:"Destaques e ranking por segmento."},
      { kind:"insights", title:"Insights", body:"Oportunidades, riscos e próximos passos."},
      { kind:"closing", title:"Recomendação", body:"Ações sugeridas e CTA de exportação."},
    ]);
    setStep(4);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <div className="text-2xl font-semibold">Dashboard Generator</div>
          <div className="text-sm mt-1" style={{ color: "var(--tx2)" }}>Gere um deck 16:9 com KPIs, gráficos e insights. Premium garantido para pagantes.</div>
        </div>
        <label className="btn">
          <input type="checkbox" checked={!isFree} onChange={(e)=>setIsFree(!e.target.checked)} />
          <span>Simular pago</span>
        </label>
        {isFree && (
          <label className="btn">
            <input type="checkbox" checked={usePromoCredits} onChange={(e)=>setUsePromoCredits(e.target.checked)} />
            <span>Usar créditos promo (sem watermark)</span>
          </label>
        )}

      </div>

      {step === 1 && (
        <div className="card p-6">
          <div className="flex items-center gap-2 font-semibold"><UploadCloud size={18}/> Upload</div>
          <p className="mt-2 text-sm" style={{ color: "var(--tx2)" }}>Envie um CSV ou XLSX para gerar o dashboard.</p>
          <input className="input mt-4" type="file" accept=".csv,.xlsx" onChange={onPickFile} />
        </div>
      )}

      {step === 2 && (
        <div className="card p-6 space-y-4">
          <div className="font-semibold">Configuração</div>
          <div className="text-sm" style={{ color: "var(--tx2)" }}>Arquivo: <b>{fileName}</b></div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <div className="text-sm" style={{ color: "var(--tx2)" }}>Objetivo</div>
              <select className="input mt-1" value={objective} onChange={(e)=>setObjective(e.target.value)}>
                <option value="automático">Automático</option>
                <option value="vendas">Vendas</option>
                <option value="financeiro">Financeiro</option>
                <option value="marketing">Marketing</option>
                <option value="operações">Operações</option>
              </select>
            </div>
            <div>
              <div className="text-sm" style={{ color: "var(--tx2)" }}>Nível de detalhe</div>
              <select className="input mt-1" value={detail} onChange={(e)=>setDetail(e.target.value)}>
                <option value="resumo">Resumo executivo</option>
                <option value="detalhado">Detalhado</option>
              </select>
            </div>
          </div>

          <button className="btn btn-primary" onClick={generate}>
            <Sparkles size={16}/> Gerar dashboard <ArrowRight size={16}/>
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="card p-6">
          <div className="font-semibold">Gerando…</div>
          <div className="mt-3 space-y-2 text-sm" style={{ color: "var(--tx2)" }}>
            <div>• Entendendo dados</div>
            <div>• Selecionando KPIs</div>
            <div>• Criando gráficos</div>
            <div>• Gerando insights</div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Preview (16:9)</div>
              <span className="badge">{isFree ? (usePromoCredits ? "Free • promo (sem watermark)" : "Free • watermark") : "Pago • premium"}</span>
            </div>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              {slides.map((s, idx) => (
                <div key={idx} className="aspect-[16/9] rounded-xl border p-4 relative overflow-hidden" style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--surf) 88%, transparent)" }}>
                  <div className="font-semibold">{s.title}</div>
                  <div className="text-sm mt-2" style={{ color: "var(--tx2)" }}>{s.body}</div>
                  {isFree && !usePromoCredits && idx>0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold opacity-15 rotate-[-20deg]" style={{ color: "var(--tx)" }}>
                      AMOSTRA
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <div className="font-semibold">Export</div>
            <p className="mt-2 text-sm" style={{ color: "var(--tx2)" }}>
              PDF (1 crédito) • PPTX (2 créditos). Se faltar crédito, pode pagar avulso: PDF R$4,99 / PPTX R$6,99.
              No Free o download mantém watermark e conta 2 downloads/mês.
            </p>
            <div className="mt-4 flex gap-2 flex-wrap">
              <button className="btn"><FileDown size={16}/> Baixar PDF</button>
              <button className="btn btn-primary"><FileDown size={16}/> Baixar PPTX</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
