import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "./actions";

export const metadata = {
  title: "Log in — ClickNComply",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight mb-1">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Email + password. We don&apos;t send you reminders.
        </p>
      </div>

      <form action={loginAction} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
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
            required
            autoComplete="current-password"
          />
        </div>

        <ErrorBanner searchParams={searchParams} />

        <Button type="submit" className="w-full">
          Log in
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground border-t pt-4">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline underline-offset-2 hover:text-foreground">
          Sign up free
        </Link>
      </p>
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
