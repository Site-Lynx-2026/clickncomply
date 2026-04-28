-- =============================================================
-- Migration 0005 — document_sends audit log
-- =============================================================
--
-- WHAT
--   New table: document_sends — one row per email send of a doc.
--
-- WHY
--   - "Send to client" is the next-most-important workflow after the
--     download button. We need to remember WHO got WHAT, WHEN, and from
--     WHOM, so that the firm has a defensible audit trail ("I sent the
--     RAMs on the 14th") and the dashboard can surface "last sent to
--     this client" hints.
--   - Future use: Insurer / accreditation portals routinely ask for
--     proof of distribution. A clean audit table is the cheapest way
--     to answer that without scraping email logs.
--
-- DEPENDENCIES
--   - Migration 0001 (profiles, organisation_members, organisations)
--   - Migration 0003 (rams_documents)
--   - Migration 0004 (clients optional FK)
--
-- REVERSIBILITY
--   Forward-only. To roll back: drop document_sends.
-- =============================================================

create table document_sends (
  id uuid primary key default uuid_generate_v4(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  document_id uuid not null references rams_documents(id) on delete cascade,
  client_id uuid references clients(id) on delete set null,

  -- recipient
  recipient_email text not null,
  recipient_name text,

  -- envelope
  subject text not null,
  message text,                      -- the user's optional one-liner
  pdf_filename text not null,
  resend_message_id text,            -- Resend's id, for retrieval/diagnostics
  status text not null default 'sent'
    check (status in ('sent', 'failed', 'simulated')),
  error text,                        -- populated when status='failed'

  -- audit
  sent_by uuid references profiles(id) on delete set null,
  sent_at timestamptz not null default now()
);

create index idx_document_sends_org_doc on document_sends(organisation_id, document_id);
create index idx_document_sends_org_recent on document_sends(organisation_id, sent_at desc);
create index idx_document_sends_client on document_sends(client_id) where client_id is not null;

-- ─── RLS ──
-- Members of the organisation can see sends. Inserts/updates flow through
-- the API route (service role), so RLS is read-only for end users.
alter table document_sends enable row level security;

create policy "members can read their org's sends"
  on document_sends for select
  using (
    organisation_id in (
      select organisation_id from organisation_members where user_id = auth.uid()
    )
  );
