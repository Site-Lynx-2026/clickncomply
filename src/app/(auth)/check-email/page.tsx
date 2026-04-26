import Link from "next/link";
import { Mail } from "@/lib/icons";

export const metadata = {
  title: "Check your email — ClickNComply",
};

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;
  const email = params.email
    ? decodeURIComponent(params.email)
    : "your inbox";

  return (
    <div className="space-y-5 text-center">
      <div className="size-12 rounded-full bg-muted flex items-center justify-center mx-auto">
        <Mail className="size-5" strokeWidth={1.5} />
      </div>
      <div>
        <h1 className="text-xl font-semibold tracking-tight mb-1">
          Check your email
        </h1>
        <p className="text-sm text-muted-foreground">
          Magic link sent to{" "}
          <span className="font-medium text-foreground">{email}</span>.
        </p>
      </div>

      <div className="border-t pt-4 text-xs text-muted-foreground">
        Not arriving? Check your spam folder, or{" "}
        <Link href="/signup" className="underline underline-offset-2 hover:text-foreground">
          try a different email
        </Link>
        .
      </div>
    </div>
  );
}
