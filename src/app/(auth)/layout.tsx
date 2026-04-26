import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-12 bg-muted/30">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full font-mono text-xs uppercase tracking-widest text-muted-foreground mb-8 hover:text-foreground transition"
        >
          <span className="size-1.5 rounded-full bg-brand" />
          ClickNComply
        </Link>
        <div className="bg-background border rounded-lg p-6">{children}</div>
      </div>
    </main>
  );
}
