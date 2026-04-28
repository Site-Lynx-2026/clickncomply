"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * "Your public page" discovery strip — sits at the top of the dashboard.
 *
 * The whole point of the touchless surface is that customers/main contractors
 * tap one URL and see the firm's docs. So the firm needs to *find* their URL
 * the moment they finish their first doc. This strip is how they discover it.
 *
 * Subtle (lime stripe + small icon, not a screaming banner). Tap-to-copy
 * + tap-to-preview. After a copy, the button flashes a tick for a second.
 */
export function ShareLinkCard({
  slug,
  hasCompletedDocs,
}: {
  slug: string;
  hasCompletedDocs: boolean;
}) {
  const [copied, setCopied] = useState(false);

  // Build the absolute URL on the client so it's always correct in dev/prod
  const absoluteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/share/${slug}`
      : `/share/${slug}`;
  const displayUrl = absoluteUrl.replace(/^https?:\/\//, "");

  async function copy() {
    try {
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mb-6 rounded-xl border border-soft surface-raised shadow-sm-cool overflow-hidden relative">
      {/* Lime stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand" aria-hidden />
      <div className="pl-6 pr-4 py-4 flex items-center gap-4 flex-wrap sm:flex-nowrap">
        <div className="size-9 rounded-lg bg-brand text-foreground flex items-center justify-center shrink-0">
          <Share2 className="size-4" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-bold mb-1">
            Your public share page
          </div>
          <div className="font-mono text-sm text-foreground truncate">
            {displayUrl}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            {hasCompletedDocs
              ? "Send this link to customers — they get your docs in one tap."
              : "Mark a doc 'complete' and it'll appear on your share page."}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copy}
            className={cn(
              "gap-1.5 transition-colors",
              copied && "border-[var(--status-success)] text-[var(--status-success)]"
            )}
          >
            {copied ? (
              <>
                <Check className="size-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                Copy
              </>
            )}
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link
              href={`/share/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="gap-1.5"
            >
              <ExternalLink className="size-3.5" />
              View
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
