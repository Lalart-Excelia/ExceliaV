import Link from "next/link";

export default function AppHome() {
  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="text-2xl font-semibold">Bem-vindo à Excelia</div>
        <p className="mt-2" style={{ color: "var(--tx2)" }}>
          Comece gerando um dashboard ou conversando com o Excel Master. Você controla custos por créditos e pode exportar em PDF/PPTX.
        </p>
        <div className="mt-4 flex gap-2 flex-wrap">
          <Link className="btn btn-primary" href="/app/dashboards/new">Gerar dashboard</Link>
          <Link className="btn" href="/app/excel-master">Abrir Excel Master</Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { t: "Dashboards", d: "Deck 16:9 com insights.", h: "/app/dashboards/new" },
          { t: "Fórmulas", d: "Alta precisão com RAG.", h: "/app/formulas" },
          { t: "Templates", d: "Preview + edição no browser.", h: "/app/templates" },
        ].map((x) => (
          <div key={x.t} className="card p-5">
            <div className="font-semibold">{x.t}</div>
            <p className="mt-2 text-sm" style={{ color: "var(--tx2)" }}>{x.d}</p>
            <Link className="btn mt-4" href={x.h}>Abrir</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
