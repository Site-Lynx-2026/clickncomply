"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * App-header navigation link with active-route highlighting.
 * Active state uses the lime brand soft fill so the brand colour finally
 * appears in interactive feedback (it was previously just `bg-muted` — no
 * brand presence anywhere in the nav).
 *
 * Active when path matches exactly OR starts with the link's href + "/".
 */
export function AppNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active =
    pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "relative px-3 py-1.5 text-sm rounded-md transition-colors",
        active
          ? "text-foreground font-semibold bg-brand-soft"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
      )}
    >
      {/* Brand pip on active — small lime dot before label. Subtle but
          consistent with the sidebar treatment. */}
      {active && (
        <span
          className="absolute left-1.5 top-1/2 -translate-y-1/2 size-1 rounded-full bg-brand"
          aria-hidden
        />
      )}
      <span className={active ? "ml-2" : undefined}>{children}</span>
    </Link>
  );
}
