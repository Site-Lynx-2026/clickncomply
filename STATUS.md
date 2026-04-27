# Status — 27 Apr 2026

## Last session: RAMs Builder spine + Method Statement end-to-end

### What's wired now

**RAMs Builder app** — `/tools/rams`
- Sidebar with 8 sections, 37 standalone builders, mirroring SL's visual grammar in CnC's light theme
- Lime active stripe, "soon" / "building" status pips, collapsible to 68px
- Landing page with hero tile (One-Click Full RAMs) + 7 grouped builder sections
- All 37 routes are clickable; planned ones render the `ComingSoon` vote-to-build screen

**Library port from SiteLynx-v2** — `src/lib/rams/`
- `library.ts` — 180 RAs across 18 categories, 20+ COSHH, 15+ HAVs, 15+ noise, 40+ trade templates
- `tools.ts` — power tool / plant catalogue with HAVs/Noise/COSHH tagging
- `config.ts` — 12-step RAMS shape, risk matrix, HAVS calc, noise LEQ
- `builders.ts` (new) — 37-builder registry driving the sidebar

**Six builders with UI scaffolded**
- Full RAMs (12-step rail, navigation, save/library/AI buttons; step bodies still stubbed for SL port)
- Method Statement — **fully wired end-to-end** (see below)
- Risk Assessment — 5×5 matrix, library picker (search + 18-category filter)
- COSHH — substance-by-substance, SDS / WEL / PPE / emergency
- HAVs — auto-calc per tool, EAV/ELV thresholds, exposure bar
- Toolbox Talk — 30+ pre-written topics, AI write button
- RA Library browser — searchable, filterable, expandable detail (free-tier SEO play)

**AIButton component** — `src/components/ui/ai-button.tsx`
- Lime gradient bg, Sparkles icon, hover ring, "Thinking…" loading state
- Used in Full RAMs, Method Statement, Risk Assessment, COSHH, Toolbox Talk

### Infrastructure spine — every future builder plugs into this

**DB** — `supabase/migrations/0003_rams_documents.sql` ✅ applied 2026-04-27
- One `rams_documents` table, polymorphic via `builder_slug` + JSONB `form_data`
- Status: draft / complete / archived
- `rams-pdfs` storage bucket, org-scoped RLS on table + bucket
- Indexes for org-listing, builder-listing, status-listing

**API**
- `GET / POST /api/rams` — list, create
- `GET / PUT / DELETE /api/rams/[id]` — fetch, update, archive
- `GET /api/rams/[id]/pdf` — render PDF (free tier watermarked, paid clean)
- `POST /api/ai/[task]` — Anthropic Haiku 4.5 dispatcher with prompt-cached system prompts

**AI tasks** — `src/lib/anthropic/tasks.ts`
- `method-statement-fill` — trade → JSON array of method steps
- `method-statement-tighten` — sloppy steps → tightened JSON
- `toolbox-talk` — topic + audience + duration → free-form briefing
- `ra-controls` — hazard → control measures (text)
- `coshh-controls` — substance → JSON {exposure, controls, ppe, emergency}
- All system prompts cached, ~5min TTL

**PDF pipeline** — `src/lib/pdf/`
- `render.ts` — shared primitives (cover banner, sections, numbered steps, footer)
- `templates/method-statement.ts` — first template, light-lime cover with 1px dark rule
- Watermark applied for free tier outputs (hooks into existing `applyWatermark()`)

### Method Statement — fully working flow

`/tools/rams/method-statement`:
1. Type a title + trade (e.g. "Electrical first fix")
2. Click **AI fill from trade** → Haiku generates 8–14 method steps with responsibles in ~2s
3. Auto-saves 1.5s after every edit; "Saved at HH:MM" indicator at top
4. URL becomes `?doc=<id>` so refresh resumes the draft
5. Click **Download PDF** → branded cover, lime stripe, watermarked footer (or clean if `subscription_tier='pro'`)

This is the pattern. Every other builder (Risk Assessment, COSHH, HAVs, Toolbox Talk, etc.) plugs into the same spine — each is ~200 lines of UI wiring, no infra to build.

## What's NOT wired yet

- Risk Assessment, COSHH, HAVs, Toolbox Talk save/load/PDF — they have UI but no API hookup yet
- Full RAMs 12-step bodies — the rail navigates but step components are stubbed for SL port
- 31 stubbed builders show ComingSoon screen — vote-to-build email capture needs `/api/rams/vote-builder` route
- PDF templates for Risk Assessment / COSHH / HAVs / Toolbox Talk — only Method Statement template built
- RA Library "Use in builder" button — currently just a copy-text fallback
- Stripe paywall on PDF download — tier check exists but no upgrade prompt yet

## Critical reminders (still apply)

From earlier session:
- **Never** display ISO logo. Use "templates aligned with ISO 9001:2015"
- One-click cancel + separate auto-renew tickbox before paid launch (ARL/DMCC)
- DPA + sub-processor list before paid launch
- Liability cap at greater of £100 / 12 months' fees
- "AI-generated draft" label everywhere (already in PDF footer + ComingSoon copy)
- EU OSS VAT — register from first EU B2C sale

## Files changed this session

```
NEW:
  src/app/(app)/tools/rams/layout.tsx
  src/app/(app)/tools/rams/page.tsx
  src/app/(app)/tools/rams/[builder]/page.tsx
  src/app/(app)/tools/rams/_components/{sidebar,builder-shell,coming-soon}.tsx
  src/app/(app)/tools/rams/_builders/{full,method-statement,risk-assessment,coshh,havs,toolbox-talk,ra-library}.tsx
  src/lib/rams/{config,library,tools,builders}.ts
  src/lib/anthropic/tasks.ts
  src/lib/pdf/render.ts
  src/lib/pdf/templates/method-statement.ts
  src/components/ui/ai-button.tsx
  src/app/api/rams/route.ts
  src/app/api/rams/_helpers.ts
  src/app/api/rams/[id]/route.ts
  src/app/api/rams/[id]/pdf/route.ts
  src/app/api/ai/[task]/route.ts
  supabase/migrations/0003_rams_documents.sql

UPDATED:
  src/types/supabase.ts                    (added rams_documents row/insert/update types)
  supabase/MIGRATIONS_APPLIED.md           (marked 0003 as applied)
  STATUS.md                                (this file)
```

## Next session

In order of impact, my recommended build path:

1. **Wire Risk Assessment end-to-end** — copy the Method Statement save/load/PDF pattern, add a `risk-assessment.ts` PDF template. The RA library picker is already done so this is mostly the spine wiring. ~3 hours.
2. **Wire Toolbox Talk** — simplest of the four because output is free-form text. ~2 hours.
3. **Wire COSHH + HAVs** — same pattern. ~3 hours each.
4. **Port the SL 12-step bodies into Full RAMs** — heavier (~6 hours) but mostly mechanical from `sitelynx-v2/src/components/rams/steps/*`.
5. **`/api/rams/vote-builder`** — captures email + builder slug for the 31 ComingSoon routes. Demand signal before building. ~30 min.
6. **Stripe paywall** — when free user hits Download PDF, watermark works; for clean PDFs, show upgrade modal. Needs Stripe products created first.
