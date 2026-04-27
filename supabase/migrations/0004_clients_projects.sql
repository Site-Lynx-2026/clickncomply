-- =============================================================
-- Migration 0004 — Clients + Projects + Builder Votes
-- =============================================================
--
-- WHAT
--   Three new tables:
--     - clients          — companies the org delivers work for
--     - projects         — discrete jobs, optionally tied to a client
--     - builder_votes    — vote-to-build email captures for stub RAMs builders
--
--   Plus: nullable `project_id` FK on `rams_documents` so any RAMs doc can
--   optionally be tied to a project.
--
-- WHY
--   - Today every RAMs doc is a one-off. Real customers have repeating jobs
--     for repeating clients. Projects + Clients turn ClickNComply from a
--     vending machine into a workspace. They unlock send-to-client, smarter
--     Documents page (group by project), per-project zip downloads.
--   - The ComingSoon vote-to-build screen has been telling users "we'll
--     email you" since launch, with no API and no DB row behind it.
--     `builder_votes` makes that promise real and gives us a real demand
--     signal for which of the 31 stubbed builders to ship next.
--
-- DEPENDENCIES
--   - Migration 0001 (organisations, profiles, organisation_members exist)
--   - Migration 0003 (rams_documents exists)
--   - 0002 may or may not have run — irrelevant to this migration
--
-- REVERSIBILITY
--   Forward-only. To roll back: drop the new tables and the FK column.
--
-- 27 Apr 2026
-- =============================================================

-- =============================================================
-- 1. CLIENTS
-- =============================================================

create table clients (
  id uuid primary key default uuid_generate_v4(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  name text not null,
  contact_name text,
  contact_email text,
  contact_phone text,
  address text,
  notes text,
  archived boolean not null default false,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_clients_org on clients(organisation_id);
create index idx_clients_org_active on clients(organisation_id) where archived = false;

-- =============================================================
-- 2. PROJECTS
-- =============================================================

create table projects (
  id uuid primary key default uuid_generate_v4(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  client_id uuid references clients(id) on delete set null,
  name text not null,
  code text,                          -- internal job number, e.g. "21639"
  site_address text,
  site_postcode text,
  start_date date,
  end_date date,
  status text not null default 'active'
    check (status in ('active', 'paused', 'completed', 'archived')),
  notes text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_projects_org on projects(organisation_id);
create index idx_projects_org_active on projects(organisation_id) where status = 'active';
create index idx_projects_client on projects(client_id) where client_id is not null;

-- =============================================================
-- 3. RAMS_DOCUMENTS — add nullable project_id
-- =============================================================

alter table rams_documents
  add column project_id uuid references projects(id) on delete set null;

create index idx_rams_documents_project on rams_documents(project_id) where project_id is not null;

-- =============================================================
-- 4. BUILDER VOTES — vote-to-build for stub builders
-- =============================================================

create table builder_votes (
  id uuid primary key default uuid_generate_v4(),
  builder_slug text not null,
  email text not null,
  organisation_id uuid references organisations(id) on delete set null,
  user_id uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  -- Same user voting for same builder twice = silent dedup
  unique(user_id, builder_slug)
);

create index idx_builder_votes_slug on builder_votes(builder_slug);
create index idx_builder_votes_org on builder_votes(organisation_id);

-- =============================================================
-- 5. TRIGGERS
-- =============================================================

create trigger trg_clients_updated_at before update on clients
  for each row execute function set_updated_at();

create trigger trg_projects_updated_at before update on projects
  for each row execute function set_updated_at();

-- =============================================================
-- 6. ROW LEVEL SECURITY
-- =============================================================

alter table clients enable row level security;
alter table projects enable row level security;
alter table builder_votes enable row level security;

-- CLIENTS — org members read/write
create policy "clients: read own org" on clients
  for select using (is_org_member(organisation_id, auth.uid()));
create policy "clients: write own org" on clients
  for all using (is_org_member(organisation_id, auth.uid()))
  with check (is_org_member(organisation_id, auth.uid()));

-- PROJECTS — org members read/write
create policy "projects: read own org" on projects
  for select using (is_org_member(organisation_id, auth.uid()));
create policy "projects: write own org" on projects
  for all using (is_org_member(organisation_id, auth.uid()))
  with check (is_org_member(organisation_id, auth.uid()));

-- BUILDER VOTES — user can insert own; admins read all (none yet — service role only)
create policy "builder_votes: insert own" on builder_votes
  for insert with check (
    user_id = auth.uid()
    and (organisation_id is null or is_org_member(organisation_id, auth.uid()))
  );
create policy "builder_votes: read own" on builder_votes
  for select using (user_id = auth.uid());

-- =============================================================
-- DONE.
-- After running:
--   1. Update src/types/supabase.ts to include Tables for clients,
--      projects, builder_votes (already done in this commit)
--   2. Update supabase/MIGRATIONS_APPLIED.md to flip 0004 to ✅
-- =============================================================
