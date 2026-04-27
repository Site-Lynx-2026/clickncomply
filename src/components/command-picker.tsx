"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Search,
  Check,
  Sparkles,
  Plus,
  ArrowRight,
  Command,
} from "lucide-react";

/**
 * CommandPicker — the deep picker rebuild.
 *
 * Pattern stolen from Raycast / Linear / Notion / Figma (per the research):
 *   - Centered modal, NOT a dropdown
 *   - Search input top-fixed, results below
 *   - Three layered sections: Suggested → Recently used → Categorised
 *   - Bold matched substring on titles
 *   - Multi-select with sticky bottom bar (X selected — Add)
 *   - "+ Create '<typed text>'" inline when search returns nothing
 *   - Full keyboard nav (↑↓ + Enter + Esc + Cmd+Enter)
 *
 * Replaces LibraryGallery for every builder.
 */

export interface CommandPickerItem {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  /** Right-aligned tag accessory (e.g. "8 m/s²", "High", "12 hazards"). */
  meta?: string;
  /** For colour-coded meta tag. */
  metaTone?: "neutral" | "info" | "success" | "warning" | "danger";
  /** Optional keyword list for fuzzier matching beyond title. */
  keywords?: string[];
}

export interface CommandPickerCategory {
  id: string;
  label: string;
}

export interface CommandPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Heading shown above the search input. */
  title: string;
  /** Optional sub-line. */
  subtitle?: string;
  /** All available items. */
  items: CommandPickerItem[];
  categories?: CommandPickerCategory[];
  /** Items pre-selected as "Suggested for this RAMS" (shows top of list). */
  suggestedIds?: string[];
  /** Items recently used (last 10) — shows above categories. */
  recentIds?: string[];
  /** Single-pick: fired on row click. */
  onPick?: (item: CommandPickerItem) => void;
  /** Multi-pick: when set, rows become checkable + sticky bar appears. */
  onPickMany?: (items: CommandPickerItem[]) => void;
  /** Placeholder for the search input. */
  searchPlaceholder?: string;
  /** Allow inline create when search returns nothing. */
  onCreate?: (typedText: string) => void;
  createLabel?: (typedText: string) => string;
  /** Custom continue button label in multi-pick mode. */
  continueLabel?: (count: number) => string;
}

interface ScoredItem {
  item: CommandPickerItem;
  score: number;
  matchedTitle: string; // title with **bold** markers
}

/**
 * Tiny fuzzy matcher — substring with bonus for exact starts + word boundary.
 */
function fuzzyScore(query: string, target: string): { score: number; matched: string } {
  if (!query) return { score: 1, matched: target };
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  const idx = t.indexOf(q);
  if (idx === -1) return { score: 0, matched: target };
  let score = 1;
  if (idx === 0) score += 2;
  // Word-boundary bonus
  if (idx > 0 && /[\s\-_/]/.test(t[idx - 1])) score += 1;
  // Length penalty (shorter targets rank higher)
  score += Math.max(0, 1 - target.length / 80);
  return {
    score,
    matched:
      target.slice(0, idx) +
      "**" +
      target.slice(idx, idx + query.length) +
      "**" +
      target.slice(idx + query.length),
  };
}

const META_TONE_CLASS: Record<NonNullable<CommandPickerItem["metaTone"]>, string> = {
  neutral: "surface-pebble text-muted-foreground",
  info: "status-info",
  success: "status-success",
  warning: "status-warning",
  danger: "status-danger",
};

export function CommandPicker({
  open,
  onOpenChange,
  title,
  subtitle,
  items,
  categories,
  suggestedIds = [],
  recentIds = [],
  onPick,
  onPickMany,
  searchPlaceholder = "Search…",
  onCreate,
  createLabel = (t) => `Create "${t}"`,
  continueLabel = (n) => `Add ${n} item${n === 1 ? "" : "s"}`,
}: CommandPickerProps) {
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const multi = !!onPickMany;

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIds(new Set());
      setActiveIdx(0);
      // Defer focus so dialog mount completes
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // ── Build the layered, scored, filtered list ──
  const sections = useMemo(() => {
    const q = query.trim();
    const itemById = new Map(items.map((i) => [i.id, i]));

    function scoreFilter(arr: CommandPickerItem[]): ScoredItem[] {
      return arr
        .map((item) => {
          if (!q) return { item, score: 1, matchedTitle: item.title };
          const titleMatch = fuzzyScore(q, item.title);
          if (titleMatch.score > 0) {
            return {
              item,
              score: titleMatch.score + 5,
              matchedTitle: titleMatch.matched,
            };
          }
          // Try subtitle / keywords
          const sub = item.subtitle ?? "";
          const kw = (item.keywords ?? []).join(" ");
          const subScore = fuzzyScore(q, sub).score;
          const kwScore = fuzzyScore(q, kw).score;
          if (subScore > 0 || kwScore > 0) {
            return {
              item,
              score: subScore + kwScore,
              matchedTitle: item.title,
            };
          }
          return { item, score: 0, matchedTitle: item.title };
        })
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score);
    }

    const suggested = scoreFilter(
      suggestedIds.map((id) => itemById.get(id)).filter(Boolean) as CommandPickerItem[]
    );
    const recentOnly = recentIds
      .filter((id) => !suggestedIds.includes(id))
      .map((id) => itemById.get(id))
      .filter(Boolean) as CommandPickerItem[];
    const recent = scoreFilter(recentOnly);

    const usedIds = new Set([...suggestedIds, ...recentIds]);
    const rest = items.filter((i) => !usedIds.has(i.id));
    const restGrouped = new Map<string, CommandPickerItem[]>();
    if (categories && categories.length > 0) {
      for (const cat of categories) restGrouped.set(cat.id, []);
      restGrouped.set("__other__", []);
      for (const item of rest) {
        const key = item.category && restGrouped.has(item.category) ? item.category : "__other__";
        restGrouped.get(key)!.push(item);
      }
    } else {
      restGrouped.set("__all__", rest);
    }

    const categoricalSections = Array.from(restGrouped.entries())
      .map(([catId, catItems]) => {
        const scored = scoreFilter(catItems);
        const label =
          catId === "__other__" || catId === "__all__"
            ? null
            : categories?.find((c) => c.id === catId)?.label;
        return { id: catId, label, items: scored };
      })
      .filter((s) => s.items.length > 0);

    return {
      suggested,
      recent,
      categories: categoricalSections,
    };
  }, [items, query, suggestedIds, recentIds, categories]);

  // Flatten for keyboard navigation
  const flatItems = useMemo(() => {
    const out: ScoredItem[] = [];
    out.push(...sections.suggested);
    out.push(...sections.recent);
    for (const cat of sections.categories) out.push(...cat.items);
    return out;
  }, [sections]);

  const showCreate = !!onCreate && query.trim().length > 0 && flatItems.length === 0;

  // Reset active index when list shape changes
  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  // Keep active row in view
  useEffect(() => {
    if (!listRef.current) return;
    const active = listRef.current.querySelector<HTMLElement>(
      `[data-row-idx="${activeIdx}"]`
    );
    active?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIdx]);

  function toggle(id: string) {
    if (multi) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    } else {
      const item = items.find((i) => i.id === id);
      if (item) {
        onPick?.(item);
        onOpenChange(false);
      }
    }
  }

  function commitMulti() {
    const picked = items.filter((i) => selectedIds.has(i.id));
    if (picked.length === 0) return;
    onPickMany?.(picked);
    onOpenChange(false);
  }

  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, Math.max(0, flatItems.length - 1)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(0, i - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (showCreate) {
          onCreate?.(query.trim());
          onOpenChange(false);
          return;
        }
        const target = flatItems[activeIdx];
        if (target) toggle(target.item.id);
      } else if (e.key === " " && multi) {
        e.preventDefault();
        const target = flatItems[activeIdx];
        if (target) toggle(target.item.id);
      } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && multi) {
        e.preventDefault();
        commitMulti();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flatItems, activeIdx, showCreate, query, multi]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-2xl p-0 overflow-hidden gap-0 surface-modal shadow-xl-cool"
        onKeyDown={handleKey}
      >
        {/* Search header */}
        <div className="border-b border-soft px-4 py-3 flex items-center gap-3">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground/60"
          />
          <kbd className="font-mono-num text-[10px] text-muted-foreground/70 surface-pebble border border-soft rounded px-1.5 py-0.5 hidden sm:inline-flex items-center gap-0.5">
            <span>esc</span>
          </kbd>
        </div>

        {/* Title bar (small) */}
        <div className="px-4 py-2 border-b border-soft flex items-baseline justify-between gap-3 surface-canvas">
          <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-muted-foreground/80">
            {title}
          </div>
          {subtitle && (
            <div className="text-[10px] text-muted-foreground/60">{subtitle}</div>
          )}
        </div>

        {/* List */}
        <div ref={listRef} className="max-h-[60vh] overflow-y-auto">
          {flatItems.length === 0 && !showCreate && (
            <div className="px-4 py-12 text-center text-sm text-muted-foreground">
              No matches.
            </div>
          )}

          {sections.suggested.length > 0 && (
            <Section label="Suggested for this document" icon={Sparkles} accent="brand">
              {renderRows(
                sections.suggested,
                0,
                activeIdx,
                selectedIds,
                multi,
                toggle,
                setActiveIdx
              )}
            </Section>
          )}

          {sections.recent.length > 0 && (
            <Section label="Recently used">
              {renderRows(
                sections.recent,
                sections.suggested.length,
                activeIdx,
                selectedIds,
                multi,
                toggle,
                setActiveIdx
              )}
            </Section>
          )}

          {sections.categories.map((cat, ci) => {
            const offset =
              sections.suggested.length +
              sections.recent.length +
              sections.categories
                .slice(0, ci)
                .reduce((sum, c) => sum + c.items.length, 0);
            return (
              <Section key={cat.id} label={cat.label ?? "All"}>
                {renderRows(
                  cat.items,
                  offset,
                  activeIdx,
                  selectedIds,
                  multi,
                  toggle,
                  setActiveIdx
                )}
              </Section>
            );
          })}

          {showCreate && (
            <button
              type="button"
              onClick={() => {
                onCreate?.(query.trim());
                onOpenChange(false);
              }}
              className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-muted/40 transition-colors border-t border-soft"
            >
              <span className="size-8 rounded-md bg-foreground text-background flex items-center justify-center">
                <Plus className="size-4" />
              </span>
              <div className="flex-1">
                <div className="text-sm font-semibold">
                  {createLabel(query.trim())}
                </div>
                <div className="text-xs text-muted-foreground">
                  Add as a custom item
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-soft px-4 py-2.5 flex items-center justify-between gap-3 surface-canvas">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground/70">
            <kbd className="font-mono-num inline-flex items-center gap-0.5 surface-pebble border border-soft rounded px-1.5 py-0.5">
              <span>↑↓</span>
            </kbd>
            <span>navigate</span>
            <kbd className="font-mono-num inline-flex items-center gap-0.5 surface-pebble border border-soft rounded px-1.5 py-0.5 ml-2">
              <span>{multi ? "space" : "↵"}</span>
            </kbd>
            <span>{multi ? "toggle" : "select"}</span>
            {multi && (
              <>
                <kbd className="font-mono-num inline-flex items-center gap-0.5 surface-pebble border border-soft rounded px-1.5 py-0.5 ml-2">
                  <Command className="size-2.5" />
                  <span>↵</span>
                </kbd>
                <span>commit</span>
              </>
            )}
          </div>
          {multi && selectedIds.size > 0 && (
            <button
              type="button"
              onClick={commitMulti}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-foreground text-background text-xs font-bold uppercase tracking-wider hover:opacity-90 transition"
            >
              <Check className="size-3.5" />
              {continueLabel(selectedIds.size)}
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({
  label,
  icon: Icon,
  accent,
  children,
}: {
  label: string;
  icon?: typeof Sparkles;
  accent?: "brand";
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        className={cn(
          "px-4 pt-3 pb-1.5 text-[10px] uppercase tracking-[0.12em] font-bold text-muted-foreground/80 flex items-center gap-1.5",
          accent === "brand" && "text-foreground"
        )}
      >
        {Icon && (
          <Icon className={cn("size-3", accent === "brand" && "text-brand")} />
        )}
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}

function renderRows(
  rows: ScoredItem[],
  startIdx: number,
  activeIdx: number,
  selectedIds: Set<string>,
  multi: boolean,
  onToggle: (id: string) => void,
  setActiveIdx: (i: number) => void
) {
  return rows.map((row, i) => {
    const idx = startIdx + i;
    const isActive = idx === activeIdx;
    const isSelected = selectedIds.has(row.item.id);
    const tone = row.item.metaTone ?? "neutral";
    return (
      <button
        key={row.item.id}
        data-row-idx={idx}
        type="button"
        onClick={() => onToggle(row.item.id)}
        onMouseEnter={() => setActiveIdx(idx)}
        className={cn(
          "w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors",
          isActive ? "bg-muted/60" : "hover:bg-muted/40"
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
            {isSelected && <Check className="size-3 text-background" strokeWidth={3} />}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div
            className="text-sm font-semibold tracking-tight truncate"
            // Render bold-marked match
            dangerouslySetInnerHTML={{
              __html: row.matchedTitle.replace(
                /\*\*(.+?)\*\*/g,
                '<span class="bg-brand/20 text-foreground rounded-[2px] px-0.5">$1</span>'
              ),
            }}
          />
          {row.item.subtitle && (
            <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
              {row.item.subtitle}
            </div>
          )}
        </div>
        {row.item.meta && (
          <span
            className={cn(
              "text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded shrink-0",
              META_TONE_CLASS[tone]
            )}
          >
            {row.item.meta}
          </span>
        )}
      </button>
    );
  });
}
