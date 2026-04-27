"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * LibraryGallery — the universal "open" of every ClickNComply builder.
 *
 * Every tool starts with this: a card grid of pickable items, optional
 * category filters, optional search. One click adds the item to the
 * working document. Typing is reserved for company-specific custom fields.
 *
 * The library IS the product — make it dense, browsable, and beautiful.
 */

export interface LibraryGalleryItem {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  icon?: string;
  /** Small badge text in the top-right of the card. */
  meta?: string;
}

export interface LibraryGalleryCategory {
  id: string;
  label: string;
  icon?: string;
}

interface LibraryGalleryProps<T extends LibraryGalleryItem> {
  /** Items to render. */
  items: T[];
  /** Categories. If omitted, no category filter rail is shown. */
  categories?: LibraryGalleryCategory[];
  /** What happens when a card is clicked. */
  onPick: (item: T) => void;
  /** Banner heading for the gallery. */
  heading: string;
  /** Sub-heading under the banner. */
  subheading?: string;
  /** Search placeholder. */
  searchPlaceholder?: string;
  /** Show a permanent "Add custom" card at the end of the grid. */
  customLabel?: string;
  onAddCustom?: () => void;
  /** Override which fields contribute to the search match. */
  searchableFields?: (item: T) => string[];
}

export function LibraryGallery<T extends LibraryGalleryItem>({
  items,
  categories,
  onPick,
  heading,
  subheading,
  searchPlaceholder = "Search…",
  customLabel,
  onAddCustom,
  searchableFields,
}: LibraryGalleryProps<T>) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return items.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (!q) return true;
      const haystack = (
        searchableFields?.(item) ?? [item.title, item.subtitle ?? ""]
      )
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query, category, searchableFields]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    for (const item of items) {
      if (item.category) c[item.category] = (c[item.category] ?? 0) + 1;
    }
    return c;
  }, [items]);

  return (
    <div className="space-y-6">
      <header className="border rounded-lg bg-card p-6">
        <h2 className="text-xl font-semibold tracking-tight mb-1">
          {heading}
        </h2>
        {subheading && (
          <p className="text-sm text-muted-foreground mb-4">{subheading}</p>
        )}
        <div className="relative max-w-md">
          <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
          />
        </div>
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            <CategoryChip
              label={`All (${counts.all ?? 0})`}
              active={category === "all"}
              onClick={() => setCategory("all")}
            />
            {categories.map((c) => (
              <CategoryChip
                key={c.id}
                label={`${c.icon ? c.icon + " " : ""}${c.label} (${counts[c.id] ?? 0})`}
                active={category === c.id}
                onClick={() => setCategory(c.id)}
              />
            ))}
          </div>
        )}
      </header>

      {filtered.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-12 text-center bg-muted/20">
          <p className="text-sm text-muted-foreground mb-3">
            No matches. Try a different search or category.
          </p>
          {onAddCustom && customLabel && (
            <button
              onClick={onAddCustom}
              className="text-sm text-foreground underline underline-offset-2 hover:opacity-70"
            >
              {customLabel}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => onPick(item)}
              className="group text-left border rounded-lg p-4 bg-card hover:border-foreground hover:shadow-sm transition relative"
            >
              {item.meta && (
                <span className="absolute top-3 right-3 text-[9px] uppercase tracking-wider text-muted-foreground">
                  {item.meta}
                </span>
              )}
              <div className="flex items-start gap-3">
                {item.icon && (
                  <span className="text-2xl shrink-0 leading-none">
                    {item.icon}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold tracking-tight mb-0.5 group-hover:text-foreground">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
          {onAddCustom && customLabel && (
            <button
              onClick={onAddCustom}
              className="border-2 border-dashed rounded-lg p-4 hover:border-foreground hover:bg-muted/30 transition text-center text-sm text-muted-foreground hover:text-foreground"
            >
              + {customLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-xs px-2.5 py-1 rounded-full border transition",
        active
          ? "bg-foreground text-background border-foreground"
          : "bg-background hover:bg-muted text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}
