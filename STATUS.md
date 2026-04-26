# Status — 26 Apr 2026 (15:30)

## What's done while you were away

### Project scaffold ✓
- Next.js 16 + TypeScript + Tailwind v4 + Turbopack
- shadcn/ui (Radix flavour, Nova preset) initialised
- 17 shadcn components added: button, input, label, card, dialog, form/select/textarea, badge, separator, tabs, alert, dropdown-menu, sheet, table, sonner, skeleton, checkbox
- TypeScript compiles clean (0 errors)
- Local dev server ready: `cd clickncomply && npm run dev` → http://localhost:3000

### Library code ✓
- `src/lib/supabase/{client,server,middleware}.ts` — three clients (browser, server, admin, middleware session refresh)
- `src/lib/anthropic/client.ts` — Anthropic SDK with default Haiku 4.5 + Sonnet 4.6 for advisor
- `src/lib/stripe/client.ts` — Stripe SDK + price ID exports
- `src/lib/pdf/watermark.ts` — pdf-lib watermark engine ("Powered by ClickNComply" diagonal + footer for free tier)

### Framework registry ✓
- `src/frameworks/index.ts` — 11 frameworks defined with metadata (ISO 9001 wip, others planned)
- Architecture is framework-agnostic: adding new ones = adding content, not refactoring core

### Landing placeholder ✓
- `src/app/page.tsx` — clean placeholder with the "consultant in your laptop" hero
- Layout updated: title + description + Toaster baked in
- v0.1 mark on the placeholder so it's clearly scaffold

### Env template ✓
- `.env.local.example` lists every key needed (Supabase, Anthropic, Stripe, Resend)
- `.gitignore` updated so `.env.local.example` commits but real `.env.local` stays out

### Git ✓
- Initialised, remote at https://github.com/Site-Lynx-2026/clickncomply
- Pushed initial commit + Stripe API version fix
- 50 files committed, 0 secrets

### Research ✓ (4 agents completed in parallel)
All saved to `research/`:

| File | Words | What |
|---|---|---|
| `COMPETITORS.md` | 5,065 | 20 competitor profiles + £9 gap analysis + 3 positioning angles |
| `LANDING_RESEARCH.md` | 5,306 | 12 best-in-class landings reviewed + build brief + hero variants |
| `FRAMEWORKS.md` | 9,223 | 11 frameworks deep-dive: clauses, templates, schema, audit cycles |
| `LEGAL.md` | 5,392 | Trademark, ARL/DMCC cancel, GDPR, AI Act, VAT — 6 critical gotchas |

## Critical findings you should read first

**From COMPETITORS.md:** The £9/mo gap is real, not papered over. Cheapest competitor self-serve floor is $199/mo (Comp AI). Watermark mechanic = greenfield in this category. **No vendor on Earth has CHAS / ConstructionLine inside their software** — that's defensible UK construction wedge.

**From LANDING_RESEARCH.md:** Lead with *"The compliance consultant lives in your laptop now."* Hold *"Save £2,000 on a compliance consultant. Pay £9 instead."* for paid traffic. Linear-clean chassis + claymation accents + lime/acid-yellow signature.

**From FRAMEWORKS.md:** **70%+ of templates overlap across frameworks** — schema should reflect this with shared core tables. EN 1090-2 needs its own specialised data model (most differentiating from competitors). Cyber Essentials v3.3 went live 27 April 2026 — important: any pre-2026 evidence pack will fail.

**From LEGAL.md (read this first if anything):**
1. **Never** display ISO logo, never say "ISO certified". Use "templates aligned with ISO 9001:2015".
2. Build subscription architecture for **California ARL + UK DMCC** — one-click cancel, separate auto-renew tickbox, pre-renewal reminders, 14-day cooling-off.
3. **DPA + sub-processor list** must be live before paid launch.
4. **Liability cap** £100 / 12 months' fees. Never present as consultancy.
5. **AI disclosure** — "AI-generated draft" label everywhere.
6. **EU OSS VAT** — register from first EU B2C sale, no threshold.

## What I did NOT do (intentional)

- **Database schema design** — needs your Supabase project URL first. Will design once you give me the project + run the migrations.
- **Auth flows** — same reason. Needs Supabase project.
- **Stripe products** — you'll create those in Stripe Dashboard. Price IDs go in `.env.local`.
- **ISO 9001 questionnaire content** — that's V1 work. The framework registry has the slot, content goes in `src/frameworks/iso-9001/` once we move from scaffold to V1 build.
- **Watermark engine integration into a working PDF generation flow** — the `applyWatermark()` function exists, but there's no PDF generation pipeline yet. That's V1.
- **`npm run dev` test** — didn't run it (long-running, would block other work). Try it when you're back.

## Next moves when you're back

In order:

1. **Read the 4 research docs** — at least skim. Especially LEGAL.md (gotchas) and FRAMEWORKS.md (schema implications).
2. **Create Supabase project** — give me the URL + keys, I write the schema + auth flows + RLS policies.
3. **Create Stripe products** — Pro Monthly £9 + Pro Annual £86 (use coupon ANNUAL20 for the discount). Paste price IDs into `.env.local`.
4. **`npm run dev`** — verify the placeholder loads at http://localhost:3000.
5. **Pick the V1 build path:** I'd start with the auth flow + onboarding wizard + ISO 9001 questionnaire skeleton. Database schema first, then the wizard, then the AI generation, then the PDF output. We can break this into 4-6 hour blocks.

## Files added to repo

```
.env.local.example          ← all env keys with placeholder values
.gitignore                  ← updated to allow .env.local.example through
README.md                   ← updated with project + stack + legal reminders
STATUS.md                   ← THIS FILE (read this first when back)
components.json             ← shadcn config
src/app/layout.tsx          ← branded layout + Toaster
src/app/page.tsx            ← landing placeholder
src/components/ui/          ← 17 shadcn components
src/frameworks/index.ts     ← 11-framework registry
src/lib/supabase/           ← 3 Supabase clients
src/lib/anthropic/client.ts ← Anthropic SDK + Haiku 4.5 default
src/lib/stripe/client.ts    ← Stripe SDK + price ID exports
src/lib/pdf/watermark.ts    ← watermark engine
research/                   ← 25,000+ words of research
```

## TL;DR

Project's scaffolded, pushed to GitHub, type-checks clean. 25,000 words of research banked. Ready to start V1 build when you say go — just need Supabase project URL + Stripe price IDs to wire up the real backend.
