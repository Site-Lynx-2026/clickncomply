"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Bell, Check } from "lucide-react";
import { getBuilder } from "@/lib/rams/builders";

export function ComingSoon({ slug }: { slug: string }) {
  const builder = getBuilder(slug);
  const [voted, setVoted] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!builder) return null;

  async function handleVote(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // Hook this to /api/rams/vote-builder later — for now optimistic UX.
    await new Promise((r) => setTimeout(r, 400));
    setSubmitting(false);
    setVoted(true);
  }

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-8 bg-muted/30">
        <Sparkles className="size-5 text-muted-foreground mb-3" />
        <h2 className="font-semibold mb-1.5">
          {builder.status === "planned"
            ? "We're building this next"
            : "Tool flow coming together"}
        </h2>
        <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
          {builder.description}
        </p>
      </div>

      <div className="border rounded-lg p-6">
        <h3 className="text-sm font-semibold mb-1">
          Want a heads-up when this launches?
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          We&apos;ll email you once when it&apos;s live. No drip campaign, no
          newsletter, no resale.
        </p>
        {voted ? (
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Check className="size-4 text-brand-foreground bg-brand rounded-full p-0.5" />
            Vote logged. We&apos;ll let you know.
          </div>
        ) : (
          <form
            onSubmit={handleVote}
            className="flex flex-col sm:flex-row gap-2"
          >
            <Input
              type="email"
              placeholder="you@yourcompany.co.uk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="sm:max-w-sm"
            />
            <Button type="submit" disabled={submitting}>
              <Bell className="size-3.5 mr-1.5" />
              {submitting ? "Logging..." : "Vote + notify me"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
