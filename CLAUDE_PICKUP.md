# Claude Pickup Point

A running hand-off doc so the next Claude session (or Jamie reading it later)
can pick up cold without re-reading the conversation. Update this every time
something meaningful ships. STATUS.md is the formal product doc; this is the
conversational version.

## Last session — 2026-04-27

Built multi-pick across the gallery component. Risk Assessment hazard library,
COSHH substance library, and HAVs tool library all now support shopping-cart
selection: click as many cards as you need, sticky bottom bar shows the running
count, hit "Continue with N items" to commit them all in one go.

Before this push: dense libraries (177 hazards, 79 substances, 80 HAVs tools)
were single-click only. Building a 12-hazard RA was 24 clicks.
After: 13 clicks (12 picks + 1 Continue).

Dev server running on `localhost:3000` (background task `bd76u2ndh`). User signed
in. `.env.local` has Supabase keys for project `hwqmyjjtccndaabylrga` and the
Anthropic key copied from sitelynx-v2.

## Current state of play

**Live and working end-to-end** (`/tools/rams/...`):
- Full RAMs (`/full`) — picker-first, single scroll page, 10 sections
- Method Statement (`/method-statement`) — trade picker, AI tighten, PDF
- Risk Assessment (`/risk-assessment`) — by-trade or by-hazard, multi-pick, AI controls, PDF
- COSHH (`/coshh`) — substance library multi-pick, AI fill, PDF
- HAVs (`/havs`) — tool library multi-pick, exposure calculator, PDF
- Toolbox Talk (`/toolbox-talk`) — topic gallery, AI auto-generates, PDF
- RA Library browser (`/ra-library`) — searchable read-only browser
- Documents page (`/documents`) — list saved RAMs across all builders

**Library counts (the moat):**
- 78 trades · 177 RA hazards · 79 COSHH · 80 HAVs · 54 noise · 100 toolbox
- Total: 568 pickable items
- Stretch targets in STATUS.md if Jamie wants to keep growing

**Spine (every builder uses these):**
- DB: `rams_documents` table (migration 0003 applied 2026-04-27)
- API: `/api/rams` CRUD + `/api/rams/[id]/pdf` + `/api/ai/[task]`
- AI: Anthropic Haiku 4.5 with prompt caching
- PDF: `pdf-lib` server-side, light-lime cover, watermark gate
- Hook: `useBuilderDocument` handles save/load/PDF for any builder

**Stub routes** (31 entries in sidebar): every other RAMs builder shows the
ComingSoon vote-to-build screen. `/api/rams/vote-builder` not yet wired.

## How Jamie works (read this before doing anything)

These are non-obvious and applied across every push:

1. **Library is the product** — every builder MUST open with a picker gallery.
   Typing is reserved for company-specific custom fields. A 10-year-old should
   build a RAMs by clicking. Saved as `feedback_clicks_not_typing.md`.

2. **Aesthetically simpler than SiteLynx** — no tabbed wizards, single scroll
   pages with anchor jumps, light-lime cover banner with 1px dark rule, never
   charcoal slabs.

3. **No commercial features in SiteLynx** — but ClickNComply is a different
   product, doesn't apply here directly. SiteLynx-equivalent feature in
   ClickNComply means the SAME functionality but rebuilt simpler.

4. **Push to origin after meaningful work** — `feedback_summaries_and_git.md`.
   No need to ask. Stage specific files, never `git add .`. Don't commit
   `.env.local`.

5. **Update STATUS.md and CLAUDE_PICKUP.md every meaningful session** —
   `feedback_pickup_doc.md`.

6. **Agents for research only** — `feedback_agents.md`. Implementation is
   always direct.

7. **Quality bar — beat HandsHQ / BrightHR / Procore / Fieldwire per module** —
   `project_quality_bar.md`.

## Active strategic decisions (don't re-derive these)

- **Model:** Anthropic Haiku 4.5 (`claude-haiku-4-5-20251001`) for all AI
  generation. Cheap and fast for high-volume template work. Locked in
  `src/lib/anthropic/client.ts`.
- **Watermark:** free tier always watermarked; paid tier (`subscriptions.tier =
  'pro'` and `status` in `('active', 'trialing')`) gets clean PDFs.
- **Polymorphic doc storage:** one `rams_documents` table for all 37+ builders
  — `builder_slug` + JSONB `form_data`. Adding a new builder = no migration.
- **Tools-first product model:** ClickNComply Group has multiple cheap tools,
  not one £9 suite. RAMs Builder is one of five (others: Lift Plans, QA Builder,
  HR Lite, Compliance Suite). Each has its own /landing route and pricing.
- **Save-by-default:** every builder auto-saves 1.5s after edit. URL becomes
  `?doc=<id>` so refresh resumes.

## What I'd do next

In priority order:

1. **Multi-trade picker for Full RAMs** (the second item from the
   "what's next" conversation). Most projects aren't one trade — house refurb
   is groundworks + electrical + plastering. Allow picking 2–4 trades; merge
   their msSteps + dedupe their raItems/havsItems/noiseItems + union their
   PPE. ~3 hours.

2. **Projects + Clients as persistent entities.** New Supabase tables
   `clients` and `projects`. New doc → "Pick a project" → auto-fill site
   name/address/dates from project. Documents page groups by project.
   Foundational — unlocks send-to-client, smarter Documents page, project-level
   ZIP downloads. ~6 hours.

3. **Send-to-client email flow.** Resend already in package.json. Generate PDF
   → email with magic-link sign-off → recipient clicks → records signed-off
   timestamp + IP. SL has it; CnC doesn't. ~6 hours.

4. **Smart Documents page.** Filter by builder, search, group by project,
   recent / favourites. Becomes essential past 20 docs. ~4 hours.

5. **Save-as-my-template.** User customises a Method Statement → "save as
   template" → appears in their gallery with "MINE" badge. Differentiator
   that builds switching cost. ~4 hours.

## Notes / gotchas for next Claude

- **Dev server orphan:** if you start `npm run dev` and it 500s, an old PID
  may be holding port 3000. `netstat -ano | grep :3000` then
  `taskkill //PID NNN //F`.
- **Windows line endings:** Git warns about LF→CRLF on every commit. Ignore
  the warnings.
- **Bash tool quirk:** `cd` resets between commands — always use absolute
  paths or chain with `&&`.
- **CLAUDE_PICKUP.md is for hand-off, not history.** Edit in place; don't
  append session-by-session. STATUS.md keeps the historical layered story.
- **Anthropic key is shared with sitelynx-v2.** Both projects use the same
  key (loaded from `sitelynx-v2/.env.local` originally). If quota issues,
  Jamie's the only user across both.
- **The 31 stub builders** all route through `[builder]/page.tsx` — adding a
  real implementation just means another `case` in the switch + a new file
  in `_builders/`.

## File layout reminder

```
src/lib/rams/
├── builders.ts        — 37-builder registry (drives sidebar)
├── library.ts         — 78 trades, 177 RAs, 80 HAVs, 54 noise, 15 legacy COSHH
├── coshh-substances.ts — 79 COSHH substances (the new format)
├── toolbox-topics.ts  — 100 toolbox talk topics
├── tools.ts           — PPE / power tool / plant / hand tool catalogues
└── config.ts          — 12-step shape, risk matrix, calc functions

src/app/(app)/tools/rams/
├── layout.tsx         — sidebar shell
├── page.tsx           — landing page (hero + builder grid)
├── documents/         — saved doc list page
├── [builder]/page.tsx — dynamic dispatcher to _builders/*
├── _components/       — shared UI (sidebar, gallery, hook, save-status)
└── _builders/         — one file per active builder

src/lib/pdf/
├── render.ts          — primitives (cover, sections, key-value, footer)
├── watermark.ts       — applyWatermark for free tier
└── templates/         — one file per builder PDF (5 wired so far)

src/app/api/
├── rams/route.ts          — list + create
├── rams/[id]/route.ts     — fetch + update + archive
├── rams/[id]/pdf/route.ts — render PDF (switch by builder_slug)
├── rams/_helpers.ts       — resolveContext (auth + org)
└── ai/[task]/route.ts     — Anthropic dispatcher

supabase/migrations/
├── 0001_init.sql           — base schema (applied)
├── 0002_widen_record_type.sql — pending
└── 0003_rams_documents.sql — applied 2026-04-27
```

## To resume work

1. `cd "c:\Users\Jamie\Desktop\personal projects\clickncomply"`
2. Check the dev server is running: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000` should return 200 or 307. If not, `npm run dev`.
3. Read STATUS.md for the formal feature state.
4. Read this file's "What I'd do next" — pick one and start.
