import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { logoutAction } from "./actions";

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
        <div className="container mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest hover:text-foreground/70 transition"
          >
            <span className="size-1.5 rounded-full bg-brand" />
            ClickNComply
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {user.email}
            </span>
            <form action={logoutAction}>
              <Button variant="ghost" size="sm" type="submit">
                Log out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
