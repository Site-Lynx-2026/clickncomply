import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { onboardingAction } from "./actions";
import { INDUSTRY_GROUPS } from "@/lib/industries";

export const metadata = {
  title: "Get set up — ClickNComply",
};

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // If user already has an org, send to dashboard.
  const admin = createAdminClient();
  const { data: existingMembership } = await admin
    .from("organisation_members")
    .select("organisation_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (existingMembership) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const error = params.error ? decodeURIComponent(params.error) : null;

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "there";

  return (
    <div className="container mx-auto max-w-md px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight mb-1">
          Welcome, {fullName}.
        </h1>
        <p className="text-sm text-muted-foreground">
          One minute of setup. You pick your tool on the next screen.
        </p>
      </div>

      <form action={onboardingAction} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="org_name">Company name</Label>
          <Input
            id="org_name"
            name="org_name"
            type="text"
            placeholder="Acme Engineering Ltd"
            required
            autoComplete="organization"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="industry">What you do</Label>
          <Select name="industry" required>
            <SelectTrigger id="industry">
              <SelectValue placeholder="Pick the closest match" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {INDUSTRY_GROUPS.map((group) => (
                <SelectGroup key={group.label}>
                  <SelectLabel>{group.label}</SelectLabel>
                  {group.industries.map((industry) => (
                    <SelectItem key={industry.slug} value={industry.slug}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            We use this to suggest the right tools and frameworks for your trade.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="employee_band">Team size</Label>
          <Select name="employee_band" defaultValue="2-10">
            <SelectTrigger id="employee_band">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Just me</SelectItem>
              <SelectItem value="2-10">2 – 10</SelectItem>
              <SelectItem value="11-50">11 – 50</SelectItem>
              <SelectItem value="51-250">51 – 250</SelectItem>
              <SelectItem value="250+">250+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full">
          Set up my workspace
        </Button>
      </form>
    </div>
  );
}
