"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * App-header navigation link with active-route highlighting.
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
        "px-2.5 py-1 text-sm rounded-md transition",
        active
          ? "text-foreground font-medium bg-muted"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
    >
      {children}
    </Link>
  );
}
