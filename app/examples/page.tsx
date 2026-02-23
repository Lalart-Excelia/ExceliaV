import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

export default function ExamplesPage() {
  return (
    <div>
      <SiteNav right={<Link className="btn btn-primary" href="/app">Abrir app</Link>} />
      <main className="container py-10">
        <h1 className="text-4xl font-semibold">Exemplos</h1>
        <p className="mt-2" style={{ color: "var(--tx2)" }}>
          Dashboards Pro (exemplos públicos) para mostrar o valor premium sem depender de dados reais de usuários.
        </p>

        <div className="mt-8 grid md:grid-cols-2 gap-4">
          {[1,2].map((n) => (
            <div key={n} className="card p-5">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Dashboard Executivo #{n}</div>
                <span className="badge">Pro</span>
              </div>
              <div className="mt-4 aspect-[16/9] rounded-xl border" style={{ borderColor: "var(--border)", background: "linear-gradient(135deg, color-mix(in srgb, var(--accent) 18%, transparent), color-mix(in srgb, var(--accent2) 12%, transparent))" }} />
              <div className="mt-3 text-sm" style={{ color: "var(--tx2)" }}>
                KPIs, gráficos e insights estratégicos com layout pronto para reunião.
              </div>
              <div className="mt-4 flex gap-2">
                <Link className="btn btn-primary" href="/pricing#promo">Testar por R$ 2,99</Link>
                <Link className="btn" href="/pricing">Ver planos</Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
