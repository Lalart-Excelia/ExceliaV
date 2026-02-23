import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

const plans = [
  { name: "Free", price: "R$ 0", desc: "Para testar", items: ["10 créditos/mês", "1 dashboard/mês (watermark)", "2 downloads/mês (com watermark)", "5 itens salvos", "Anúncios"], cta: { label: "Começar", href: "/app" } },
  { name: "Starter", price: "R$ 29", desc: "Uso leve", items: ["150 créditos/mês", "Rollover 50% por 6 meses", "20 itens salvos", "Dashboards e Excel Master premium"], cta: { label: "Assinar", href: "/app/billing" } },
  { name: "Pro", price: "R$ 59", desc: "Plano principal", items: ["400 créditos/mês", "Rollover 50% por 6 meses", "100 itens salvos", "Dashboards premium + Excel Master premium"], highlight: true, cta: { label: "Assinar Pro", href: "/app/billing" } },
  { name: "Business", price: "R$ 149", desc: "Uso intenso", items: ["1200 créditos/mês", "Rollover 50% por 6 meses", "Ilimitado (itens)", "Dashboards premium + Excel Master premium"], cta: { label: "Assinar", href: "/app/billing" } },
];

export default function PricingPage() {
  return (
    <div>
      <SiteNav right={<Link className="btn btn-primary" href="/app">Abrir app</Link>} />
      <main className="container py-10">
        <h1 className="text-4xl font-semibold">Preços</h1>
        <p className="mt-2" style={{ color: "var(--tx2)" }}>
          Créditos mensais com <b>50% de rollover</b> (usados por último) e expiração em <b>6 meses</b>.
        </p>

        <div className="mt-8 grid lg:grid-cols-4 gap-4">
          {plans.map((p) => (
            <div key={p.name} className="card p-5" style={p.highlight ? { borderColor: "color-mix(in srgb, var(--accent) 55%, var(--border))" } : undefined}>
              <div className="flex items-center justify-between">
                <div className="font-semibold">{p.name}</div>
                {p.highlight ? <span className="badge" style={{ color: "var(--tx)", borderColor: "color-mix(in srgb, var(--accent) 55%, var(--border))" }}>Recomendado</span> : null}
              </div>
              <div className="mt-2 text-3xl font-semibold">{p.price}<span className="text-sm" style={{ color: "var(--muted)" }}>/mês</span></div>
              <p className="mt-1 text-sm" style={{ color: "var(--tx2)" }}>{p.desc}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {p.items.map((it) => <li key={it} style={{ color: "var(--tx2)" }}>• {it}</li>)}
              </ul>
              <Link className="btn btn-primary mt-5 w-full" href={p.cta.href}>{p.cta.label}</Link>
            </div>
          ))}
        </div>

        <section id="promo" className="mt-10 card p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-lg font-semibold">Experimente o Dashboard Pro por R$ 2,99</div>
              <div className="text-sm mt-1" style={{ color: "var(--tx2)" }}>
                Receba 10 créditos promocionais (1x por usuário, validade 30 dias) — adicional ao seu dashboard grátis do mês.
              </div>
            </div>
            <Link className="btn btn-primary" href="/app/billing">Desbloquear oferta</Link>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Export avulso (sem créditos)</h2>
          <p className="mt-2 text-sm" style={{ color: "var(--tx2)" }}>
            Se acabar o crédito e você não quiser comprar pacote, pode pagar apenas a extração:
          </p>
          <div className="mt-3 flex gap-2 flex-wrap">
            <span className="badge">PDF: R$ 4,99</span>
            <span className="badge">PPTX: R$ 6,99</span>
          </div>
        </section>
      </main>
    </div>
  );
}
