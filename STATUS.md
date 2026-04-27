# Status — 27 Apr 2026

## Latest: Library expansion in full — every picker now dense

The library IS the product. After this push:

| Library | Before | After | Delta |
|---|---:|---:|---:|
| Trade templates | 38 | **78** | +40 |
| RA hazards | 119 | **177** | +58 |
| HAVs tools | 62 | **80** | +18 |
| Noise activities | 15 | **54** | +39 |
| COSHH substances | 50 | **79** | +29 |
| Toolbox topics | 81 | **100** | +19 |
| **Total pickable items** | **365** | **568** | **+203** |

### Trade expansion (38 → 78)
New categories: **Heritage** (lime pointing, stone restoration, slate, lead, sash windows), **Occupied** (office/retail fit-out, healthcare, schools), **Renewables** (solar PV, EV chargers, heat pumps, UFH), **Access** (system scaffold, tube & fitting, mast climbers, IRATA rope access, BMU), **Infrastructure** (rail/Network Rail, marine, airside).

Specialist additions: licensed asbestos removal, asbestos surveys (R&D), fire stopping, intumescent paint, curtain walling, structural glazing, shop fitting, soft strip, structural demolition, concrete cutting & drilling, kerbing, street furniture, sprinklers, data cabling, fire alarm commercial, gas install, access control & CCTV, soft landscaping, tree surgery.

### RA hazard categories added
Asbestos (6 entries), Health & Wellbeing (10 — mental health, stress, drugs/alcohol, fatigue, pregnancy, young workers, dermatitis, HAVS, vision strain, respiratory sensitisation), Occupied Premises (6), Weather & Seasonal (6). Plus expansions in WAH, Plant, Electrical, Fire, Confined, Excavation, Lifting, Demolition, Dust, COSHH, Traffic, Environment, Welding and Noise.

### COSHH substances added
Self-levelling compound, ready-mix concrete, OSB dust, wood preservatives, mild steel welding fume, rosin solder flux, intumescent paint, anti-graffiti coating, line marking paint, Bondit, Sika 1, polyurethane mastic, two-stroke petrol, kerosene, industrial degreaser, toilet/drain acid cleaner, cellulose insulation, sheep wool, mortar dust (silica), brick/block dust, Legionella, rodent contamination, blood/needle stick, photo-luminescent, asbestos encapsulant, tannin block, patio cleaner, screed additive.

### Noise expansion (15 → 54)
Drilling/cutting (8), plant/heavy (8), demolition/breaking (5), specialist trades (6), outdoor/landscaping (5), regional construction (7).

### HAVs additions
Cordless tools (4 entries), tile/stone work (2), roofing (2), MEP specialist (3), demolition/cutting (2), specialist heritage (2), plus three whole-body vibration entries for plant operators (dumper, excavator, roller).

### Toolbox topic additions
More WAH (4 — MEWP rescue, suspension trauma, edge protection, ladder tying), plant (4 — quick-hitch, hot engines, guards, LOTO), health (3 — suicide signs, men's health, back care), site hazards (3 — asbestos recognition, public interface, water hazard), behavioural (2 — decision fatigue, just culture), incidents (3 — quick-hitch failures, confined fatalities, suspension trauma).

## Earlier same day: Full RAMs is live — picker-first, single scroll page, 10 sections

**The headline tool now works end-to-end.** Pick a trade, all 10 sections populate. Scroll down, tweak what you want, hit download. One PDF, every requirement.

How it differs from SL's RAMs (and is intentionally simpler):

| SL approach | CnC Full RAMs approach |
|---|---|
| 12 tabbed steps with rail navigation | Single scrolling page with 10 collapsible sections |
| Heavy form per step | Each section short, library-driven |
| Sequential flow (Next/Back) | Free-scroll, jump anchors at top |
| Type to fill | Trade pick fills 90% — review and tweak |

**Trade pick fills:**
- Method statement (8 pre-written steps)
- PPE selection (chip toggle grid)
- Risk assessment (every relevant hazard from the trade's `raItems`)
- HAVs tools (with vibration magnitudes)
- Noise sources (with typical dB)
- Default emergency / welfare / environmental copy
- Plus title + scope auto-set

**Sections in the document (in scroll order):**
1. Project info (title, trade, scope, site, dates)
2. Method statement (numbered editable steps)
3. PPE (chip toggle grid, 15 items)
4. Risk assessment (collapsible — pulled from trade)
5. COSHH (add from 50-substance library inline)
6. HAVs (auto-calc EAV/ELV with status pill)
7. Noise (per-activity dB + hours)
8. Emergency procedures (first aid / fire / A&E / contacts)
9. Welfare & environment
10. Sign-off

**PDF output** is one comprehensive document — branded cover banner with trade name, then each section as a numbered chapter. HAVs and noise tables. Risk assessment cards with coloured I/R pills. COSHH cards with risk-level pills. Free-tier watermarked.

## Earlier same day: Every builder is now picker-first. The library IS the product.

**Design rule locked:** every builder opens with a card-grid gallery of pickable items. Typing is reserved for company name, project title, and the rare item not in the library. A 10-year-old should be able to assemble a full RAM by clicking through the libraries — no keyboard.

The gallery experience across all five builders:

| Builder | Opens with | Click does |
|---|---|---|
| Method Statement | 38 trade cards (8 categories) | Loads 8-step pre-written method statement, sets trade + scope |
| Risk Assessment | 38 trade cards OR 180+ hazards | Trade pick = full RA loaded with all relevant hazards. Hazard pick = added one-by-one. |
| COSHH | 50 substance cards (12 categories) | Pre-fills exposure routes, controls, PPE, emergency procedure |
| HAVs | 62 tool cards | Adds row with vibration magnitude pre-filled — operator just sets hours |
| Toolbox Talk | 81 topic cards (8 categories) | AI auto-generates the briefing, no extra click |

Library expansion this push:
- `src/lib/rams/coshh-substances.ts` — **new**, 50 substances across cement, wood, metal welding, paint, adhesive, fuel, solvent, cleaning, insulation, stone/silica, biological, specialist
- `src/lib/rams/toolbox-topics.ts` — **new**, 81 topics across WAH, plant, health, site hazards, behavioural, weather, specialist, incidents
- `library.ts` HAVS_LIBRARY: 20 → 62 entries (pneumatic, finishing, concrete, outdoor, specialist tool families)

Shared `<LibraryGallery>` component handles search + category filter + card grid for every builder. Adds the 6th builder = drop in another gallery.

## Earlier same day: Risk Assessment, COSHH, HAVs, Toolbox Talk all wired + Documents page

Five builders are now fully end-to-end. Each has:
- Form UI with auto-save (1.5s after last edit, "Saved at HH:MM" indicator)
- AI assist where it adds value (RA controls suggest, COSHH fill all fields, Toolbox Talk write, Method Statement fill)
- Branded PDF download (light-lime cover, watermarked on free tier, clean on paid)
- Loads from `?doc=<id>` so refreshing a tab resumes the draft

The shared `useBuilderDocument` hook handles save/load/PDF for every builder — adding a new builder is 1 component file + 1 PDF template now.

`/tools/rams/documents` lists everything you've saved across all five builders. Drafts and Complete grouped, click to edit or download PDF inline.

Sidebar gets a "Documents" entry just under "Dashboard" so it's always one click from the builder you're in.

## Earlier same session: RAMs Builder spine + Method Statement end-to-end

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

## Library targets — first wave hit

| Library | Initial scaffold | After picker-first | After expansion (now) | Stretch target |
|---|---:|---:|---:|---:|
| Trade templates | 38 | 38 | **78** | 100+ |
| RA hazards | 119 | 119 | **177** | 300+ |
| HAVs tools | 20 | 62 | **80** | 100+ |
| Noise activities | 15 | 15 | **54** | 80+ |
| COSHH substances | 0 | 50 | **79** | 120+ |
| Toolbox topics | 30 | 81 | **100** | 150+ |
| **Total** | **222** | **365** | **568** | **850+** |

These grow additively — every entry shows up in the picker on next page load with zero refactoring.

## What's NOT wired yet

- 31 stubbed builders show ComingSoon screen — vote-to-build email capture needs `/api/rams/vote-builder` route
- RA Library "Use in builder" button on `/tools/rams/ra-library` — works inside the RA builder gallery but not from the standalone library page
- Send-to-client / email-pack flow (SL has it, CnC doesn't yet)
- Stripe paywall on PDF download — tier check exists but no upgrade prompt yet
- Real drag-to-reorder on Method Statement steps (UI handle is there but not functional)

## Critical reminders (still apply)

From earlier session:
- **Never** display ISO logo. Use "templates aligned with ISO 9001:2015"
- One-click cancel + separate auto-renew tickbox before paid launch (ARL/DMCC)
- DPA + sub-processor list before paid launch
- Liability cap at greater of £100 / 12 months' fees
- "AI-generated draft" label everywhere (already in PDF footer + ComingSoon copy)
- EU OSS VAT — register from first EU B2C sale

## Files changed across this work

**First push (commit 1c0def1):** RAMs spine + Method Statement end-to-end.

**Second push (this one):** four more builders end-to-end + Documents page.

```
NEW (second push):
  src/app/(app)/tools/rams/_components/{use-builder-document.ts,save-status.tsx}
  src/app/(app)/tools/rams/documents/page.tsx
  src/lib/pdf/templates/{risk-assessment,toolbox-talk,coshh,havs}.ts

UPDATED (second push):
  src/app/(app)/tools/rams/_builders/{method-statement,risk-assessment,coshh,havs,toolbox-talk}.tsx
  src/app/(app)/tools/rams/_components/sidebar.tsx     (added Documents nav entry)
  src/app/api/rams/[id]/pdf/route.ts                    (4 more template branches in switch)
  STATUS.md                                              (this file)
```

## Next session

In order of impact:

1. **Port the SL 12-step bodies into Full RAMs** — the headline tool. Heavier (~6 hours) but mostly mechanical from `sitelynx-v2/src/components/rams/steps/*`. Step 1 (project info) and Step 2 (method statement) overlap with what's already built — can reuse the Method Statement form inline.
2. **Send-to-client flow** — branded email with PDF attached. SL already does this; copy the pattern. Needs Resend wired (key in .env.local already template). ~3 hours.
3. **`/api/rams/vote-builder`** — captures email + builder slug for the 31 ComingSoon routes. Demand signal before building. ~30 min.
4. **Stripe paywall** — when free user hits Download PDF, watermark works; for clean PDFs, show upgrade modal. Needs Stripe products created first.
5. **Real drag-to-reorder on Method Statement steps** — small polish. Use `@dnd-kit/sortable`. ~30 min.
6. **RA Library "Use in builder"** from the standalone library page (currently only works in the modal inside RA builder). ~30 min.
