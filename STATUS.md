# Status — 28 Apr 2026

## Bottom line

Marathon session 27→28 Apr shipped a lot. Jamie is **not happy** with the
result. Multiple visual lift passes have landed but none feel like the
"yes, this is it" moment. The product reads as more thorough than yesterday
but doesn't feel right when clicking through.

If you're picking this up cold — read this top-to-bottom before changing
anything. The trap to avoid: pitching another visual pass without first
confronting why three previous passes haven't landed.

## What was actually built (3 commits)

- **`085718f`** — 33 RAMs builders wired live (was 7) + full SL-grade
  `react-pdf` system. 8 PDF templates: Method Statement, Risk Assessment,
  COSHH, HAVs, Toolbox Talk, Permit, Briefing, Inspection, Plan.
- **`b06e20b`** — Shared `<PageHeader>` component, lifted shadcn `Card`
  primitive, full marketing landing page rebuild at `/`.
- **`3e60415`** — Five-pillar dazzle pass: cool-navy shadow tokens
  (Stripe palette), `font-mono-num` utility, AIFillButton + universal
  `/api/ai/fill` route, NewDocChoiceModal, CommandPicker,
  GlobalCommandBar (Cmd+K), first-PDF celebration toast.

## What is genuinely visible right now

- 33 builders accessible via the sectioned sidebar (Build / Single
  Documents / Specialist Assessments / Permits / Briefings / Plant /
  PPE / Library)
- Dashboard greeting in chunky Barlow Condensed uppercase
  ("WORKING LATE, AMY")
- StatCards on dashboard with semantic gradient stripes + radial halos
- Generated PDFs match SL output (minus QR codes) — risk badges, stat
  callouts, side cards, sign-off cards
- Cmd+K palette works (chip in top-right of nav, press Cmd+K anywhere)
- AI sparkle button on **Permit / Briefing / Plan only** (3 of 33)
- Cool-navy shadows on every card (subtle vs black; obvious side-by-side)
- Mono timestamps on `/tools/rams/documents`
- Empty states lifted on Documents / Projects / Clients (only visible
  when those pages have zero data)

## What was framed as done but isn't actually visible

These exist in the codebase but no user-facing route adopts them yet:

- **`<CommandPicker>`** (`src/components/command-picker.tsx`) — built,
  centred fuzzy modal with Suggested / Recently used / Categorised
  layers + create-inline + multi-select + full keyboard nav. **Replaces
  no existing picker.** Risk Assessment / COSHH / HAVs still use the
  old `<LibraryGallery>` dropdown.
- **`<NewDocChoiceModal>`** (`src/components/new-doc-choice.tsx`) —
  built, four on-ramps (AI / Library / Scratch / Upload PDF). **Never
  opens anywhere.**
- **`<AIFillButton>`** (`src/components/ai-fill-button.tsx`) — wired to
  3 of 33 builders.
- **Shimmer skeleton** + **AI-pulse** utilities — defined in
  `globals.css`, no spinner replaced yet.
- **Sample-data seed** — never written.
- **Per-builder form personality** — every Permit / Briefing /
  Inspection / Plan builder still uses the same stacked-Card layout.
  Reads as generic SaaS form.

## Where the real gap lives (vs SiteLynx v2)

- SL has a left sidebar showing all modules at all times. CNC has top
  nav only — less premium feel, harder to scan.
- SL builders feel "alive" via cross-cascade prefill (pick a power tool →
  HAVs section auto-detects + drops in a "✦ Triggered by" callout). CNC
  builders are independent forms with no cross-talk.
- SL builder forms have personality per module. CNC's generic builders
  all share the same `<Card>` pattern with Title + Textarea inside.
- PDF output is approximately matched. Form interiors are not.

## What's pending on Jamie's side (not blocked on dev)

- Vercel deploy + production env vars
- Resend DNS verification at Fasthosts
- Watching for Stripe webhook in production

## Operational notes

- Working dir: `C:\Users\minec\OneDrive\Desktop\projects\clickncomply`
- SL reference dir:
  `C:\Users\minec\OneDrive\Desktop\projects\sitelynx\sitelynx-v2`
- SL dev server runs on `http://localhost:3001` (script-tag error
  fixed — uses static `data-theme="light"` on `<html>`)
- CNC dev server runs on `http://localhost:3000`
- Permissions: PowerShell + Agent + TodoWrite + ToolSearch added to
  bypass list at both project and global level
- Branch: `main`. Last commit `3e60415`. **Not deployed.**

## Hand-off if a fresh session picks this up

Don't ship another visual lift. Either:

1. **Wire the components that exist before adding more.** CommandPicker
   into RA / COSHH / HAVs. NewDocChoiceModal into BuilderShell first-load.
   AIFillButton onto every textarea across the 30 remaining builders.
   That's a few hours of adoption work that converts "built" into
   "actually visible." OR
2. **Step back and have a different conversation about what "feels
   right" actually means to Jamie.** Three visual passes haven't landed.
   The pattern suggests the gap is structural (form-interior personality,
   sidebar IA, cross-cascade prefill) rather than aesthetic (shadows,
   fonts, colours). Talk through it with him before touching code.
