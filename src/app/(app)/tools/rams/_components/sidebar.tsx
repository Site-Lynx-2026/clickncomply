"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SIDEBAR_ITEMS, type SidebarItem } from "@/lib/rams/sidebar-items";
import {
  ArrowLeft,
  ChevronsLeft,
  ChevronsRight,
  FolderOpen,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * RAMs sidebar — flat 10-entry list, no sections, no library.
 *
 * Down from 37/8 to 10/0. The four umbrella entries (Permit, Briefing,
 * Inspection, Plan) link to picker pages that surface their variants;
 * the rest link directly to their builder. The 26 hidden slugs still
 * work as deep links from AI intake or direct URL.
 */

export function RAMsSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden md:flex shrink-0 border-r bg-sidebar text-sidebar-foreground",
        "flex-col sticky top-0 self-start",
        "h-screen",
        collapsed ? "w-[68px]" : "w-[260px]",
        "transition-[width] duration-150 ease-out"
      )}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b">
        {!collapsed && (
          <Link
            href="/tools/rams"
            className="flex items-center gap-2 text-base font-semibold tracking-tight hover:opacity-70 transition"
          >
            <span className="size-1.5 rounded-full bg-brand" />
            RAMs
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronsRight className="size-4" />
          ) : (
            <ChevronsLeft className="size-4" />
          )}
        </button>
      </div>

      <SidebarBody collapsed={collapsed} />
    </aside>
  );
}

export function RAMsSidebarMobileTrigger() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeOnNav = () => setOpen(false);

  return (
    <div className="md:hidden border-b bg-background sticky top-12 z-20">
      <Sheet open={open} onOpenChange={setOpen}>
        <div className="flex items-center gap-2 px-4 py-2">
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="-ml-2">
              <Menu className="size-4 mr-1.5" />
              Menu
            </Button>
          </SheetTrigger>
          <span className="font-semibold text-sm tracking-tight">RAMs</span>
        </div>
        <SheetContent
          side="left"
          className="p-0 w-[280px] flex flex-col bg-sidebar text-sidebar-foreground"
        >
          <SheetHeader className="px-4 py-4 border-b">
            <SheetTitle className="text-base font-semibold tracking-tight inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-brand" />
              RAMs
            </SheetTitle>
          </SheetHeader>
          <div onClick={closeOnNav} className="flex-1 flex flex-col min-h-0">
            <SidebarBody collapsed={false} pathname={pathname} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SidebarBody({
  collapsed,
  pathname: pathnameOverride,
}: {
  collapsed: boolean;
  pathname?: string;
}) {
  const pathnameFromHook = usePathname();
  const pathname = pathnameOverride ?? pathnameFromHook;

  return (
    <>
      {/* Back to dashboard */}
      <Link
        href="/dashboard"
        className={cn(
          "flex items-center gap-2.5 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition border-b",
          collapsed && "justify-center px-0"
        )}
        title="Back to dashboard"
      >
        <ArrowLeft className="size-4 shrink-0" />
        {!collapsed && <span>Dashboard</span>}
      </Link>

      {/* My Documents pin */}
      <Link
        href="/tools/rams/documents"
        className={cn(
          "relative flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-sidebar-accent border-b",
          collapsed && "justify-center px-0",
          pathname === "/tools/rams/documents" && "bg-brand-soft"
        )}
        title="My Documents"
      >
        {pathname === "/tools/rams/documents" && (
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-sm bg-brand"
            aria-hidden
          />
        )}
        <FolderOpen className="size-4 shrink-0" strokeWidth={1.6} />
        {!collapsed && <span>My Documents</span>}
      </Link>

      {/* Flat nav — 10 entries, no section headings */}
      <nav className="flex-1 overflow-y-auto py-2 min-h-0">
        <ul>
          {SIDEBAR_ITEMS.map((item) => (
            <SidebarRow
              key={item.href}
              item={item}
              pathname={pathname}
              collapsed={collapsed}
            />
          ))}
        </ul>
      </nav>
    </>
  );
}

function SidebarRow({
  item,
  pathname,
  collapsed,
}: {
  item: SidebarItem;
  pathname: string;
  collapsed: boolean;
}) {
  const Icon = item.icon;
  const active = isActive(pathname, item.href);

  return (
    <li className="list-none">
      <Link
        href={item.href}
        className={cn(
          "group relative flex items-center gap-2.5 px-4 py-2 text-sm transition-colors",
          "hover:bg-sidebar-accent",
          collapsed && "justify-center px-0",
          active && "bg-brand-soft font-semibold"
        )}
        title={collapsed ? item.label : undefined}
      >
        {active && (
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-sm bg-brand"
            aria-hidden
          />
        )}
        <Icon
          className={cn(
            "size-4 shrink-0 transition-colors",
            active
              ? "text-foreground"
              : "text-muted-foreground group-hover:text-foreground"
          )}
          strokeWidth={1.6}
        />
        {!collapsed && (
          <>
            <span className="flex-1 truncate">{item.label}</span>
            {item.status === "wip" && !active && (
              <span
                className="size-1 rounded-full bg-brand"
                aria-label="building"
              />
            )}
          </>
        )}
      </Link>
    </li>
  );
}

/**
 * An entry is "active" if the user is on its exact route or somewhere
 * under it (e.g. /tools/rams/permits/hot-works-permit still highlights
 * the "Permit" sidebar entry).
 */
function isActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  // Sub-path match — but only at segment boundaries.
  return pathname.startsWith(`${href}/`);
}
