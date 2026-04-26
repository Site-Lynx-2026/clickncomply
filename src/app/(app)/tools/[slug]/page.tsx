import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TOOLS, type ToolSlug, formatPricing } from "@/tools";
import { ArrowLeft, Sparkles } from "@/lib/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = TOOLS[slug as ToolSlug];
  if (!tool) return {};
  return {
    title: `${tool.name} — ClickNComply`,
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = TOOLS[slug as ToolSlug];
  if (!tool) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: membership } = await admin
    .from("organisation_members")
    .select("organisation_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) redirect("/onboarding");

  // Check if tool is activated for this org
  const { data: activation } = await admin
    .from("framework_activations")
    .select("framework_slug")
    .eq("organisation_id", membership.organisation_id)
    .eq("framework_slug", tool.slug)
    .maybeSingle();

  const isActivated = !!activation;
  const Icon = tool.icon;

  return (
    <div className="container mx-auto max-w-3xl px-6 py-10">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition mb-6"
      >
        <ArrowLeft className="size-3.5" />
        Dashboard
      </Link>

      <div className="flex items-start gap-4 mb-6">
        <div className="shrink-0 size-14 rounded-md bg-muted flex items-center justify-center">
          <Icon className="size-6" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              {tool.name}
            </h1>
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
          <p className="text-muted-foreground">{tool.tagline}</p>
          <p className="text-sm font-medium mt-2">{formatPricing(tool)}</p>
        </div>
      </div>

      <div className="border rounded-lg p-6 mb-6">
        <p className="text-sm leading-relaxed">{tool.description}</p>
      </div>

      {/* Working area placeholder — to be replaced with the tool flow */}
      <div className="border-2 border-dashed rounded-lg p-12 text-center bg-muted/20">
        {tool.status === "wip" ? (
          <>
            <Sparkles className="size-6 mx-auto mb-3 text-muted-foreground" />
            <h2 className="font-semibold mb-1">Tool flow being built</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              The actual {tool.shortName} create-and-download flow lands here next.
              {!isActivated && " Tool not yet activated for your org."}
            </p>
          </>
        ) : tool.status === "planned" ? (
          <>
            <h2 className="font-semibold mb-1">Coming soon</h2>
            <p className="text-sm text-muted-foreground">
              We&apos;re building this next. Want a heads-up when it launches?
              We&apos;ll email you — once, never again.
            </p>
          </>
        ) : (
          <>
            <h2 className="font-semibold mb-1">Ready</h2>
            <p className="text-sm text-muted-foreground">
              Tool flow ready — start a new generation below.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
