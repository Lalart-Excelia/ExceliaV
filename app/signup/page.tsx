import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

export default function SignupPage() {
  return (
    <div>
      <SiteNav right={<Link className="btn btn-primary" href="/login">Já tenho conta</Link>} />
      <main className="container py-10">
        <div className="card p-6">
          <div className="text-2xl font-semibold">Criar conta</div>
          <p className="mt-2" style={{ color: "var(--tx2)" }}>
            Esta tela será conectada ao Supabase Auth. Por enquanto é um placeholder.
          </p>
          <div className="mt-4 flex gap-2">
            <Link className="btn btn-primary" href="/app">Continuar (mock)</Link>
            <Link className="btn" href="/login">Login</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
