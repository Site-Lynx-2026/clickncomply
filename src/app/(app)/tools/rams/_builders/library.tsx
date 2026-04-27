"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LibraryRow {
  id: string;
  title: string;
  /** Right-side meta — e.g. "8 m/s²" for HAVs, "high" for COSHH risk. */
  meta?: string;
  category?: string;
  body?: string;
}

export interface LibraryCategoryDef {
  id: string;
  label: string;
}

export interface LibraryBrowserProps {
  heading: string;
  intro: string;
  items: LibraryRow[];
  categories?: LibraryCategoryDef[];
  /** Search placeholder text. */
  searchPlaceholder?: string;
}

/**
 * Generic Library browser — read-only catalogue used by the COSHH /
 * HAVs / Noise / Trade Templates routes. No form, no save, just browse.
 * Filter by category dropdown + free-text search.
 */
export function LibraryBrowser({
  heading,
  intro,
  items,
  categories,
  searchPlaceholder = "Search…",
}: LibraryBrowserProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return items.filter((it) => {
      if (category !== "all" && it.category !== category) return false;
      if (!q) return true;
      const haystack = `${it.title} ${it.meta ?? ""} ${it.body ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query, category]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    for (const it of items) {
      if (it.category) c[it.category] = (c[it.category] ?? 0) + 1;
    }
    return c;
  }, [items]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-extrabold uppercase text-2xl tracking-tight mb-1">
          {heading}
        </h2>
        <p className="text-sm text-muted-foreground">{intro}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
          />
        </div>
        {categories && categories.length > 0 && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-9 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All ({counts.all ?? 0})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label} ({counts[c.id] ?? 0})
              </option>
            ))}
          </select>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-10 text-center bg-muted/20">
          <p className="text-sm text-muted-foreground">
            No matches.
          </p>
        </div>
      ) : (
        <div className="border border-soft rounded-lg surface-raised divide-y divide-soft">
          {filtered.map((row) => (
            <div
              key={row.id}
              className="px-4 py-3 flex items-center gap-3 hover:bg-muted/40 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold tracking-tight truncate">
                  {row.title}
                </div>
                {row.body && (
                  <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                    {row.body}
                  </div>
                )}
              </div>
              {row.meta && (
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded shrink-0",
                    "surface-pebble text-muted-foreground"
                  )}
                >
                  {row.meta}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
