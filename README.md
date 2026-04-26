# ClickNComply

> The compliance consultant lives in your laptop now.

Universal compliance management platform. Manage every system your business has —
ISO 9001, BS EN 1090, CHAS, ConstructionLine, ISO 14001/45001/27001, Cyber
Essentials, GDPR, CDM 2015, HACCP — all in one place. £9 a month.

**Primary domain:** clickncomply.co.uk
**Aliases:** clickncomply.com → 301 redirect to .co.uk · clickncomply.app → parked / future use
**Repo:** https://github.com/Site-Lynx-2026/clickncomply (private)

## Status — V0.1 scaffold

Initial scaffold landed 26 Apr 2026. Next.js 16 + Supabase + Anthropic Haiku +
Stripe + Resend + pdf-lib + shadcn/ui (Radix, Nova preset).

See `research/` for grounding documents:

- [`COMPETITORS.md`](./research/COMPETITORS.md) — 20 competitor profiles + positioning analysis (5,065 words)
- [`LANDING_RESEARCH.md`](./research/LANDING_RESEARCH.md) — Landing page playbook (5,306 words)
- [`FRAMEWORKS.md`](./research/FRAMEWORKS.md) — 11 framework deep-dive with templates + schema notes (9,223 words)
- [`LEGAL.md`](./research/LEGAL.md) — Trademark, ARL, GDPR, AI Act, VAT (5,392 words)

## Pricing — locked

- **Free** — 1 framework, watermarked outputs, basic templates (viral engine)
- **Pro** — £9/mo or £86/yr (-20% annual), unlimited frameworks, full QMS

No lifetime tier. No team tier. No demos. No phone support. Self-serve only.

## Stack

| Layer | Pick |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind v4 + shadcn/ui (Radix, Nova preset) |
| Auth + DB | Supabase |
| AI | Anthropic Haiku 4.5 (default), Sonnet 4.6 (advisor) |
| Payments | Stripe Checkout |
| Email | Resend |
| PDF | pdf-lib (server-side, with watermark engine) |
| Hosting | Vercel (planned) |

## Development

```bash
# Install (already done in scaffold)
npm install

# Copy env template and fill in real values
cp .env.local.example .env.local

# Dev server
npm run dev
```

Open http://localhost:3000 — the placeholder landing should appear.

## Architecture notes

### Multi-framework from day one

`src/frameworks/` is the registry. Each framework registers itself with metadata,
questionnaire, templates, and record types. The platform itself is
framework-agnostic — adding a new framework should mostly mean adding a new
folder with content (not refactoring the core).

### Watermark engine

`src/lib/pdf/watermark.ts` applies the "Powered by ClickNComply" watermark to
any PDF. **Free-tier outputs always go through the watermark.** Pro-tier outputs
go through `unwatermark()` (which is currently a pass-through — clean PDFs are
generated directly without ever applying the watermark).

### Supabase

Three clients:
- `client.ts` — browser-side (`createClient()`)
- `server.ts` — server components / route handlers (`createClient()`, `createAdminClient()`)
- `middleware.ts` — session refresh in middleware

**Important:** never use `createAdminClient()` in code that runs on the client. It uses the service role key and bypasses RLS.

## Critical legal reminders

From `research/LEGAL.md`:

1. **Never** display ISO logo or say "ISO certified". Use "templates aligned with ISO 9001:2015".
2. **One-click cancel** in same medium as signup, separate auto-renew tickbox at signup, pre-renewal reminders.
3. **DPA + sub-processor list** must be live before paid launch (Anthropic, Supabase, Vercel, Stripe, Resend).
4. **Liability cap** at greater of £100 or 12 months' fees, exclude indirect losses, clear "AI-generated draft" framing.
5. **AI disclosure** required (visible label in-app and on every output).
6. **EU OSS VAT** — register from first EU B2C sale (no threshold). Stripe Tax calculates but doesn't file.

## License

Private. All rights reserved. © Site Lynx Group Ltd, 2026.
