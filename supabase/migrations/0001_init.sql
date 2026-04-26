-- ClickNComply V1 schema — initial migration
-- Run this in Supabase Dashboard → SQL Editor → New query → paste → Run.
-- 26 Apr 2026

-- =============================================================
-- 0. Extensions
-- =============================================================
create extension if not exists "uuid-ossp";
create extension if not exists "pg_cron";

-- =============================================================
-- 1. ENUMS
-- =============================================================

-- Subscription status mirrors Stripe's lifecycle
create type subscription_status as enum (
  'trialing',
  'active',
  'past_due',
  'canceled',
  'incomplete',
  'incomplete_expired',
  'unpaid',
  'paused'
);

create type subscription_tier as enum ('free', 'pro');

create type org_member_role as enum ('owner', 'admin', 'member');

create type record_type as enum (
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
  'objective'
);

create type record_status as enum (
  'open',
  'in_progress',
  'closed',
  'overdue'
);

-- =============================================================
-- 2. PROFILES — user-level
-- One row per auth.users row, created on signup via trigger.
-- =============================================================

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  onboarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_profiles_email on profiles(email);

-- =============================================================
-- 3. ORGANISATIONS — the customer entity
-- Every paid customer is an organisation. A user can belong to
-- multiple orgs; an org has 1+ members.
-- =============================================================

create table organisations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique,
  logo_url text,
  industry text,
  employee_band text,
  description text,
  country_code text default 'GB',
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_organisations_created_by on organisations(created_by);

-- =============================================================
-- 4. ORGANISATION MEMBERS — user x org join
-- =============================================================

create table organisation_members (
  id uuid primary key default uuid_generate_v4(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role org_member_role not null default 'member',
  joined_at timestamptz not null default now(),
  unique(organisation_id, user_id)
);

create index idx_org_members_user on organisation_members(user_id);
create index idx_org_members_org on organisation_members(organisation_id);

-- =============================================================
-- 5. SUBSCRIPTIONS — Stripe state mirror
-- One subscription per organisation. Free tier = no row OR row
-- with tier='free' depending on flow we pick.
-- =============================================================

create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  organisation_id uuid not null unique references organisations(id) on delete cascade,
  tier subscription_tier not null default 'free',
  status subscription_status not null default 'active',
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  stripe_price_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  trial_ends_at timestamptz,
  cancel_at_period_end boolean not null default false,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_subscriptions_stripe_customer on subscriptions(stripe_customer_id);
create index idx_subscriptions_stripe_sub on subscriptions(stripe_subscription_id);

-- =============================================================
-- 6. FRAMEWORK ACTIVATIONS
-- Free tier = 1 framework activated. Pro = unlimited.
-- =============================================================

create table framework_activations (
  id uuid primary key default uuid_generate_v4(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  framework_slug text not null,
  activated_at timestamptz not null default now(),
  unique(organisation_id, framework_slug)
);

create index idx_framework_activations_org on framework_activations(organisation_id);

-- =============================================================
-- 7. QUESTIONNAIRE RESPONSES
-- Per framework, the answers to the onboarding wizard.
-- Used as input to the AI document generator.
-- =============================================================

create table questionnaire_responses (
  id uuid primary key default uuid_generate_v4(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  framework_slug text not null,
  responses jsonb not null default '{}',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organisation_id, framework_slug)
);

create index idx_questionnaire_org on questionnaire_responses(organisation_id);

-- =============================================================
-- 8. GENERATED DOCUMENTS
-- AI-generated documents per framework + template.
-- Versioned for audit trail (ISO 9001 needs document control).
-- =============================================================

create table generated_documents (
  id uuid primary key default uuid_generate_v4(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  framework_slug text not null,
  template_slug text not null,
  title text not null,
  body text,
  version integer not null default 1,
  pdf_storage_path text,
  is_watermarked boolean not null default true,
  generated_at timestamptz not null default now(),
  generated_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create index idx_documents_org on generated_documents(organisation_id);
create index idx_documents_framework on generated_documents(organisation_id, framework_slug);

-- =============================================================
-- 9. AUDIT RECORDS — generic compliance records
-- Internal audits, NCRs, CAPAs, training, management reviews,
-- risks, customer feedback, supplier evaluations, etc.
-- jsonb 'data' field is record-type-specific.
-- =============================================================

create table audit_records (
  id uuid primary key default uuid_generate_v4(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  framework_slug text,
  record_type record_type not null,
  title text not null,
  description text,
  status record_status not null default 'open',
  data jsonb not null default '{}',
  due_date timestamptz,
  closed_at timestamptz,
  created_by uuid references profiles(id),
  assigned_to uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_records_org on audit_records(organisation_id);
create index idx_records_org_type on audit_records(organisation_id, record_type);
create index idx_records_due_date on audit_records(organisation_id, due_date) where status != 'closed';

-- =============================================================
-- 10. REMINDERS — compliance cycle scheduler
-- Email + in-app reminders for upcoming audits, reviews, etc.
-- =============================================================

create table reminders (
  id uuid primary key default uuid_generate_v4(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  framework_slug text,
  reminder_type text not null,
  title text not null,
  body text,
  scheduled_for timestamptz not null,
  sent_at timestamptz,
  dismissed_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_reminders_due on reminders(scheduled_for) where sent_at is null and dismissed_at is null;
create index idx_reminders_org on reminders(organisation_id);

-- =============================================================
-- 11. TRIGGERS
-- =============================================================

-- Auto-populate updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated_at before update on profiles
  for each row execute function set_updated_at();
create trigger trg_organisations_updated_at before update on organisations
  for each row execute function set_updated_at();
create trigger trg_subscriptions_updated_at before update on subscriptions
  for each row execute function set_updated_at();
create trigger trg_questionnaire_updated_at before update on questionnaire_responses
  for each row execute function set_updated_at();
create trigger trg_records_updated_at before update on audit_records
  for each row execute function set_updated_at();

-- Auto-create profile row on auth.users insert
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- =============================================================
-- 12. HELPER FUNCTIONS
-- =============================================================

-- Check if a user is a member of an org (for RLS)
create or replace function is_org_member(_org_id uuid, _user_id uuid)
returns boolean as $$
  select exists(
    select 1 from organisation_members
    where organisation_id = _org_id and user_id = _user_id
  );
$$ language sql stable security definer;

-- Get user's tier for a given org (used to gate features)
create or replace function get_org_tier(_org_id uuid)
returns subscription_tier as $$
  select coalesce(
    (select tier from subscriptions where organisation_id = _org_id),
    'free'::subscription_tier
  );
$$ language sql stable security definer;

-- =============================================================
-- 13. ROW LEVEL SECURITY
-- =============================================================

alter table profiles enable row level security;
alter table organisations enable row level security;
alter table organisation_members enable row level security;
alter table subscriptions enable row level security;
alter table framework_activations enable row level security;
alter table questionnaire_responses enable row level security;
alter table generated_documents enable row level security;
alter table audit_records enable row level security;
alter table reminders enable row level security;

-- Profiles — user reads/updates own row
create policy "profiles: read own" on profiles
  for select using (auth.uid() = id);
create policy "profiles: update own" on profiles
  for update using (auth.uid() = id);

-- Organisations — members read, owners update
create policy "organisations: read if member" on organisations
  for select using (is_org_member(id, auth.uid()));
create policy "organisations: insert as owner" on organisations
  for insert with check (created_by = auth.uid());
create policy "organisations: update if owner/admin" on organisations
  for update using (
    exists(
      select 1 from organisation_members
      where organisation_id = organisations.id
        and user_id = auth.uid()
        and role in ('owner', 'admin')
    )
  );

-- Organisation members — view own org's members; only owners change
create policy "org_members: read own org" on organisation_members
  for select using (is_org_member(organisation_id, auth.uid()));
create policy "org_members: owner manages" on organisation_members
  for all using (
    exists(
      select 1 from organisation_members
      where organisation_id = organisation_members.organisation_id
        and user_id = auth.uid()
        and role = 'owner'
    )
  );
-- Allow self-insert when creating an org (initial owner row)
create policy "org_members: self insert as owner" on organisation_members
  for insert with check (user_id = auth.uid() and role = 'owner');

-- Subscriptions — members read, only service role writes
create policy "subscriptions: read own org" on subscriptions
  for select using (is_org_member(organisation_id, auth.uid()));

-- Framework activations
create policy "framework_activations: read own org" on framework_activations
  for select using (is_org_member(organisation_id, auth.uid()));
create policy "framework_activations: write own org" on framework_activations
  for all using (is_org_member(organisation_id, auth.uid()))
  with check (is_org_member(organisation_id, auth.uid()));

-- Questionnaire responses
create policy "questionnaire: read own org" on questionnaire_responses
  for select using (is_org_member(organisation_id, auth.uid()));
create policy "questionnaire: write own org" on questionnaire_responses
  for all using (is_org_member(organisation_id, auth.uid()))
  with check (is_org_member(organisation_id, auth.uid()));

-- Generated documents
create policy "documents: read own org" on generated_documents
  for select using (is_org_member(organisation_id, auth.uid()));
create policy "documents: write own org" on generated_documents
  for all using (is_org_member(organisation_id, auth.uid()))
  with check (is_org_member(organisation_id, auth.uid()));

-- Audit records
create policy "records: read own org" on audit_records
  for select using (is_org_member(organisation_id, auth.uid()));
create policy "records: write own org" on audit_records
  for all using (is_org_member(organisation_id, auth.uid()))
  with check (is_org_member(organisation_id, auth.uid()));

-- Reminders
create policy "reminders: read own org" on reminders
  for select using (is_org_member(organisation_id, auth.uid()));
create policy "reminders: write own org" on reminders
  for all using (is_org_member(organisation_id, auth.uid()))
  with check (is_org_member(organisation_id, auth.uid()));

-- =============================================================
-- 14. STORAGE BUCKETS
-- For PDFs (generated documents) and customer logos.
-- =============================================================

insert into storage.buckets (id, name, public)
values
  ('documents', 'documents', false),
  ('logos', 'logos', true)
on conflict (id) do nothing;

-- Documents bucket: org members read/write their own org's files
create policy "docs: read own org" on storage.objects
  for select using (
    bucket_id = 'documents'
    and is_org_member((storage.foldername(name))[1]::uuid, auth.uid())
  );

create policy "docs: write own org" on storage.objects
  for insert with check (
    bucket_id = 'documents'
    and is_org_member((storage.foldername(name))[1]::uuid, auth.uid())
  );

create policy "docs: update own org" on storage.objects
  for update using (
    bucket_id = 'documents'
    and is_org_member((storage.foldername(name))[1]::uuid, auth.uid())
  );

create policy "docs: delete own org" on storage.objects
  for delete using (
    bucket_id = 'documents'
    and is_org_member((storage.foldername(name))[1]::uuid, auth.uid())
  );

-- Logos bucket: public read, org members write own org's logo
create policy "logos: public read" on storage.objects
  for select using (bucket_id = 'logos');

create policy "logos: org write" on storage.objects
  for insert with check (
    bucket_id = 'logos'
    and is_org_member((storage.foldername(name))[1]::uuid, auth.uid())
  );

create policy "logos: org update" on storage.objects
  for update using (
    bucket_id = 'logos'
    and is_org_member((storage.foldername(name))[1]::uuid, auth.uid())
  );

-- =============================================================
-- DONE.
-- After running this, generate types:
--   supabase gen types typescript --project-id hwqmyjjtccndaabylrga
-- And paste output into src/types/supabase.ts
-- =============================================================
