"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * LibraryGallery — the universal "open" of every ClickNComply builder.
 *
 * Modes:
 *  - Single-pick (default): one click on a card commits the item.
 *  - Multi-pick: pass `onPickMany`. Cards become checkable. Sticky bottom
 *    bar shows the running count and a Continue button. Used when the
 *    library is dense and the user typically wants several items at once
 *    (RA hazards, COSHH substances, HAVs tools).
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
  /** Single-pick: card click commits this item. */
  onPick?: (item: T) => void;
  /** Multi-pick: when provided, gallery enters multi-select mode and this fires on Continue. */
  onPickMany?: (items: T[]) => void;
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
  /** Override the Continue button label in multi-pick mode. */
  continueLabel?: (count: number) => string;
}

export function LibraryGallery<T extends LibraryGalleryItem>({
  items,
  categories,
  onPick,
  onPickMany,
  heading,
  subheading,
  searchPlaceholder = "Search…",
  customLabel,
  onAddCustom,
  searchableFields,
  continueLabel,
}: LibraryGalleryProps<T>) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const multi = !!onPickMany;

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

  function handleCardClick(item: T) {
    if (multi) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(item.id)) next.delete(item.id);
        else next.add(item.id);
        return next;
      });
      return;
    }
    onPick?.(item);
  }

  function handleContinue() {
    if (!multi) return;
    const picked = items.filter((i) => selectedIds.has(i.id));
    if (picked.length === 0) return;
    onPickMany?.(picked);
    setSelectedIds(new Set());
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  const continueText = continueLabel
    ? continueLabel(selectedIds.size)
    : `Continue with ${selectedIds.size} item${selectedIds.size === 1 ? "" : "s"}`;

  return (
    <div className="space-y-6">
      <header className="border rounded-lg bg-card p-6">
        <h2 className="text-xl font-semibold tracking-tight mb-1">
          {heading}
        </h2>
        {subheading && (
          <p className="text-sm text-muted-foreground mb-4">{subheading}</p>
        )}
        {multi && (
          <p className="text-xs text-muted-foreground mb-4 inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-brand" />
            Multi-pick mode — click as many as you need, then hit Continue.
          </p>
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
        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",
            multi && selectedIds.size > 0 && "pb-24"
          )}
        >
          {filtered.map((item) => {
            const isSelected = multi && selectedIds.has(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleCardClick(item)}
                className={cn(
                  "group text-left border rounded-lg p-4 transition relative",
                  isSelected
                    ? "bg-foreground text-background border-foreground shadow-sm"
                    : "bg-card hover:border-foreground hover:shadow-sm"
                )}
              >
                {multi && (
                  <span
                    className={cn(
                      "absolute top-3 left-3 size-4 rounded border flex items-center justify-center transition",
                      isSelected
                        ? "bg-brand border-brand"
                        : "bg-background border-border group-hover:border-foreground/40"
                    )}
                  >
                    {isSelected && (
                      <Check className="size-3 text-foreground" strokeWidth={3} />
                    )}
                  </span>
                )}
                {item.meta && (
                  <span
                    className={cn(
                      "absolute top-3 right-3 text-[9px] uppercase tracking-wider",
                      isSelected
                        ? "text-background/70"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.meta}
                  </span>
                )}
                <div className={cn("flex items-start gap-3", multi && "pl-6")}>
                  {item.icon && (
                    <span className="text-2xl shrink-0 leading-none">
                      {item.icon}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={cn(
                        "text-sm font-semibold tracking-tight mb-0.5",
                        isSelected
                          ? "text-background"
                          : "group-hover:text-foreground"
                      )}
                    >
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p
                        className={cn(
                          "text-xs line-clamp-2 leading-relaxed",
                          isSelected
                            ? "text-background/75"
                            : "text-muted-foreground"
                        )}
                      >
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
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

      {/* Sticky Continue bar — multi-pick only */}
      {multi && selectedIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 lg:left-[260px] z-30 border-t bg-background/95 backdrop-blur shadow-lg">
          <div className="flex items-center justify-between gap-4 px-6 py-3 max-w-5xl mx-auto">
            <div className="text-sm">
              <span className="font-semibold">{selectedIds.size}</span>{" "}
              <span className="text-muted-foreground">
                {selectedIds.size === 1 ? "item" : "items"} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={clearSelection}>
                <X className="size-3.5 mr-1.5" />
                Clear
              </Button>
              <Button onClick={handleContinue}>{continueText}</Button>
            </div>
          </div>
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
