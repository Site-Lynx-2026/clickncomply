import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupAction } from "./actions";

export const metadata = {
  title: "Sign up — ClickNComply",
};

export default function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight mb-1">
          Start free
        </h1>
        <p className="text-sm text-muted-foreground">
          Email + password. Done in 10 seconds. No card needed.
        </p>
      </div>

      <form action={signupAction} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="full_name">Your name</Label>
          <Input
            id="full_name"
            name="full_name"
            type="text"
            placeholder="Jamie"
            required
            autoComplete="name"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@company.com"
            required
            autoComplete="email"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>

        <ErrorBanner searchParams={searchParams} />

        <Button type="submit" className="w-full">
          Create my account
        </Button>
      </form>

      <div className="border-t pt-4 text-center text-xs text-muted-foreground space-y-1">
        <p>
          Already signed up?{" "}
          <Link href="/login" className="underline underline-offset-2 hover:text-foreground">
            Log in
          </Link>
        </p>
        <p>We don&apos;t send marketing. Cancel any time, one click.</p>
      </div>
    </div>
  );
}

async function ErrorBanner({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  if (!params.error) return null;
  return (
    <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {decodeURIComponent(params.error)}
    </div>
  );
}
