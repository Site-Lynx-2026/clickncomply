"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wrench,
  Briefcase,
  Users,
  UserCircle,
  ChevronsLeft,
  ChevronsRight,
  Menu,
  type LucideIcon,
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
 * AppSidebar — the global left rail for the whole app.
 *
 * Replaces the top nav. SL pattern: vertical rail with brand mark at the
 * top, primary sections in the middle, user/logout at the bottom. Active
 * routes use the lime brand soft fill + lime stripe so the brand finally
 * appears in interactive feedback across every page (not just inside the
 * RAMs builder).
 *
 * /tools/rams retains its own secondary rail inside the page — when a
 * user is in RAMs they see two rails (this global one + the RAMs builder
 * rail), mirroring the Linear / Notion dual-sidebar pattern. The global
 * rail is collapsible to save horizontal space when the RAMs rail is open.
 *
 * Mobile: collapsed entirely; hamburger trigger lives in a separate
 * component (`AppSidebarMobileTrigger`) and opens this nav as a Sheet.
 */

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tools", label: "Tools", icon: Wrench },
  { href: "/projects", label: "Projects", icon: Briefcase },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/account", label: "Account", icon: UserCircle },
];

export function AppSidebar({
  userEmail,
  logoutAction,
}: {
  userEmail: string;
  logoutAction: () => Promise<void> | void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden md:flex shrink-0 border-r bg-sidebar text-sidebar-foreground",
        "flex-col sticky top-0 self-start",
        "h-screen",
        collapsed ? "w-[68px]" : "w-[240px]",
        "transition-[width] duration-150 ease-out z-30"
      )}
    >
      <SidebarHeader collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <SidebarBody collapsed={collapsed} />
      <SidebarFooter
        collapsed={collapsed}
        userEmail={userEmail}
        logoutAction={logoutAction}
      />
    </aside>
  );
}

export function AppSidebarMobileTrigger({
  userEmail,
  logoutAction,
}: {
  userEmail: string;
  logoutAction: () => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const closeOnNav = () => setOpen(false);

  return (
    <div className="md:hidden border-b bg-background sticky top-0 z-30">
      <Sheet open={open} onOpenChange={setOpen}>
        <div className="flex items-center justify-between px-4 py-2 h-12">
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="-ml-2">
              <Menu className="size-4 mr-1.5" />
              Menu
            </Button>
          </SheetTrigger>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest"
          >
            <span className="size-1.5 rounded-full bg-brand" />
            ClickNComply
          </Link>
          <span aria-hidden className="w-12" />
        </div>
        <SheetContent
          side="left"
          className="p-0 w-[280px] flex flex-col bg-sidebar text-sidebar-foreground"
        >
          <SheetHeader className="px-4 py-4 border-b">
            <SheetTitle className="text-base font-semibold tracking-tight inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-brand" />
              ClickNComply
            </SheetTitle>
          </SheetHeader>
          <div onClick={closeOnNav} className="flex-1 flex flex-col min-h-0">
            <SidebarBody collapsed={false} />
            <SidebarFooter
              collapsed={false}
              userEmail={userEmail}
              logoutAction={logoutAction}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SidebarHeader({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-4 border-b">
      {!collapsed && (
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest hover:opacity-70 transition"
        >
          <span className="size-1.5 rounded-full bg-brand" />
          ClickNComply
        </Link>
      )}
      <button
        onClick={onToggle}
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
  );
}

function SidebarBody({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto py-3 px-2 min-h-0">
      <ul className="space-y-0.5">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <li key={item.href} className="list-none">
              <Link
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                  collapsed && "justify-center px-0",
                  active
                    ? "bg-brand-soft text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
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
                    active ? "text-foreground" : "text-muted-foreground"
                  )}
                  strokeWidth={1.6}
                />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function SidebarFooter({
  collapsed,
  userEmail,
  logoutAction,
}: {
  collapsed: boolean;
  userEmail: string;
  logoutAction: () => Promise<void> | void;
}) {
  return (
    <div className="border-t p-2 space-y-1">
      {!collapsed && userEmail && (
        <div className="px-2 pt-1 pb-2 text-[10px] text-muted-foreground truncate">
          {userEmail}
        </div>
      )}
      <form action={logoutAction}>
        <Button
          variant="ghost"
          size="sm"
          type="submit"
          className={cn(
            "w-full justify-start text-muted-foreground hover:text-foreground",
            collapsed && "justify-center"
          )}
        >
          {collapsed ? "↩" : "Log out"}
        </Button>
      </form>
    </div>
  );
}
