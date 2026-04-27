import { type Builder, SECTIONS } from "@/lib/rams/builders";
import { PageHeader } from "@/components/page-header";
import { ProjectPicker } from "./project-picker";

export function BuilderShell({
  builder,
  children,
}: {
  builder: Builder;
  children: React.ReactNode;
}) {
  const isLiveBuilder =
    builder.status === "live" || builder.status === "wip";
  const sectionLabel = SECTIONS[builder.section]?.label ?? "Tools";

  return (
    <div className="px-8 py-10 max-w-5xl mx-auto">
      <PageHeader
        eyebrow={sectionLabel}
        title={builder.name}
        subtitle={
          <>
            <span>{builder.tagline}</span>
            {builder.status === "wip" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full surface-tinted border border-soft text-[10px] uppercase tracking-wider font-bold text-foreground">
                <span className="size-1 rounded-full bg-brand" />
                Building
              </span>
            )}
            {builder.status === "live" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full status-success text-[10px] uppercase tracking-wider font-bold">
                Live
              </span>
            )}
          </>
        }
        icon={builder.icon}
        iconTone="neutral"
        size="md"
      />

      {/* Project picker — only on builders that store actual documents */}
      {isLiveBuilder && (
        <div className="mb-6">
          <ProjectPicker />
        </div>
      )}

      {children}
    </div>
  );
}
