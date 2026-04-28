# Claude Pickup Point

A running hand-off doc so the next Claude session (or Jamie reading it later)
can pick up cold without re-reading the conversation. Update this every time
something meaningful ships. STATUS.md is the formal product doc; this is the
conversational version.

## Last session — 2026-04-28 (day-job — depth + CommandPicker)

Jamie said black-on-white was still reading as awful. Depth tokens existed
but weren't doing visible work. Fixed:

1. Canvas tint bumped (oklch 0.975, chroma 0.012) — distinct from cards.
2. Borders given slight cool-blue tint (matches SL's #E3E8EF).
3. Shadow scale bumped a notch — depth actually registers.
4. Card primitive: header now has a real bottom rule, footer uses
   surface-pebble, body padding consistent.
5. Input + Textarea: bg-card (raised), brand lime focus ring, soft
   border, hover-darkens to border-strong, h-9 (bigger touch target).
6. Button primary: cool shadow at rest, lifts on hover, focus ring lime.

CommandPicker wired into RA / COSHH / HAVs. Pattern: initial gallery
stays (discovery), CommandPicker is the in-editor "Add ⌘K" upgrade —
fuzzy search, multi-select, sticky-bar continue, inline custom-create.
Filters out items already added so the picker never shows duplicates.

## Last session — 2026-04-28 (evening, structural foundations push)

Jamie was frustrated. Three previous visual passes hadn't landed. He said
the product is "leagues apart" from SiteLynx both structurally and
aesthetically and asked me to take over and make the calls.

I ran a side-by-side diff between SL (`c:\Users\Jamie\sitelynx-v2`) and
CNC and identified five concrete gaps. Jamie pushed back hard on framing
this as "be like SL" — the product is for 1–5 person solo traders, not the
10–50 audience SL serves, AND the target needs to include both
"engaged-with-the-system" users AND the touchless / phone-in-the-van users.

Decision: don't rebuild as SL clone. Two-surface product. Engaged surface
(the existing builders/sidebar/dashboard) gets polish. Touchless surface
(share page, simple intake, renewal calendar) is a future add.

This push focused on the foundation problems that were blocking everything
visually:

1. **Lime token family.** Built `--brand-hover / -dim / -soft-bg /
   -soft-border / -ring`. Wired `--ring` to `var(--brand)` so every focus
   state across the app (inputs, buttons, cards) is now lime-bordered
   instead of near-black. Added utility classes: `bg-brand-hover`,
   `bg-brand-soft`, `text-brand-dim`, `border-brand-soft`, `ring-brand`,
   `focus-brand`.
2. **Sidebar visibility.** `--sidebar` was `oklch(0.985)`,
   `--surface-canvas` was `oklch(0.985 0.005 240)` — invisible side by
   side. Sidebar is now pure white (`oklch(1)`) with stronger
   `--sidebar-border` (`oklch(0.88)`) so it reads as a real rail.
3. **Active nav state uses brand.** `<AppNavLink>` and the RAMs sidebar
   active state both moved from `bg-muted` / `bg-sidebar-accent` to
   `bg-brand-soft` with a 3px lime stripe down the left edge. The brand
   finally appears in navigation feedback.
4. **Lifted the sidebar pattern to the whole app.** New
   `<AppSidebar>` + `<AppSidebarMobileTrigger>` in
   `_components/app-sidebar.tsx`. Replaces the top nav. Same SL pattern:
   collapsible rail, brand mark top, primary nav middle, user/logout
   bottom. /tools/rams keeps its secondary rail (Linear-style dual
   sidebar). Mobile: single Sheet with both layers.

What broke + got fixed: Tailwind v4 doesn't allow `::before` in
`@utility` names — caught at runtime, fixed by dropping the
`nav-active::before` utility (the stripe is rendered by a real `<span>`
in the components anyway).

CommandPicker / NewDocChoiceModal / AIFillButton-everywhere — still
orphaned. **Deliberately deferred** to keep this push focused on the
structural-foundation problem. Wiring those is the obvious next move.

## Last session — 2026-04-27 (early — multi-pick + library expansion)

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

After tonight's foundations push, the obvious follow-ups in order:

1. **Wire the orphan components (CommandPicker / NewDocChoiceModal /
   AIFillButton).** They were built but never adopted. Now that the lime
   tokens exist, they'll inherit the brand consistently when wired.
   CommandPicker into RA / COSHH / HAVs (replaces LibraryGallery in those
   builders' library-picker mode). NewDocChoiceModal as the first-load
   choice when someone hits a builder URL. AIFillButton onto every text
   field across all 33 builders. ~half day end-to-end.

2. **Per-builder personality.** With the foundation now coherent, each
   builder type can earn distinct chrome without it clashing — Permits
   get traffic-light validity + issuer/holder pills, Briefings get a
   sign-off table front-and-centre, Inspections get pass/fail rows.
   Approach: build one (Permit) properly, extract a pattern, apply.
   ~day per builder family.

3. **Touchless surface — share page (`/u/<slug>`).** The single most
   "different from SL" feature for the 1–5 audience. Public read-only
   URL with their branding, current insurance + certs + downloadable
   docs. Customers/subbies hit one link instead of email round trips.
   Doesn't disturb the engaged surface at all. ~1–2 days.

4. **"Today" home view.** Replace the dashboard's stat-card pattern
   with a single column: drafts to finish, renewals due, "Make a thing"
   (3 tap targets), Recent docs. Engaged user still has the sidebar to
   drill in. Stops feeling like SaaS. ~half day.

5. **One-shot intake input.** Single text/voice box: "RAMs for kitchen
   strip-out, 2nd floor, no asbestos" → AI routes to right builder +
   prefills. Sits at the top of the home + in the global Cmd+K. ~day.

Plus the older queue items still relevant: send-to-client email flow,
save-as-my-template, project/client smarter Documents page (already
partially built — see migration 0004).

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
