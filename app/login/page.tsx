import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

export default function LoginPage() {
  return (
    <div>
      <SiteNav right={<Link className="btn btn-primary" href="/signup">Criar conta</Link>} />
      <main className="container py-10">
        <div className="card p-6">
          <div className="text-2xl font-semibold">Login</div>
          <p className="mt-2" style={{ color: "var(--tx2)" }}>
            Esta tela será conectada ao Supabase Auth (magic link / email+senha). Por enquanto é um placeholder.
          </p>
          <div className="mt-4 flex gap-2">
            <Link className="btn btn-primary" href="/app">Entrar (mock)</Link>
            <Link className="btn" href="/signup">Criar conta</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
