"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * LibraryGallery — picker for items inside a builder.
 *
 * Picking flow (the one Jamie wants): pick a category from a dropdown, see
 * a clean simple list of items in that category. No grid. No emojis. No
 * massive scroll. Two clicks to insert an item.
 *
 * Modes:
 *  - Single-pick: click an item row → onPick fires.
 *  - Multi-pick: pass onPickMany. Rows become checkable, sticky bar at the
 *    bottom shows the count + Continue.
 */

export interface LibraryGalleryItem {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  /** Small badge text on the right of the row. */
  meta?: string;
}

export interface LibraryGalleryCategory {
  id: string;
  label: string;
}

interface LibraryGalleryProps<T extends LibraryGalleryItem> {
  items: T[];
  categories?: LibraryGalleryCategory[];
  onPick?: (item: T) => void;
  onPickMany?: (items: T[]) => void;
  heading: string;
  subheading?: string;
  customLabel?: string;
  onAddCustom?: () => void;
  searchableFields?: (item: T) => string[];
  continueLabel?: (count: number) => string;
  /** Legacy — accepted for back-compat with existing call sites. Unused. */
  searchPlaceholder?: string;
}

export function LibraryGallery<T extends LibraryGalleryItem>({
  items,
  categories,
  onPick,
  onPickMany,
  heading,
  subheading,
  customLabel,
  onAddCustom,
  continueLabel,
}: LibraryGalleryProps<T>) {
  // Default to the first real category (not "all") so the user always lands
  // on a focused list, never the firehose.
  const firstCat = categories?.[0]?.id ?? "all";
  const [category, setCategory] = useState<string>(firstCat);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const multi = !!onPickMany;

  const filtered = useMemo(() => {
    if (category === "all") return items;
    return items.filter((i) => i.category === category);
  }, [items, category]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    for (const item of items) {
      if (item.category) c[item.category] = (c[item.category] ?? 0) + 1;
    }
    return c;
  }, [items]);

  function handleRowClick(item: T) {
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

  const continueText = continueLabel
    ? continueLabel(selectedIds.size)
    : `Add ${selectedIds.size} item${selectedIds.size === 1 ? "" : "s"}`;

  return (
    <div className="space-y-4">
      <header className="border rounded-lg bg-card p-5">
        <h2 className="text-lg font-semibold tracking-tight mb-1">{heading}</h2>
        {subheading && (
          <p className="text-sm text-muted-foreground mb-4">{subheading}</p>
        )}

        {/* The picker. Native select — fast, works everywhere, no library
            chrome to learn. */}
        {categories && categories.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label
              htmlFor="cat-select"
              className="text-xs font-medium text-muted-foreground sm:w-20 shrink-0"
            >
              Category
            </label>
            <select
              id="cat-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 h-9 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All ({counts.all ?? 0})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label} ({counts[c.id] ?? 0})
                </option>
              ))}
            </select>
          </div>
        )}
      </header>

      {filtered.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-10 text-center bg-muted/20">
          <p className="text-sm text-muted-foreground mb-3">
            Nothing in this category yet.
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
            "border rounded-lg bg-card divide-y",
            multi && selectedIds.size > 0 && "mb-24"
          )}
        >
          {filtered.map((item) => {
            const isSelected = multi && selectedIds.has(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleRowClick(item)}
                className={cn(
                  "w-full text-left px-4 py-3 flex items-center gap-3 transition-colors",
                  "hover:bg-muted/50",
                  isSelected && "bg-muted"
                )}
              >
                {multi && (
                  <span
                    className={cn(
                      "size-4 rounded border flex items-center justify-center shrink-0 transition",
                      isSelected
                        ? "bg-foreground border-foreground"
                        : "bg-background border-border"
                    )}
                  >
                    {isSelected && (
                      <Check className="size-3 text-background" strokeWidth={3} />
                    )}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium tracking-tight truncate">
                    {item.title}
                  </div>
                  {item.subtitle && (
                    <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {item.subtitle}
                    </div>
                  )}
                </div>
                {item.meta && (
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">
                    {item.meta}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {onAddCustom && customLabel && filtered.length > 0 && (
        <button
          onClick={onAddCustom}
          className="w-full border-2 border-dashed rounded-lg py-3 text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition"
        >
          + {customLabel}
        </button>
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedIds(new Set())}
              >
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
