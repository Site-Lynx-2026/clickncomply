-- ClickNComply migration 0003 — RAMs documents table
-- Backs every RAMs Builder tool: Full RAMs, Method Statement, Risk
-- Assessment, COSHH, HAVs, Noise, Toolbox Talk, plus the 30+ specialist
-- builders. One table, polymorphic via builder_slug + JSONB form_data.
--
-- Run in Supabase Dashboard → SQL Editor, then update
-- supabase/MIGRATIONS_APPLIED.md.

-- =============================================================
-- 1. TABLE
-- =============================================================

create table rams_documents (
  id uuid primary key default uuid_generate_v4(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  -- Slug from src/lib/rams/builders.ts — full, method-statement, etc.
  -- text not enum so adding new builders never requires a migration.
  builder_slug text not null,
  title text,
  status text not null default 'draft' check (status in ('draft', 'complete', 'archived')),
  -- Whole form lives in this JSONB blob — shape varies by builder_slug.
  -- See src/lib/rams/config.ts for the Full RAMS shape; lighter
  -- builders (method-statement, risk-assessment) use a subset.
  form_data jsonb not null default '{}'::jsonb,
  -- PDF output bookkeeping.
  pdf_storage_path text,
  is_watermarked boolean not null default true,
  generated_at timestamptz,
  -- Audit trail.
  created_by uuid references profiles(id) on delete set null,
  updated_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =============================================================
-- 2. INDEXES — query patterns expected
-- =============================================================

-- Org dashboard listing recent docs across all builders
create index idx_rams_org_updated on rams_documents(organisation_id, updated_at desc);

-- Builder-specific listing (e.g. "all my Method Statements")
create index idx_rams_org_builder on rams_documents(organisation_id, builder_slug, updated_at desc);

-- Status-aware lookups (drafts to resume, completed to share)
create index idx_rams_org_status on rams_documents(organisation_id, status) where status != 'archived';

-- =============================================================
-- 3. UPDATED_AT TRIGGER — reuses pattern from 0001_init.sql
-- =============================================================

create trigger rams_documents_set_updated_at
  before update on rams_documents
  for each row
  execute function set_updated_at();

-- =============================================================
-- 4. RLS — org-scoped read/write
-- Member of the org reads + writes; non-members blocked.
-- Service role bypasses RLS for admin operations.
-- =============================================================

alter table rams_documents enable row level security;

create policy "rams_documents: read own org"
  on rams_documents for select
  using (
    organisation_id in (
      select organisation_id from organisation_members where user_id = auth.uid()
    )
  );

create policy "rams_documents: insert own org"
  on rams_documents for insert
  with check (
    organisation_id in (
      select organisation_id from organisation_members where user_id = auth.uid()
    )
  );

create policy "rams_documents: update own org"
  on rams_documents for update
  using (
    organisation_id in (
      select organisation_id from organisation_members where user_id = auth.uid()
    )
  );

create policy "rams_documents: delete own org"
  on rams_documents for delete
  using (
    organisation_id in (
      select organisation_id from organisation_members where user_id = auth.uid()
    )
  );

-- =============================================================
-- 5. STORAGE BUCKET — for generated PDFs
-- Private bucket; signed URLs for download.
-- =============================================================

insert into storage.buckets (id, name, public)
  values ('rams-pdfs', 'rams-pdfs', false)
  on conflict (id) do nothing;

-- Storage RLS — read your own org's PDFs only.
create policy "rams-pdfs: read own org"
  on storage.objects for select
  using (
    bucket_id = 'rams-pdfs'
    and (storage.foldername(name))[1] in (
      select organisation_id::text from organisation_members where user_id = auth.uid()
    )
  );

create policy "rams-pdfs: insert own org"
  on storage.objects for insert
  with check (
    bucket_id = 'rams-pdfs'
    and (storage.foldername(name))[1] in (
      select organisation_id::text from organisation_members where user_id = auth.uid()
    )
  );

create policy "rams-pdfs: delete own org"
  on storage.objects for delete
  using (
    bucket_id = 'rams-pdfs'
    and (storage.foldername(name))[1] in (
      select organisation_id::text from organisation_members where user_id = auth.uid()
    )
  );
