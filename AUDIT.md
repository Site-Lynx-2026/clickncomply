# ClickNComply — Codebase Audit

**Date:** 27 Apr 2026
**Reviewer:** Claude (Opus 4.7)
**Scope:** every page, layout, component, API route, migration, library file
**Verdict in one line:** the engine is real, the storefront isn't.

---

## TL;DR

ClickNComply has a genuinely impressive **production engine** for one builder
(RAMs) — five working flows, 568-item library, polymorphic doc storage, AI
spine with prompt caching, watermark-gated PDF pipeline, sane RLS. Build
quality is high; type-check passes clean; visual language is consistent.

What is **not there** is everything around the engine: marketing landing
pages, billing, the 5-day trial logic the strategy promises, send-to-client,
projects/clients, the four other tools the home page advertises. The
ComingSoon vote-capture is a fake (no API behind it). Email confirmation flow
mis-labels itself as a "Magic link." `/api/rams/vote-builder` is referenced
in two files and exists in zero. There are seven lint errors and one real
React-rules-of-hooks bug in the autosave hook.

You can ship a free public beta tomorrow. You **cannot** ship a paid public
launch tomorrow — you'd be charging £2 with no Stripe, no trial enforcement,
no privacy policy, no "Magic link" that's actually a magic link.

---

## 1. Visual / Aesthetic Audit

### What's working ✅

- **Type rhythm is good.** Inter for body, JetBrains Mono for ALL-CAPS
  micro-labels, near-black on pure white. Tracking-tight on h1/h2,
  uppercase tracking-widest on small section labels — that's a coherent
  Linear-class system, not a Bootstrap dump.
  (`src/app/layout.tsx:6-16`, `src/app/globals.css:60-117`)
- **Lime is restrained.** Used on: home hero pill, sidebar status dots,
  Full RAMs hero stripe, AI buttons, the active-nav vertical stripe. That's
  it. This is correct — lime on every CTA would look like a vape brand.
- **Cards have one consistent radius (`0.5rem` base).** Borders are uniform
  `oklch(0.922 0 0)`. Shadow is reserved for hover only. No CSS drift.
- **The Full RAMs landing dark hero tile** (`src/app/(app)/tools/rams/page.tsx:74-107`)
  is the strongest visual moment in the app — black tile, lime hairline at
  the top, single brand sparkle. It's the only place on the platform that
  does something distinctive. I'd actually want **more of this energy**
  spread across the dashboard and home page.
- **AIButton is genuinely premium.** Lime gradient, lift-on-press, ring on
  hover, "Thinking…" loading state. (`src/components/ui/ai-button.tsx`)

### What needs work ⚠️

- **The home page is too plain to feel £2-premium.** The `<main>` is a
  centred hero + a flat list of five tool rows in one bordered box. That
  works for Linear because Linear has a video, four pull-quotes, and
  shipped marketing. ClickNComply has none of those. Right now the page
  reads "early indie SaaS" not "the consultant lives in your laptop."
  `src/app/page.tsx:36-82`. Suggestion: real hero treatment for RAMs (the
  one tool that actually exists), demote the four planned tools to a
  "Coming next" rail with an email capture.
- **Dashboard is functional but cold.** Two list sections, no welcome
  state, no shortcut to the actually-working RAMs flow, no usage metric
  ("3 RAMs created this week" etc). `src/app/(app)/dashboard/page.tsx:62-117`.
- **No skeletons anywhere.** Pages flash blank while server components
  resolve. The Toolbox Talk has the only proper "AI is writing…" loading
  state in the app (`toolbox-talk.tsx:224-228`).
- **`<Button size="default">` is `h-8`.** That's small for a primary CTA on
  a marketing page. Compare Buttondown (`h-10` minimum on home). The home
  page passes `size="lg"` which renders `h-9` — still cramped.
  `src/components/ui/button.tsx:24-28`.
- **PPE chip grid** in Full RAMs (`full.tsx:421-468`) is 4-column on `lg:`
  with all 15 PPE items showing simultaneously. Density is high; consider
  collapsing into "8 selected" + "Edit selection" when populated.
- **No favicon, no OG image, no `apple-touch-icon`.** The base `metadata`
  has a description but no `openGraph` or `twitter` blocks. When someone
  shares a clickncomply.co.uk link in WhatsApp, it'll be a blank rectangle.

### What's broken ❌

- **The five tool tiles on home all link to `/rams`, `/qa`, `/hr`,
  `/lift-plans`, `/suite`** — and none of those routes exist. Click any
  non-RAMs tool from the unauthed home page and you get a 404. The
  `landingPath` field in `src/tools/index.ts:75-150` is aspirational — no
  routes mounted at those paths in `src/app/`.
- **Empty states are inconsistent.** The Documents page has a real one
  (`documents/page.tsx:172-186`); the LibraryGallery has one
  (`library-gallery.tsx:175-188`); the Dashboard has none (just a section
  heading "Pick your first tool" sitting above the same list of tools that
  always renders). The COSHH builder when zero substances are picked
  doesn't have a unique empty state — it just shows the Project card with
  the gallery below.

---

## 2. Navigation Audit

### What's working ✅

- **Sticky app header** with org-bound link to `/dashboard`, user email
  visible (`sm:` and up), logout button. (`src/app/(app)/layout.tsx`)
  Logout is a `<form action={logoutAction}>` server-action — correct.
- **RAMs sidebar is well-designed.** 260px expanded / 68px collapsed,
  section headings dim out when collapsed and become dividers, lime stripe
  marks active route, tooltips on collapsed icons. Documents pinned at
  top, Dashboard back-link above that. (`_components/sidebar.tsx`)

### What needs work ⚠️

- **31-entry sidebar IS overwhelming, but only because of the "soon"
  badges.** Once a real user sees 6 working entries and 31 ghost entries,
  it'll feel half-built. Consider a `<details>` collapsed-by-default for
  the Library / Specialist / Permits / PPE & Welfare sections until at
  least one builder in each lights up. Today the user's eye has to filter
  out 5x more "soon" pips than active items.
- **No breadcrumb anywhere inside `/tools/rams/...`.** The sticky header
  bar inside Full RAMs (`full.tsx:271-292`) recreates a breadcrumb manually
  ("Pick different trade · {title}"), but no other builder does this. They
  rely on the sidebar for context, which fails on mobile widths where the
  sidebar isn't shown.
- **The sidebar `overflow-y-auto` with 31 items will be a forced scroll on
  shorter viewports.** No fix needed today, but worth noting as more tools
  go live.

### What's broken ❌

- **Sidebar has no mobile behaviour.** It's a 260px shrink-0 aside, so on
  mobile the content area gets squeezed off-screen. There's no hamburger,
  no sheet, no responsive collapse. (`layout.tsx:13-14`,
  `sidebar.tsx:32-40`). Anyone visiting on phone is unable to navigate
  inside `/tools/rams`.
- **Cross-tool nav doesn't exist.** From `/tools/rams/...` the only way to
  reach (eventual) `/tools/qa` is to click "Dashboard" → click QA. That's
  fine for now, but the "Tools" switcher belongs in the top header so we
  don't ship technical debt when the second tool lights up.
- **No `/account` or `/settings` route.** No way for a user to:
  - Update their company name (set at onboarding, never editable)
  - Upload a logo (used by every PDF — `org.logo_url` is read but never
    written; `pdf/route.ts:62`)
  - Change email/password
  - View billing
  - Delete their account
  This isn't "post-launch polish" — UK GDPR right-to-erasure means it's a
  legal blocker.
- **Footer.** Home page has a tiny `v0.1 · build in progress` footer.
  Authed area has none. No privacy link, no T&Cs link, no support contact —
  none of which exist as pages anyway.

---

## 3. Content / Copy Audit

### What's working ✅

- **Brand voice is consistent and yours.** "We don't bother you", "No card
  needed", "We don't send marketing", "Cancel any time, one click". This
  reads like a one-person indie SaaS that has opinions, which is the
  positioning.
- **Microcopy on form labels is plain English.** "Your name", "Work email",
  "What you do", "Team size", "Just me / 2-10 / 11-50 / 51-250 / 250+"
  (`onboarding/page.tsx:107-115`). No `Job title*` corporate dross.
- **AI footer disclaimer** ("AI-generated draft. Review before delivery.")
  is in the toolbox-talk system prompt and in the Full RAMs sign-off
  block. Good defence.
- **Trade card meta `{n}+{n}`** showing steps + hazards is clever density
  — packed into 6 chars without a label cluttering. (`full.tsx:254`)

### What needs work ⚠️

- **"Magic link sent to {email}"** on `check-email/page.tsx:29` — the
  signup flow uses `signInWithPassword`, not `signInWithOtp`. There is no
  magic link. Either the copy is wrong, or the auth flow is wrong.
  (`signup/actions.ts:25-49`, `check-email/page.tsx:18-42`).
- **Login page subhead "Email + password. We don't send you reminders."**
  — strong line, but pair it with what they DO get. Right now it reads
  slightly like a rant. Consider "Email + password. No SSO theatre, no
  reminders." or similar.
- **Generic error messages.** `loginAction` (`actions.ts:26-32`) has a
  good "Email or password is wrong" fallback, but anything else just dumps
  Supabase's error string into the URL. Most users won't read "AuthApiError:
  Email rate limit exceeded" and know what to do.
- **No tooltips / help text** on technical fields. EAV/ELV labels in the
  HAVs builder are bare numbers; if you're not in H&S, "100 pts" means
  nothing. Lime info-icon tooltip would solve this without bloating the
  layout. `havs.tsx:222-226`.
- **"AI-generated draft" disclaimer is on toolbox talks and the full
  RAMs, but missing from Method Statement, RA, COSHH and HAVs PDFs.**
  This is a partial defence. Make it a footer-stamped string in
  `applyWatermark()` so it's universal, not per-builder.

### What's broken ❌

- **Compliance-claim language is technically OK but inconsistent.**
  - `tools/index.ts:131-134` (Compliance Suite) lists frameworks:
    "ISO 9001, BS EN 1090, CHAS..." — could be read as "we make you
    compliant" rather than "templates aligned with". This is the exact
    issue STATUS.md warns about ("Never display ISO logo. Use 'templates
    aligned with ISO 9001:2015'").
  - Builder taglines say things like "BS 7121 compliant lift plans" and
    "PUWER 1998 compliant pre-use inspection." Strictly, **the document
    can be aligned with PUWER, the user is compliant**. Tighten the wording
    on `builders.ts:319, 422` to say "PUWER-aligned" and "BS 7121-aligned"
    for legal hygiene.
- **Two empty-state copy surfaces are blank.**
  - Dashboard when no orgs / no activations doesn't explain why the user
    is staring at five greyed tool rows.
  - Coming-soon screen email field has no validation feedback (it just
    flips to a static "Vote logged" state — the email is **not actually
    sent anywhere**, see Section 5).
- **Singular/plural slip on the dashboard:** `Tools` vs `Tool` not
  pluralised dynamically. `Pick your first tool` is fine when there are 0;
  `More tools` is fine when there are 1+; but no other count text fixes
  the singular/plural elsewhere — search for "{x} document(s)" patterns,
  several rely on inline ternaries which is fine, but be uniform.

---

## 4. Feature Parity vs SiteLynx

### What ClickNComply has that SL had

| Feature | SL had | CnC has | Notes |
|---|---|---|---|
| Risk assessment library | Yes | ✅ | 177 hazards, 18 categories, denser than SL |
| Method statement templates | Yes | ✅ | 78 trades, 8-step pre-written, AI tighten |
| COSHH builder | Yes | ✅ | 79 substances, AI-fill controls/PPE/emergency |
| HAVs calculator | Yes | ✅ | 80 tools, points/EAV/ELV, exposure bar |
| Toolbox talks | Yes | ✅ | 100 topics, AI-write |
| Full RAMs (one doc) | Yes (12-step wizard) | ✅ (single scroll) | Simpler, intentionally |
| Branded PDF | Yes | ✅ | Cover banner, lime stripe, watermark gate |
| Auto-save drafts | Yes | ✅ | 1.5s debounce, `?doc=` resume |
| Documents library | Yes | ✅ | Drafts/Complete grouped |

### What SL had that CnC doesn't (per Jamie's brief)

| Feature | SL had | CnC | Severity | Effort |
|---|---|---|---|---|
| **Projects + Clients** as persistent entities | Yes | ❌ | **Must-have for paid launch** | 6h (per CLAUDE_PICKUP.md) |
| **Send-to-client** (branded email + PDF) | Yes | ❌ | **Must-have** — biggest workflow win | 6h |
| **Multi-trade picker** (Full RAMs) | Yes | ❌ — Full RAMs single-trade only | High — most jobs are multi-trade | 3h |
| **Save-as-template** ("MINE" badge) | Yes | ❌ | Nice-to-have, switching cost moat | 4h |
| **Doc Manager** (filters, search, group by project) | Yes | ❌ — flat list, no filters | Becomes essential past 20 docs | 4h |
| **Reorder method-statement steps** (drag-drop) | Yes | ⚠️ — handle UI exists, no behaviour | Nice-to-have | 30m |
| **Sign-off capture** (recipient signs, IP/timestamp) | Yes | ❌ | Differentiator, ties to send-to-client | 4h |
| **Doc versioning** | Yes (`generated_documents.version`) | ⚠️ — column exists in `generated_documents` but `rams_documents` has no `version` column | Audit-trail gap | 2h |

### What CnC has intentionally cut (good calls)

- **No tabbed wizard.** Single-scroll page is genuinely better UX for
  reviewing a 10-section doc.
- **No 12-step navigation rail.** Anchor-jump pills are lighter and adapt
  to free-scroll behaviour.
- **No commercial / QS features in RAMs.** Per `feedback_no_competitor_names.md`
  and the SL/CnC split — correct.
- **No HR.** RAMs only. Right call for V1.

### Net assessment

CnC's RAMs Builder is at **~70% of SL RAMs feature parity**. Library
density is actually **higher** than SL (568 pickable items). What's missing
is the workflow scaffolding around the document — projects, clients,
sending it. That's the ~30% the user feels.

---

## 5. Backend / Data / Infrastructure Audit

### Schema (live state)

| Table | Purpose | Status | RLS |
|---|---|---|---|
| `profiles` | Per-auth.users record | ✅ | ✅ own-row |
| `organisations` | Customer entity | ✅ | ✅ member-read |
| `organisation_members` | join table | ✅ | ✅ member-read, owner-write |
| `subscriptions` | Stripe state mirror | ✅ schema, ❌ no Stripe sync | ✅ member-read |
| `framework_activations` | Tool/framework activation per org | ✅ | ✅ member-read/write |
| `questionnaire_responses` | Compliance Suite onboarding | ✅ | ✅ — but unused (no Suite UI) |
| `generated_documents` | Suite-AI generated docs | ✅ | ✅ — also unused yet |
| `audit_records` | Generic compliance records | ✅ | ✅ — also unused yet |
| `reminders` | Email/in-app reminders | ✅ schema, ❌ no scheduler | ✅ |
| `rams_documents` | Polymorphic doc storage for all 37 builders | ✅ | ✅ — well-scoped |

### What's missing for Jamie's stated next steps

- **5-day Pro trial logic.** ❌ Nothing implements this.
  - `subscriptions.trial_ends_at` column exists (`0001_init.sql:124`)
  - PDF watermark gate (`pdf/route.ts:59-61`) checks `tier === 'pro' &&
    status in ('active', 'trialing')` — so the gate is ready
  - But no code sets `tier='pro'`, `status='trialing'`, `trial_ends_at=now()
    + 5 days` on signup or first PDF. **Trial does not exist.**
  - No nightly cron expiring trials. Supabase has `pg_cron` extension
    enabled (`0001_init.sql:9`) but no scheduled jobs are written.
- **Projects + Clients tables.** ❌ Not in any migration. Needs at minimum:
  - `clients (id, organisation_id, name, contact_email, contact_phone, address)`
  - `projects (id, organisation_id, client_id, name, site_name, site_address, start_date, end_date)`
  - FK on `rams_documents.project_id` (nullable for back-compat)
- **Send-to-client.** ❌ Resend is in package.json but no API route uses
  it. No email templates, no recipient log, no signed-off-at column.
- **Save-as-template.** ❌ Would need `template_documents` table or a
  `is_template` boolean on `rams_documents` plus `template_owner_id`.

### API routes

| Route | Method | Purpose | Auth | Issues |
|---|---|---|---|---|
| `/api/rams` | GET | List docs | ✅ via resolveContext | — |
| `/api/rams` | POST | Create doc | ✅ | — |
| `/api/rams/[id]` | GET | Fetch | ✅ | — |
| `/api/rams/[id]` | PUT | Update | ✅ | — |
| `/api/rams/[id]` | DELETE | Soft-archive | ✅ | — |
| `/api/rams/[id]/pdf` | GET | Render PDF | ✅ | — |
| `/api/ai/[task]` | POST | AI dispatcher | ✅ | **No rate limit, no cost cap** |
| `/api/rams/vote-builder` | — | **Doesn't exist** | — | Referenced by ComingSoon component (`coming-soon.tsx:20`) and STATUS.md but not implemented. The vote button is a fake. |
| `/auth/callback` | GET | OAuth/magic-link exchange | — | Used by check-email flow, but signup uses password not OTP |

**RLS coverage:** every table with org-scoped data has policies. The pattern
of `is_org_member()` plus the admin-client-on-server-with-manual-org-check is
defensible (fast member checks, controlled access). But: the API routes
**all use `createAdminClient()` and bypass RLS**, gating manually via
`resolveContext()`. RLS is thus essentially defense-in-depth — RLS isn't
load-bearing for API security; the resolveContext check is. That's fine, but
a future contributor who skips resolveContext bypasses everything.

### AI cost / quota

❌ **No rate limiting on `/api/ai/[task]`.** Anyone with a session can hit
Haiku as many times as they want. With Haiku at ~$0.80/MTok input and ~$4/MTok
output, a malicious user could rack up real money in an afternoon.

❌ **No tier check.** Free tier and Pro tier hit AI identically. Per
`project_clicknnomply_pivot.md`, "free tier with watermark, viral mechanic"
implies free should still get AI — but should it be capped? E.g. 10 AI calls
/ user / day on free, unlimited on Pro. Today: unlimited for everyone.

❌ **No cost tracking.** Anthropic returns `usage` in the response and
the route forwards it to the client (`route.ts:78, 87`) but **doesn't log
it anywhere**. You will have no idea who's spending what until the Anthropic
bill arrives.

✅ **Prompt caching is correctly set up** with `cache_control: { type:
"ephemeral" }` on the system block (`route.ts:54-65`). Good.

✅ **Handle for rate-limit / auth / api errors** is in place. Good.

### PDF generation + watermark gate

- **Watermark logic** at `pdf/route.ts:59-61` and `lib/pdf/watermark.ts`.
  Free tier gets diagonal "Powered by ClickNComply" + footer text.
  Functions correctly — checked against subscriptions tier + status.
- **One quiet correctness risk:** the `update({ generated_at, is_watermarked })`
  on `pdf/route.ts:125-131` is best-effort but unawaited error. If it fails
  the user still gets the PDF (good), but the documents page will say
  "PDF generated" status is wrong (low impact).
- **`pdf-lib` runs server-side in Edge runtime?** No — `next.config.ts` not
  modified, route default is Node. Safe.
- **Branded `org.logo_url`** is read but never written. There's no logo
  upload UI. PDFs are text-only branded today.

### Auth

- **Email + password.** `signInWithPassword` and `signUp({ email, password })`.
  No magic link despite check-email page calling it that.
  (`signup/actions.ts:25-33`).
- **Email confirmation** — depends on Supabase project settings. If enabled,
  `data.session` is null → check-email page. If disabled, straight to
  onboarding. The codebase handles both branches but the user experience
  diverges based on a Supabase Dashboard toggle the code doesn't track.
- **No password reset flow.** No `/forgot-password`, no
  `resetPasswordForEmail` action. If a user forgets their password, their
  only path is to make a new account.
- **No MFA.** Per `project_security_plan.md`, MFA is in scope. Not started.
- **No rate limit on login attempts.** Supabase has built-in but it's loose
  by default.

### Migrations applied vs pending

- `0001_init.sql` — applied ✅
- `0002_widen_record_type.sql` — pending per CLAUDE_PICKUP.md
- `0003_rams_documents.sql` — applied ✅

The order means `audit_records.record_type` may still be enum-typed in prod.
Run 0002 next or remove it from the directory if no longer needed.

---

## 6. Bugs, Inconsistencies, Quick Wins

### Bugs (real)

- **`useBuilderDocument.downloadPdf` race condition.**
  `_components/use-builder-document.ts:150-160`. When `docId` is null and
  the user clicks Download:
  1. `manualSave()` runs and **calls `setDocId` inside `persist()`** but
     state updates are async.
  2. After `await manualSave()`, `id = docId` reads the **stale closure
     `docId`** which is still null.
  3. Toast: "Couldn't save before download." even though save succeeded.
  Reproducible: open any builder, fill it, click Download as the **first**
  click after typing (before autosave fires). Fix: have `persist()` return
  the new id, then thread it through.

- **Lint error `react-hooks/set-state-in-effect`** at
  `use-builder-document.ts:124`. `setDocId(id)` is called synchronously
  inside the mount effect, which Next 16's React 19 rules now flag. Easy
  fix: move it inside the `.then()` after the doc is fetched.

- **6× `prefer-const`** errors in `lib/pdf/templates/*.ts` — `let ctx =
  newPage(...)` should be `const ctx = newPage(...)` since `ctx` is mutated
  in place but never reassigned. Trivial fix; runs `eslint --fix`.

- **Two unused imports** — `Button` in `tools/[slug]/page.tsx`, `Activity`
  in `havs.tsx`. Trivial.

- **Missing `RaLibrary` "Use in builder" handler.** The button
  (`ra-library.tsx:179`) has no `onClick`. Clicking does nothing.
  STATUS.md acknowledges this.

- **ComingSoon vote-to-build is fake.** `coming-soon.tsx:17-24` simulates
  a 400ms delay and flips to "Vote logged" — there is no API call, no
  email sent, no database row. STATUS.md flags this in the "What's NOT
  wired yet" section. As-is, it's dishonest UX (you tell the user you'll
  email them; you can't).

- **Onboarding has a redirect bug for `if (orgErr || !org)`.**
  `actions.ts:64-68` — TS doesn't narrow `org` after this check because of
  the `orgErr ||` short-circuit; the `org!.id` access on line 71 works
  because `redirect()` throws, but the type-narrowing relies on internal
  knowledge. Defensive fix: add an explicit `return` after `redirect()`
  for static analysis.

- **`Object.assign(form, emptyForm())` mutates state.** `full.tsx:235` —
  React state should never be mutated. The next line `update(emptyForm())`
  fixes the visible behaviour, but the mutation could cause subtle bugs
  if React batches differently. Remove line 235.

- **`record_type` enum drop in 0002.** When 0002 runs, `drop type if
  exists record_type` will fail if any user has the enum still referenced
  by an active session/cached query plan. Safe to ignore for prod, but
  flag for the run-window.

### Inconsistencies

- **Two "icon" registries.** `src/lib/icons.ts` (registry of every Lucide
  icon CnC uses) coexists with raw `lucide-react` imports in builders.
  Sometimes `import { Plus } from "lucide-react"`, sometimes `import {
  Plus } from "@/lib/icons"`. The icons.ts comment says "every component
  imports from this file" but most don't. Either enforce or delete the
  registry.

- **Two "tools" concepts.** `src/tools/index.ts` exports five `Tool`s
  (RAMs, QA, lift-plans, HR, Suite). `src/lib/rams/builders.ts` exports
  37 `Builder`s (Method Statement, Risk Assessment, etc.) inside RAMs.
  Naming overlap is confusing — sometimes "tool" means a CnC product,
  sometimes "tool" means a RAMs sub-builder. Recommend renaming Builder →
  Document type or similar.

- **`framework_activations` table does double duty.** It stores both
  `tool slug` (e.g. "rams") and `framework slug` (e.g. "iso-9001") in the
  same column with no type tag. Works today, will rot.

- **Tool `landingPath: '/rams'` etc** — paths defined but no routes mount.
  Either delete the field, or scaffold stub landing pages for the four
  non-RAMs tools that say "We're building this — vote here." (At minimum,
  `/rams` should redirect authed users to `/tools/rams` and unauthed to
  `/signup`.)

### Quick wins (under 30 min each)

- Fix the 6 `prefer-const` lint errors (`eslint --fix`).
- Add `onClick` to the RA Library "Use in builder" button.
- Wire `/api/rams/vote-builder` POST that takes `{ slug, email }` and
  inserts into a tiny `builder_votes` table. Currently the user is being
  lied to.
- Add `redirect("/tools/rams")` at `/rams/page.tsx` so the home page
  tile doesn't 404.
- Remove unused `Button` and `Activity` imports.
- Add `force-dynamic` and `no-store` headers to the AI route so it isn't
  cached by anything upstream by accident.
- Add a single `<meta name="robots" content="noindex">` on auth/onboarding
  pages so they don't end up in Google.

### Things that will bite at launch

- **No `/account` page.** GDPR right-to-erasure has a 30-day clock from
  request. Build the page or build a `mailto:` workflow before paying
  customers exist.
- **No `/privacy`, `/terms`.** Stripe will reject a Live mode account
  without a privacy policy URL. ICO registration also requires it.
- **Cookie banner.** UK/EU PECR requires consent for non-essential cookies.
  Today the app has only auth cookies (essential — no banner needed) and
  no analytics. Stays compliant **as long as nothing analytical is added.**
  Worth a flag if Vercel Analytics or PostHog gets bolted on later.
- **No `robots.txt`, no `sitemap.xml`, no OG image.** No SEO surface area
  at all. The home page has 95 words of body copy.

---

## 7. Launch Readiness Checklist

What's blocking a **paid public launch right now**, prioritised:

1. **Stripe wired end-to-end** — checkout, webhook, subscription sync.
   `lib/stripe/client.ts` exists; nothing else. Without this, you can't
   take money. **Effort: 1-2 days.**

2. **Trial logic implemented** — set `trial_ends_at = now() + 5 days` on
   signup; daily cron expiring trials; gate the watermark on `trialing`
   status; show "X days left in trial" banner. **Effort: 4-6 hours.**

3. **Privacy policy + Terms of Service pages** plus link in footer. Stripe
   live-mode requirement and UK GDPR baseline. Use a generic SaaS
   template; doesn't need to be lawyer-perfect at £2/mo. **Effort: 2-3 hours.**

4. **`/account` page with delete + password reset + logo upload.**
   GDPR + minimum dignity. **Effort: 4-6 hours.**

5. **Real `/api/rams/vote-builder`** route OR remove the vote-capture UX.
   Lying to the user is reputational risk for a £2 product whose pitch is
   "we don't pester you". **Effort: 30 min.**

6. **AI rate limit** — at minimum a per-user-per-minute cap on
   `/api/ai/[task]`. Use Upstash Redis or just an in-memory `Map` keyed by
   `userId` with a sliding window. **Effort: 1-2 hours.**

7. **Marketing landing pages for the four non-RAMs tools** — or delete
   them from the home page. Today they're 404s. **Effort: either 4 hours
   (4 stub pages with email capture) or 5 minutes (remove them).**

8. **Fix the autosave/download race condition** — small bug, high impact
   (user thinks save failed when it didn't). **Effort: 30 min.**

9. **Mobile sidebar** — RAMs builder is currently unusable on a phone.
   Even a basic sheet/overlay would unblock. **Effort: 2-3 hours.**

10. **PDF "AI-generated draft" footer stamp** universal across every
    template (currently only on toolbox-talk + full-RAMs). Move to
    `applyWatermark()` so it's per-page on every output, watermarked or
    clean. Legal hygiene under PUWER/CDM scrutiny. **Effort: 30 min.**

---

## Top 10 Things to Fix Immediately

In the order I'd do them (priority + effort balanced):

1. ❌ **Replace fake vote-to-build with real `/api/rams/vote-builder` POST.**
   Lying to users — even nicely — is the worst kind of debt for an indie
   product. 30 min.

2. ❌ **Fix `useBuilderDocument` autosave/download race + the
   `react-hooks/set-state-in-effect` lint error.** One-line bug, real UX
   impact. 30 min.

3. ❌ **Add a real `/account` page (logo upload, password reset, delete
   account).** GDPR baseline + dignity. 4-6 hours.

4. ❌ **Wire Stripe checkout + webhook + 5-day trial logic.** Without this
   nothing else matters — you can't go paid. 1-2 days.

5. ❌ **Create `/privacy` and `/terms` pages, link in footer.** Stripe live
   mode requirement, UK ICO baseline. 2-3 hours.

6. ❌ **Decide on the four non-RAMs tools: stub landing pages with email
   capture, or remove from home.** Today 4/5 of the tile clicks 404. 5 min
   or 4 hours.

7. ❌ **Add per-user-per-minute rate limit on `/api/ai/[task]`.** Anthropic
   bill protection. 1-2 hours.

8. ❌ **Mobile-responsive RAMs sidebar (sheet/overlay pattern).** RAMs
   builder is the actual product, currently unusable on phone. 2-3 hours.

9. ⚠️ **Universal "AI-generated draft" footer stamp on every PDF.** Move
   into `applyWatermark()` so it's on watermarked AND clean PDFs. Legal
   hygiene. 30 min.

10. ⚠️ **Add `version` column to `rams_documents` + bump on each
    `complete` status.** ISO 9001 / CDM 2015 expect document control.
    1-2 hours.

---

## Closing notes

The library, the AI plumbing, the polymorphic doc storage and the picker-first
UX are the right bets — these are the slow-to-build moats that are already
in place. The next 5-10 hours of work is the un-fun stuff (Stripe, trials,
account, privacy) that turns a product into a business. The product is
real; the business isn't yet.

I would not ship "paid public launch" tomorrow. I would ship "free public
beta" tomorrow with a "Pro tier coming next week" badge — and use the week
to get items 1-7 above done.
