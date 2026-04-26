# Migrations applied — running log

Track of which migrations have been run on the live Supabase project (`hwqmyjjtccndaabylrga`).

| # | Migration | Description | Applied | Notes |
|---|---|---|---|---|
| 0001 | `0001_init.sql` | Initial schema: profiles, orgs, members, subs, framework activations, questionnaire responses, generated documents, audit records, reminders. RLS, triggers, storage buckets. | ✅ 2026-04-26 | First production migration. |
| 0002 | `0002_widen_record_type.sql` | Widen `record_type` from enum to text. Future-proofs for new record types (asset, ppm_task, etc) without enum migrations. | ⏳ pending | Run before V2 of any tool that adds new record types. |

## Conventions

- ✅ = applied
- ⏳ = pending / not yet run
- ❌ = applied but failed / rolled back

When you run a migration, update this file in the same commit.
