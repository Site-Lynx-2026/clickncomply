import Link from "next/link";

/**
 * Slim layout for /privacy and /terms — minimal chrome, focused on the
 * document text. Used regardless of auth state so we don't push users
 * through login just to read the legal pages.
 */
export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b">
        <div className="container mx-auto max-w-3xl px-6 h-14 flex items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest hover:text-foreground/70 transition"
          >
            <span className="size-1.5 rounded-full bg-brand" />
            ClickNComply
          </Link>
        </div>
      </header>
      <main className="flex-1 container mx-auto max-w-3xl px-6 py-12">
        {children}
      </main>
      <footer className="border-t">
        <div className="container mx-auto max-w-3xl px-6 py-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms
          </Link>
          <span className="ml-auto">
            © {new Date().getFullYear()} Site Lynx Group Ltd
          </span>
        </div>
      </footer>
    </div>
  );
}
