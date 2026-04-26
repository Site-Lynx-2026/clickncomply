-- =============================================================
-- Migration 0002 — Widen record_type from enum to text
-- =============================================================
--
-- WHAT
--   Convert the `record_type` column on `audit_records` from an enum
--   to plain text. Drop the `record_type` enum.
--
-- WHY
--   ClickNComply will keep adding new record types (asset, ppm_task,
--   reactive_job, inspection_cert, contractor, weld_record, etc.) as
--   tools and frameworks expand. Adding a value to a Postgres enum
--   requires a migration AND can't easily be reversed. Plain text
--   with a CHECK constraint is more flexible and aligns with the
--   "every move counts" build philosophy — we don't want enum
--   migrations slowing each tool launch.
--
--   This is also FM-extension-ready: when ClickNComply adds a
--   facilities-management module, asset / ppm_task / reactive_job
--   record types can be introduced in product code without DB churn.
--
-- DEPENDENCIES
--   - Migration 0001 must have run.
--   - No application code depends on the enum type beyond inserts /
--     selects with text values, so this is non-breaking.
--
-- REVERSIBILITY
--   Forward-only. Reverting requires a new migration that creates an
--   enum from current values and converts the column back. Don't.
--
-- 26 Apr 2026
-- =============================================================

-- 1. Drop the column's dependency on the enum type
alter table audit_records
  alter column record_type type text using record_type::text;

-- 2. Add a CHECK constraint so we still get some safety, but it's
--    additive — new values can be permitted by altering this check.
alter table audit_records
  add constraint audit_records_record_type_check
  check (record_type in (
    -- Compliance core
    'internal_audit',
    'ncr',
    'capa',
    'training',
    'management_review',
    'risk',
    'customer_feedback',
    'supplier_eval',
    'document_review',
    'incident',
    'objective',
    -- FM extensions (planned)
    'asset',
    'ppm_task',
    'reactive_job',
    'inspection_cert',
    'contractor',
    -- BS EN 1090 specifics
    'weld_record',
    'wpqr',
    'material_traceability',
    -- Tool-specific catch-all
    'tool_generation'
  ));

-- 3. Drop the now-unused enum type
drop type if exists record_type;

-- =============================================================
-- DONE.
-- After running, hand-written types in src/types/supabase.ts already
-- use a string literal union for record_type — no code change needed.
-- =============================================================
