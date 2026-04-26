# Supabase — schema, migrations, and operations

This folder is the source of truth for the ClickNComply Group database schema.

## Project

- **Live Supabase project ID:** `hwqmyjjtccndaabylrga`
- **Region:** TBC (whatever was picked at project creation)
- **Auth:** Magic link only (email OTP). No password auth, no OAuth providers.
- **Storage buckets:** `documents` (private, per-org), `logos` (public, per-org write)

## Migration discipline

Every schema change is a **new numbered file** in `migrations/`:

- Format: `NNNN_<description>.sql` — sequential, never renumbered.
- Each migration must have a doc header explaining what it does, why, and any non-obvious dependencies.
- Migrations are **forward-only**: never edit a migration that has been run in production.
- If you need to change something, write a new migration that alters/drops/recreates.

### How to run a migration

There is no Supabase CLI in this repo (yet). For now:

1. Open the migration file in your editor.
2. Open Supabase Dashboard → SQL Editor → New query.
3. Paste the entire file contents.
4. Click **Run**.
5. Confirm with Jamie that it ran successfully.
6. Mark the migration as applied in `MIGRATIONS_APPLIED.md` (this file is in the repo, history of what's live).

### When we move to CI / staging

We'll switch to Supabase CLI:

```bash
npx supabase login
npx supabase link --project-ref hwqmyjjtccndaabylrga
npx supabase db push   # applies all unapplied migrations in order
npx supabase gen types typescript --linked > src/types/supabase.ts
```

For now, the manual paste-and-run flow is fine. The whole team is one person.

## Conventions

| Item | Convention |
|---|---|
| Naming | `snake_case` for tables and columns. Plural for tables (`organisations`, not `organisation`). |
| Primary keys | `id uuid primary key default uuid_generate_v4()` |
| Foreign keys | `<table_singular>_id uuid references <table>(id)` |
| Timestamps | Always `created_at` + `updated_at`, both `timestamptz default now()`. Use the shared `set_updated_at()` trigger. |
| Soft delete | Avoid. If needed, add `deleted_at timestamptz` and update RLS to filter. |
| Booleans | Default to `false`. Default to `true` only when omission means "yes" semantically. |
| jsonb | Use for flexible-shape data (`questionnaire_responses.responses`, `audit_records.data`). Define the shape in TypeScript. |
| Enums | Avoid where possible — use text with a CHECK constraint. Easier to add values later. (Migration 0002 widens `record_type` from enum to text for this reason.) |

## RLS

Every table has Row Level Security on. Default deny.

- Reads: scoped by `is_org_member(organisation_id, auth.uid())`
- Writes: same, plus role checks where mutation is owner-only
- Service role bypasses all RLS — only used in server-side code where the user is already authenticated and authorised
- Storage buckets have RLS too (see policies in 0001_init.sql section 14)

## Migrations applied (production)

See `MIGRATIONS_APPLIED.md` for the running log of what's live.

Current state:
- `0001_init.sql` ✅ applied 26 Apr 2026
- `0002_widen_record_type.sql` ⏳ pending

## Schema overview

```
auth.users                       (managed by Supabase)
  └── profiles                   (1:1 via trigger on signup)
        └── organisation_members (M:N)
              └── organisations
                    ├── subscriptions          (1:1)
                    ├── framework_activations  (1:N)
                    ├── questionnaire_responses (1:N per framework)
                    ├── generated_documents     (1:N)
                    ├── audit_records           (1:N)
                    └── reminders               (1:N)

storage.buckets
  ├── documents (private — per-org PDFs)
  └── logos     (public read, per-org write)
```

## Helper functions

- `is_org_member(org_id, user_id)` — boolean, used in RLS predicates
- `get_org_tier(org_id)` — returns `subscription_tier`, used to gate tier-locked features
- `set_updated_at()` — trigger function for timestamp maintenance
- `handle_new_user()` — trigger on auth.users insert, creates profile row

## Adding a new migration

1. Find the highest number in `migrations/` (e.g. `0003`).
2. Create `migrations/0004_<verb>_<noun>.sql` (e.g. `0004_add_team_invitations.sql`).
3. Write a doc header with **what / why / dependencies / reversibility**.
4. Test locally if you have a local Supabase setup, or test directly in the live SQL editor (we're early — risk is low).
5. Update `MIGRATIONS_APPLIED.md` once run.
6. Commit + push.
