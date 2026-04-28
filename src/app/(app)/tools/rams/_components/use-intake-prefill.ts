"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface IntakePrefill {
  title: string;
  scope: string;
  trade: string;
}

/**
 * Reads ai_title / ai_scope / ai_trade query params (set by the dashboard
 * IntakeBox), returns them once, then strips them from the URL so a refresh
 * doesn't re-apply them.
 *
 * Returns `null` if no intake params are present. Otherwise returns the
 * prefill object — a stable reference for the lifetime of the component
 * (consumers can use it as a useEffect dep without retriggering).
 */
export function useIntakePrefill(): IntakePrefill | null {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // Lazy initial state — captured ONCE on mount from the URL. After the
  // URL strip below removes the params, this snapshot still survives.
  const [prefill] = useState<IntakePrefill | null>(() => {
    const title = params.get("ai_title") ?? "";
    const scope = params.get("ai_scope") ?? "";
    const trade = params.get("ai_trade") ?? "";
    if (!title && !scope && !trade) return null;
    return { title, scope, trade };
  });

  // Strip the intake params from the URL after capture so a refresh
  // doesn't re-trigger. Replace, don't push — no extra history entry.
  useEffect(() => {
    if (!prefill) return;
    if (
      !params.has("ai_title") &&
      !params.has("ai_scope") &&
      !params.has("ai_trade")
    )
      return;
    const next = new URLSearchParams(params.toString());
    next.delete("ai_title");
    next.delete("ai_scope");
    next.delete("ai_trade");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }, [prefill, params, pathname, router]);

  return prefill;
}
