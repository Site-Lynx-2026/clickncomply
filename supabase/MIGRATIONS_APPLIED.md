# Migrations applied — running log

Track of which migrations have been run on the live Supabase project (`hwqmyjjtccndaabylrga`).

| # | Migration | Description | Applied | Notes |
|---|---|---|---|---|
| 0001 | `0001_init.sql` | Initial schema: profiles, orgs, members, subs, framework activations, questionnaire responses, generated documents, audit records, reminders. RLS, triggers, storage buckets. | ✅ 2026-04-26 | First production migration. |
| 0002 | `0002_widen_record_type.sql` | Widen `record_type` from enum to text. Future-proofs for new record types (asset, ppm_task, etc) without enum migrations. | ⏳ pending | Run before V2 of any tool that adds new record types. |
| 0003 | `0003_rams_documents.sql` | RAMs documents table — backs all 37 builders via `builder_slug` + JSONB `form_data`. Includes `rams-pdfs` storage bucket and org-scoped RLS for table + storage. | ✅ 2026-04-27 | Backs Method Statement + every other RAMs builder going forward. |

## Conventions

- ✅ = applied
- ⏳ = pending / not yet run
- ❌ = applied but failed / rolled back

When you run a migration, update this file in the same commit.
