# Claude Pickup Point

A running hand-off doc so the next Claude session (or Jamie reading it later)
can pick up cold without re-reading the conversation. Update this every time
something meaningful ships. STATUS.md is the formal product doc; this is the
conversational version.

## Last session — 2026-04-27 (Cut the fat — Tier 2)

After the sidebar cut, ran the structural Tier 2 changes:

- **`/tools` → redirect** to `/tools/rams`. The page was a "module
  catalog" surfacing future products (QA, Permits Module, Plant
  Inspections) that don't ship yet. For a daily user that's a
  dead-weight click. Future modules will land as sidebar entries on
  per-org-activation when they're real, not as marketing tiles inside
  the logged-in app. The marketing page at `/` keeps the catalog.
- **AppSidebar "Tools" → "Documents"**. Now points at
  `/tools/rams/documents` (the actual list of saved/sent/draft docs)
  with a `FileText` icon. "Tools" was misleading — most users want to
  see their docs, not browse the tool registry.
- **Dashboard "Your tools" + "Available tools" sections cut**.
  These showed the framework_activations registry as marketing tiles
  on the dashboard itself. Removed: `framework_activations` query,
  `activeTools` / `availableTools` derivation, `ToolRow`,
  `ActivateButton`, plus their imports (`ALL_TOOLS`, `formatPricing`,
  `activateToolAction`, `ToolSlug`). The activation system itself
  isn't dead — `/tools/[slug]` per-tool landing pages still use it
  for prospect/marketing views.

The dashboard is now lean: TrialBanner / Greeting / IntakeBox /
ShareLinkCard / Continue drafting / Recently completed / Quick actions /
Stats grid. No more marketing surfaces inside the logged-in flow.

Type-check + lint clean.

## Last session — 2026-04-27 (Cut the fat — sidebar 37 → 10)

After the touchless-surface trio shipped, Jamie called a sanity check
on whether the system was actually navigable for the target user. The
verdict: simple paths exist (intake / share / send) but coexist with a
bloated 37-builder sidebar across 8 sections including a Library
section that's authoring scaffolding, not user nav.

Decided cut: 37 sidebar entries → **10 flat entries, no sections, no
library**. Down from 8 sections to zero.

Final 10:
1. Full RAMs
2. Method Statement
3. Risk Assessment (absorbs WAH, Manual Handling, Hot Works, Confined
   Space, Lone Working, DSEAR, Pregnant Worker, Young Worker, WBV)
4. COSHH
5. HAVs (kept separate — bespoke EAV/ELV calculator)
6. Noise (kept separate — bespoke dB calculator)
7. Permit (umbrella picker, 5 types)
8. Briefing (umbrella picker, 4 types)
9. Inspection (umbrella picker, 4 types)
10. Plan (umbrella picker, 4 types)

The 26 hidden slugs still work as deep links from AI intake and direct
URLs — they're just not in the sidebar. Library section (RA Library,
COSHH Library, HAVs DB, Noise DB, Trade Templates) hidden entirely.

New plumbing:

- `src/lib/rams/sidebar-items.ts` — curated `SIDEBAR_ITEMS` array
  replacing `buildersBySection()` for sidebar consumption. The
  `BUILDERS` registry stays as the source of truth for the registry
  itself (route resolution, intake validation, PDF dispatch).
- `src/app/(app)/tools/rams/_components/umbrella-picker.tsx` —
  shared 4–5 tile picker component for the 4 umbrella entries.
- 4 new pages: `/permits`, `/briefings`, `/inspections`, `/plans`
  — each a small picker that links into the underlying slug-specific
  builder.
- Sidebar rewritten to consume `SIDEBAR_ITEMS`. Active state matches
  prefix so being inside a permit slug highlights the "Permit" entry.
- RAMs landing page restructured: hero (Full RAMs) + Documents (5
  tiles) + Workflow (4 umbrella tiles). Dropped library section
  entirely.

Type-check + lint clean. The 37 builders all still exist as routes;
this is purely a navigation cut, not a feature cut.

## Last session — 2026-04-27 (Send to client — Resend wired up)

The third leg of the touchless-surface push: every builder now has a
**Send** button that emails the doc PDF directly to a client/main
contractor with the firm's name in the From, an optional one-liner
message, and a link back to the public share page.

New infra:

- **`src/lib/email.ts`** — Resend client + `sendDocumentEmail()` helper
  with HTML + plain-text templates. Includes a dev fallback when
  `RESEND_API_KEY` is empty: logs the would-send and returns
  `{ ok: true, simulated: true }` so the dialog flow can be exercised
  without a real Resend account. Production refuses to fake-send.
- **`src/lib/pdf-react/render-doc.ts`** — extracted the React-PDF
  dispatcher into a shared helper that returns `{ bytes, doc, org }`.
  Doesn't yet replace the inline dispatchers in
  `/api/rams/[id]/pdf/route.ts` or `/api/share/doc/[id]/pdf/route.ts`
  (those still work) — the helper is just used by the new send route.
  Future cleanup: migrate both legacy routes to call the helper.
- **`/api/docs/[id]/send/route.ts`** — auth + ownership check, rate-limit
  (30/min user, 200/day org), renders PDF, sends via Resend, writes a
  row to the new `document_sends` audit table. Returns
  `{ ok: true, simulated: bool, id: string }` on success.
- **Migration `0005_document_sends.sql`** — audit table with
  `recipient_email`, `subject`, `message`, `pdf_filename`,
  `resend_message_id`, `status` (sent/failed/simulated), `error`,
  `sent_by`, `sent_at`. RLS read-only for org members; inserts go
  through service role. Indexed by `(org, document_id)`,
  `(org, sent_at desc)`, and `client_id`.
- Types updated in `src/types/supabase.ts`.

Client surface:

- **`SendDialog`** — three-field dialog (To, Name, optional message)
  with a Send button. Toast on success/failure; "Sent (dev mode)" when
  simulated.
- **`SendButton`** — drop-in primitive for builder action bars. Disabled
  while the doc isn't saved (no id to send).

Wired into 5 priority builders so far:
- Method Statement
- Permit (5 permit slugs)
- Briefing (3 briefing slugs)
- Inspection (4 inspection slugs)
- Plan (4 plan slugs + Noise)

That's 17 of the 22 builder slugs covered. RA, COSHH, HAVs, Toolbox,
Full RAMs are next — same pattern, one-liner per builder.

The Send + Share + Intake trio now form the full touchless surface:
intake (push in) → builders (work) → share + send (push out). Type-check
clean. Run migration 0005 before pushing to prod.

## Last session — 2026-04-27 (Today-style dashboard restructure)

After intake landed, restructured the dashboard so the first thing a
returning user sees is "what needs your attention" rather than ambient
stats. New top-of-page order:

1. PageHeader (greeting + tier pill)
2. **IntakeBox** — "Make a thing" sentence input
3. **ShareLinkCard** — public share URL with copy
4. **Continue drafting** — pinned drafts block (top of LEFT 2/3 column,
   only renders when drafts exist) — lime dot, lime-tinted icon tile,
   "Continue →" CTA per row
5. **Recently completed** — replaces "Recent activity"; filtered to
   `status="complete"` only, ordered by `generated_at` desc
6. Quick actions (RIGHT 1/3 column unchanged)
7. Stats grid (demoted from top to ambient context)
8. Active tools / Available tools

Two parallel queries replace the single `recentDocs`:
- `recentDrafts` — `status="draft"`, top 5 by `updated_at`
- `recentCompleted` — `status="complete"`, top 5 by `generated_at`

Smart empty state: if the user has drafts but no completed docs, the
"Recently completed" block doesn't shout "No documents yet" — it gently
says "Wrap a draft above and it'll appear here". Empty-empty users
get the original "Type what you need above, or pick a builder" CTA.

Both blocks share a `DashboardDoc` typedef so adding new fields later
is one place. Type-check + lint clean.

This completes the queue's "engaged dashboard polish" arc — drafts,
recent, intake, share, stats all coherent on one page. Next up:
renewal calendar (the missing piece — periodic docs that go stale),
or send-to-client email flow via Resend.

## Last session — 2026-04-27 (one-shot intake — the magic surface)

After the touchless surface, built the highest-magic feature on the queue:
the **one-shot intake**. A single input on the dashboard. Type:

> first fix electrical at plot 12 lyme wood tomorrow

…and the AI picks the right builder, drafts a title and scope, identifies
the trade, and routes the user straight into the builder with the form
pre-populated. For Method Statement and Risk Assessment, if the trade
matches a library entry, the trade's pre-built steps/hazards load
automatically — the user lands in the editor, not the picker. Skips the
gallery entirely on the intake path.

Files:

- **`src/app/api/ai/intake/route.ts`** — Haiku 4.5 + JSON-only output.
  Prompt lists every non-planned, non-library builder (slug + shortName +
  tagline) so the model picks from a real enum. Tolerant JSON parsing
  (handles ```json fences). Validates slug against the BUILDERS registry.
  Shares the daily free-tier quota bucket with `/api/ai/fill`. Rate-limited
  to 20/min per user.
- **`src/app/(app)/dashboard/_components/intake-box.tsx`** — Sparkles
  badge, "Make a thing" eyebrow, single text input with Enter-to-submit,
  Loader2 spin during routing, lime brand halo top-right. Sits at the very
  top of the dashboard above ShareLinkCard.
- **`src/app/(app)/tools/rams/_components/use-intake-prefill.ts`** —
  Lazy-initialised state captures `ai_title` / `ai_scope` / `ai_trade` from
  the URL once on mount, then an effect strips them with `router.replace`
  so a refresh doesn't re-apply. Returns a stable reference for the
  component lifetime so consumers can safely use it as a useEffect dep.
- **5 builder wires** — Method Statement, Risk Assessment, Briefing,
  Permit, Plan all consume `useIntakePrefill()`. MS + RA additionally
  fuzzy-match `ai_trade` against `RAMS_TRADES` and auto-load steps/hazards
  when a match is found.

The use-intake-prefill hook went through 3 lint iterations to satisfy
React 19's stricter `react-hooks` plugin (no setState in effect, no ref
mutation in render, no ref reads in render). Final form uses lazy
`useState` initializer — the canonical "compute once from external source"
pattern.

UX win: on the gallery view, if the user's intake mentioned a trade
that matches the library, they skip the gallery entirely. The
8-step Electrical method statement just appears, title set, scope set —
they're already drafting.

Type-check clean. Committed as `8cd878d` style.

## Last session — 2026-04-27 (touchless surface MVP)

Plan personality landed (commit 0b158ee). Then built the first cut of the
**touchless surface** — the differentiating feature for solo traders that
no other compliance tool in the £2–19/month bracket has.

Three new files:

- **`src/app/share/[slug]/page.tsx`** — public route, no auth. Server
  component that looks up an org by slug, fetches up to 20
  `status="complete"` docs, renders a branded identity card (logo, name,
  industry, description) with the lime stripe, and lists docs with PDF
  download buttons. `revalidate = 60`. Includes `generateMetadata` for SEO.
- **`src/app/api/share/doc/[id]/pdf/route.ts`** — public PDF endpoint, no
  auth. Hard-gated to `status="complete"` only. Mirrors the authed
  endpoint's PDF dispatcher (all 30+ builder slugs route to the right
  template). Watermark via `hasProAccess()` — free orgs get watermarked,
  Pro orgs get clean. `Cache-Control: public, max-age=300`.
- **`src/app/(app)/dashboard/_components/share-link-card.tsx`** — client
  component "Your public share page" strip with lime stripe, Share2 icon,
  the absolute URL in mono, copy-to-clipboard (with Check tick flash) and
  View-in-new-tab buttons. Hint text adapts: with completed docs → "Send
  this link to customers", without → "Mark a doc 'complete' and it'll
  appear here".

Wired into the dashboard right under the PageHeader so first-time users
discover it the moment they land. Uses `org.slug` (already on the org).

Security model: doc IDs are UUIDs (practically unguessable), and the
`status="complete"` gate means drafts can never leak. Org slug is the only
piece a customer needs. If we later want stronger control, add a per-doc
`share_token` column.

Type-check clean. No lint errors (removed two unused lucide imports from
the share page).

## Last session — 2026-04-28 (day-job, continued — personality push)

After the depth/CommandPicker work, kept going through the queue. Lifted
3 generic builders into ones that actually *look* like their document type:

- **Permit** — identity strip (corporate-permit feel), traffic-light
  validity banner, side-by-side Issuer/Holder identity cards with
  signed/unsigned pills, validity time-strip showing where 'now' sits
  in the window, AlertTriangle on Precautions card
- **Briefing** — talk-script feel: brand-striped headline banner with
  audience/duration/point-count chips, presenter strip front-loaded,
  numbered talking-point rows with foreground number badges, hover-
  reveal delete
- **Inspection** — inspection-cert header, live Pass/Fail/N/A count
  tiles (update as user ticks through checklist), inspector strip,
  failed items get a red gutter + ring + inline defect note,
  big two-button Pass/Fail "stamp" at the bottom with icons

Also lifted the dashboard list containers + projects/clients tables
to use the new depth tokens (surface-raised + border-soft +
shadow-sm-cool + lime hover) so the whole app reads as one piece.

Plan (the 4th generic builder) wasn't lifted — it's free-text-heavy
and used less; the Card primitive lift gave it most of what it needs.

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
