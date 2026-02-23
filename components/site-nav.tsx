import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteNav({ right }: { right?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-20 border-b" style={{ borderColor: "var(--border)", backdropFilter: "blur(10px)", background: "color-mix(in srgb, var(--bg) 70%, transparent)" }}>
      <div className="container h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl" style={{ background: "color-mix(in srgb, var(--accent) 26%, var(--surf))", border: "1px solid var(--border)" }} />
          <span className="font-semibold tracking-tight">Excelia</span>
          <span className="badge">beta</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link className="btn" href="/pricing">Preços</Link>
          <Link className="btn" href="/examples">Exemplos</Link>
          <ThemeToggle />
          {right}
        </nav>
      </div>
    </header>
  );
}
