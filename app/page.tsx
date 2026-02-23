import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

export default function HomePage() {
  return (
    <div>
      <SiteNav right={<Link className="btn btn-primary" href="/app">Abrir app</Link>} />
      <main className="container py-10">
        <section className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">
              Dashboards e respostas inteligentes a partir de qualquer planilha.
            </h1>
            <p style={{ color: "var(--tx2)" }} className="text-lg">
              Faça upload, pergunte e exporte em minutos. Comece grátis e desbloqueie qualidade premium em dashboards e no agente especialista.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link className="btn btn-primary" href="/app/dashboards/new">Gerar meu primeiro dashboard</Link>
              <Link className="btn" href="/app/excel-master">Conversar com especialista</Link>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="badge">Free: 10 créditos + 1 dashboard/mês</span>
              <span className="badge">Rollover: 50% por 6 meses</span>
              <span className="badge">Export avulso: PDF R$4,99 • PPTX R$6,99</span>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div className="font-medium">Vitrine • Dashboard Pro</div>
              <span className="badge">exemplo</span>
            </div>
            <div className="mt-4 rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--surf) 88%, transparent)" }}>
              <div className="text-sm" style={{ color: "var(--tx2)" }}>KPIs</div>
              <div className="mt-2 grid grid-cols-3 gap-3">
                {["Receita", "Margem", "Crescimento"].map((k) => (
                  <div key={k} className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>{k}</div>
                    <div className="text-xl font-semibold">—</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-36 rounded-xl border" style={{ borderColor: "var(--border)", background: "linear-gradient(180deg, color-mix(in srgb, var(--accent2) 12%, transparent), transparent)" }} />
              <div className="mt-3 text-sm" style={{ color: "var(--tx2)" }}>
                No Pro você ganha insights estratégicos completos e export sem watermark.
              </div>
            </div>

            <div className="mt-4 flex gap-2 flex-wrap">
              <Link className="btn btn-primary" href="/pricing">Ver planos</Link>
              <Link className="btn" href="/pricing#promo">Experimente por R$ 2,99</Link>
            </div>
          </div>
        </section>

        <section className="mt-12 grid md:grid-cols-3 gap-4">
          {[
            { title: "Dashboard Generator", desc: "Deck 16:9 com KPIs, gráficos e insights.", href: "/app/dashboards/new" },
            { title: "Excel Master", desc: "Editor + agente especialista aplicando mudanças em tempo real.", href: "/app/excel-master" },
            { title: "Fórmulas e Templates", desc: "Fórmulas precisas e templates com preview, salvos no seu workspace.", href: "/app/formulas" },
          ].map((c) => (
            <div key={c.title} className="card p-5">
              <div className="font-semibold">{c.title}</div>
              <p className="mt-2 text-sm" style={{ color: "var(--tx2)" }}>{c.desc}</p>
              <Link className="btn mt-4" href={c.href}>Abrir</Link>
            </div>
          ))}
        </section>
      </main>
      <footer className="container py-10 text-sm" style={{ color: "var(--muted)" }}>
        © {new Date().getFullYear()} Excelia • excelia.com.br
      </footer>
    </div>
  );
}
