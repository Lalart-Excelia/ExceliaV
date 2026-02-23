"use client";

import React from "react";

async function startCheckout(kind: string) {
  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ kind }),
  });
  const data = await res.json();
  if (!res.ok) {
    alert(data?.error ?? "Erro ao iniciar pagamento. Faça login.");
    return;
  }
  window.location.href = data.url;
}

export default function BillingPage() {
  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="text-2xl font-semibold">Créditos & Plano</div>
        <p className="mt-2" style={{ color: "var(--tx2)" }}>
          Assinatura (cartão) será implementada via Stripe Billing. Neste V1 você escolheu: <b>Pix apenas para avulsos</b> (promo, pacotes e export).
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="font-semibold">Promo (Free)</div>
          <p className="mt-2 text-sm" style={{ color: "var(--tx2)" }}>
            10 créditos promocionais por <b>R$ 2,99</b> (1x por usuário, validade 30 dias). Adicional ao dashboard grátis do mês.
          </p>
          <button className="btn btn-primary mt-4 w-full" onClick={() => startCheckout("promo10")}>
            Comprar promo por Pix
          </button>
        </div>

        <div className="card p-6">
          <div className="font-semibold">Pacotes de créditos</div>
          <p className="mt-2 text-sm" style={{ color: "var(--tx2)" }}>
            Use quando acabar crédito e você quiser continuar usando as ferramentas premium.
          </p>
          <div className="mt-4 space-y-2">
            <button className="btn w-full" onClick={() => startCheckout("credits_pack_100")}>100 créditos • R$ 19</button>
            <button className="btn w-full" onClick={() => startCheckout("credits_pack_300")}>300 créditos • R$ 49</button>
            <button className="btn w-full" onClick={() => startCheckout("credits_pack_1000")}>1000 créditos • R$ 139</button>
          </div>
        </div>

        <div className="card p-6">
          <div className="font-semibold">Export avulso (sem créditos)</div>
          <p className="mt-2 text-sm" style={{ color: "var(--tx2)" }}>
            Se você não tiver créditos e não quiser comprar pacote, pague apenas a extração.
          </p>
          <div className="mt-4 space-y-2">
            <button className="btn w-full" onClick={() => startCheckout("export_pdf")}>Dashboard PDF • R$ 4,99</button>
            <button className="btn btn-primary w-full" onClick={() => startCheckout("export_pptx")}>Dashboard PPTX • R$ 6,99</button>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="font-semibold">Regra de rollover</div>
        <p className="mt-2 text-sm" style={{ color: "var(--tx2)" }}>
          50% dos créditos não usados acumulam para o próximo mês, são consumidos por último e expiram em 6 meses. Teto de acúmulo: 2x o valor mensal do plano.
        </p>
        <p className="mt-2 text-sm" style={{ color: "var(--tx2)" }}>
          Ordem de consumo (como você escolheu): <b>mês → promo → compra → acumulado</b>.
        </p>
      </div>
    </div>
  );
}
