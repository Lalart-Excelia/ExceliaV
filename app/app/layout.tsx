import { AppShell } from "@/components/app-shell";
import { getUser } from "@/server/auth";
import { getCreditSummary } from "@/server/credits";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  // For now, allow browsing without auth; show mock credits if not logged in.
  const summary = user ? await getCreditSummary(user.id) : { active: 10, rollover: 0, promo: 0, purchase: 0, total: 10 };
  return <AppShell creditSummary={summary}>{children}</AppShell>;
}
