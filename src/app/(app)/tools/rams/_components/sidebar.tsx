"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  buildersBySection,
  SECTIONS,
  type Builder,
  type BuilderSection,
} from "@/lib/rams/builders";
import { ArrowLeft, ChevronsLeft, ChevronsRight } from "lucide-react";

const SECTION_ORDER: BuilderSection[] = [
  "build",
  "documents",
  "specialist",
  "permits",
  "briefings",
  "plant",
  "ppe",
  "library",
];

export function RAMsSidebar() {
  const pathname = usePathname();
  const grouped = buildersBySection();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "shrink-0 border-r bg-sidebar text-sidebar-foreground",
        "flex flex-col sticky top-14",
        "h-[calc(100vh-3.5rem)]",
        collapsed ? "w-[68px]" : "w-[260px]",
        "transition-[width] duration-150 ease-out"
      )}
    >
      {/* Header — RAMs Builder brand + collapse toggle */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b">
        {!collapsed && (
          <Link
            href="/tools/rams"
            className="flex items-center gap-2 text-sm font-semibold tracking-tight hover:opacity-70 transition"
          >
            <span className="size-1.5 rounded-full bg-brand" />
            RAMs Builder
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

      {/* Back to dashboard */}
      <Link
        href="/dashboard"
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition border-b",
          collapsed && "justify-center px-0"
        )}
        title="Back to dashboard"
      >
        <ArrowLeft className="size-3.5 shrink-0" />
        {!collapsed && <span>Dashboard</span>}
      </Link>

      {/* Nav — sections + builders */}
      <nav className="flex-1 overflow-y-auto py-2">
        {SECTION_ORDER.map((sectionKey) => {
          const builders = grouped[sectionKey];
          if (!builders || builders.length === 0) return null;
          const section = SECTIONS[sectionKey];
          return (
            <div key={sectionKey} className="mb-2">
              {!collapsed && (
                <div className="px-4 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {section.label}
                </div>
              )}
              {collapsed && (
                <div className="mx-3 my-2 h-px bg-sidebar-border" />
              )}
              <ul>
                {builders.map((b) => (
                  <SidebarItem
                    key={b.slug}
                    builder={b}
                    pathname={pathname}
                    collapsed={collapsed}
                  />
                ))}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function SidebarItem({
  builder,
  pathname,
  collapsed,
}: {
  builder: Builder;
  pathname: string;
  collapsed: boolean;
}) {
  const href = `/tools/rams/${builder.slug}`;
  const active = pathname === href;
  const Icon = builder.icon;

  return (
    <li>
      <Link
        href={href}
        className={cn(
          "group relative flex items-center gap-2.5 px-4 py-1.5 text-sm transition-colors",
          "hover:bg-sidebar-accent",
          collapsed && "justify-center px-0",
          active && "bg-sidebar-accent font-medium"
        )}
        title={collapsed ? builder.name : undefined}
      >
        {/* Active marker — lime stripe on the left */}
        {active && (
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] rounded-r bg-brand"
            aria-hidden
          />
        )}
        <Icon
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-colors",
            "group-hover:text-foreground",
            active && "text-foreground"
          )}
          strokeWidth={1.6}
        />
        {!collapsed && (
          <>
            <span className="flex-1 truncate">
              {builder.section === "build" ? (
                <span className="font-semibold">{builder.shortName}</span>
              ) : (
                builder.shortName
              )}
            </span>
            {builder.status === "planned" && (
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground/70">
                soon
              </span>
            )}
            {builder.status === "wip" && !active && (
              <span className="size-1 rounded-full bg-brand" aria-label="building" />
            )}
          </>
        )}
      </Link>
    </li>
  );
}
