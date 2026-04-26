import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ALL_TOOLS, formatPricing } from "@/tools";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="container mx-auto max-w-5xl px-6 pt-24 pb-20">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-brand text-brand-foreground font-mono text-[10px] uppercase tracking-widest font-medium">
            <span className="size-1.5 rounded-full bg-brand-foreground" />
            From £2/month · No card needed
          </span>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 leading-[1.05]">
            The compliance consultant
            <br />
            lives in your laptop now.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Pick the tool that fits the document you need to make.
            Generate it. Download it. Done. We don&apos;t pester you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/signup">Start free</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">Log in</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="container mx-auto max-w-5xl px-6 pb-24">
        <div className="border rounded-lg overflow-hidden divide-y">
          {ALL_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.slug}
                href={tool.landingPath}
                className="flex items-center gap-6 p-6 hover:bg-muted/50 transition group"
              >
                <div className="shrink-0 size-12 rounded-md bg-muted flex items-center justify-center">
                  <Icon className="size-5" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold tracking-tight">
                      {tool.name}
                    </h3>
                    {tool.status === "wip" && (
                      <Badge variant="secondary" className="text-[10px]">
                        building
                      </Badge>
                    )}
                    {tool.status === "planned" && (
                      <Badge variant="outline" className="text-[10px]">
                        soon
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {tool.tagline}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-medium">{formatPricing(tool)}</p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-0.5 transition" />
              </Link>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-6 text-center font-mono">
          Each tool stands alone. Pay only for what you use.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto max-w-5xl px-6 py-6 flex items-center justify-between text-xs text-muted-foreground">
          <p className="font-mono">ClickNComply</p>
          <p>v0.1 · build in progress</p>
        </div>
      </footer>
    </main>
  );
}
