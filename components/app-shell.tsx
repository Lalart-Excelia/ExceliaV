"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { Home, LayoutDashboard, MessageSquareText, FunctionSquare, LayoutTemplate, Code2, GitMerge, CreditCard } from "lucide-react";

const nav = [
  { href: "/app", label: "Início", icon: Home },
  { href: "/app/dashboards/new", label: "Dashboards", icon: LayoutDashboard },
  { href: "/app/excel-master", label: "Excel Master", icon: MessageSquareText },
  { href: "/app/formulas", label: "Fórmulas", icon: FunctionSquare },
  { href: "/app/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/app/scripts", label: "Scripts", icon: Code2 },
  { href: "/app/automations", label: "Automações", icon: GitMerge },
  { href: "/app/billing", label: "Créditos & Plano", icon: CreditCard },
];

export function AppShell({ children, creditSummary }: { children: React.ReactNode; creditSummary?: { active: number; rollover: number; promo: number; purchase: number; total: number } }) {
  const path = usePathname();
  return (
    <div className="min-h-screen grid lg:grid-cols-[260px_1fr]">
      <aside className="border-r" style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg2) 75%, transparent)" }}>
        <div className="h-16 px-4 flex items-center justify-between border-b" style={{ borderColor: "var(--border)" }}>
          <Link href="/" className="font-semibold">Excelia</Link>
          <span className="badge">app</span>
        </div>
        <nav className="p-2 space-y-1">
          {nav.map((i) => {
            const active = path === i.href;
            const Icon = i.icon;
            return (
              <Link key={i.href} href={i.href} className={cn("btn w-full justify-start", active && "btn-primary")} style={{ borderRadius: 12 }}>
                <Icon size={16} />
                {i.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0">
        <header className="h-16 px-4 flex items-center justify-between border-b" style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg) 70%, transparent)", backdropFilter: "blur(10px)" }}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="badge">Créditos: <b style={{ color: "var(--tx)" }}>{creditSummary?.total ?? "—"}</b></span>
            <span className="badge">Mês: {creditSummary?.active ?? "—"}</span>
            <span className="badge">Acumulado: {creditSummary?.rollover ?? "—"}</span>
            <span className="badge">Promo: {creditSummary?.promo ?? "—"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link className="btn" href="/app/billing">Comprar créditos</Link>
            <ThemeToggle />
          </div>
        </header>

        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
