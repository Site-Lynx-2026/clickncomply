import { Badge } from "@/components/ui/badge";
import { type Builder } from "@/lib/rams/builders";

export function BuilderShell({
  builder,
  children,
}: {
  builder: Builder;
  children: React.ReactNode;
}) {
  const Icon = builder.icon;
  return (
    <div className="px-8 py-8 max-w-5xl mx-auto">
      <header className="mb-8">
        <div className="flex items-start gap-4">
          <div className="size-12 rounded-md bg-muted flex items-center justify-center shrink-0">
            <Icon className="size-5" strokeWidth={1.6} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                {builder.name}
              </h1>
              {builder.status === "wip" && (
                <Badge variant="secondary" className="text-[10px] uppercase">
                  building
                </Badge>
              )}
              {builder.status === "planned" && (
                <Badge variant="outline" className="text-[10px] uppercase">
                  soon
                </Badge>
              )}
              {builder.status === "live" && (
                <Badge className="text-[10px] uppercase bg-brand text-brand-foreground hover:bg-brand">
                  live
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{builder.tagline}</p>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
