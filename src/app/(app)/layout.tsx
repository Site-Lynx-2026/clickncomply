import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { logoutAction } from "./actions";
import { AppNavLink } from "./_components/app-nav-link";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b bg-background sticky top-0 z-30">
        <div className="container mx-auto max-w-6xl px-6 h-14 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6 min-w-0">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest hover:text-foreground/70 transition shrink-0"
            >
              <span className="size-1.5 rounded-full bg-brand" />
              ClickNComply
            </Link>
            <nav className="hidden sm:flex items-center gap-1">
              <AppNavLink href="/dashboard">Dashboard</AppNavLink>
              <AppNavLink href="/projects">Projects</AppNavLink>
              <AppNavLink href="/clients">Clients</AppNavLink>
              <AppNavLink href="/account">Account</AppNavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-muted-foreground hidden md:inline">
              {user.email}
            </span>
            <form action={logoutAction}>
              <Button variant="ghost" size="sm" type="submit">
                Log out
              </Button>
            </form>
          </div>
        </div>
        {/* Mobile-only secondary nav row — visible below sm breakpoint */}
        <nav className="sm:hidden flex items-center gap-1 px-4 py-1 border-t overflow-x-auto">
          <AppNavLink href="/dashboard">Dashboard</AppNavLink>
          <AppNavLink href="/projects">Projects</AppNavLink>
          <AppNavLink href="/clients">Clients</AppNavLink>
          <AppNavLink href="/account">Account</AppNavLink>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
