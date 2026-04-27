"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/**
 * "Upgrade to Pro" button that hits /api/stripe/checkout and redirects
 * the browser to Stripe-hosted checkout. Disabled state during the API
 * round-trip to prevent double-submits.
 */
export function UpgradeButton({
  priceKey,
}: {
  priceKey: "monthly" | "annual";
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceKey }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Couldn't start checkout. Try again.");
        return;
      }
      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
    } catch {
      toast.error("Couldn't start checkout — check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleClick} disabled={loading} className="w-full">
      {loading ? "Loading…" : "Upgrade now"}
    </Button>
  );
}

/**
 * "Manage subscription" — opens Stripe-hosted Billing Portal for payment
 * method, invoices, plan changes, and cancellation.
 */
export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Couldn't open billing portal.");
        return;
      }
      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
    } catch {
      toast.error("Couldn't open billing portal — check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleClick} disabled={loading} variant="outline">
      {loading ? "Opening…" : "Open billing portal"}
    </Button>
  );
}
