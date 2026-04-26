import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex-1">
      <section className="container mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-6">
          ClickNComply
        </p>
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-6">
          The compliance consultant
          <br />
          lives in your laptop now.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Manage every compliance system your business has — ISO 9001, BS EN
          1090, CHAS, ConstructionLine, and more. £9 a month. No phone calls.
          No upsells. Cancel any time, one click.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/signup">Start free</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/pricing">See pricing</Link>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-6 font-mono">
          v0.1 — scaffold only · build in progress
        </p>
      </section>
    </main>
  );
}
