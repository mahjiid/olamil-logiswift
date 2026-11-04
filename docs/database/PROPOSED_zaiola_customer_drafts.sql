-- ZAIOLA Delivery · PROPOSED schema for authenticated customer drafts.
-- This file is NOT auto-applied or a migration. Review against the actual Supabase
-- project before generating an official migration with "supabase migration new".
-- Intentionally no payment, tracking, dispatch, or customer-controlled status fields.

create table if not exists public.zaiola_customer_drafts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    idempotency_key uuid not null,
    pickup text not null check (char_length(btrim(pickup)) between 8 and 250),
    dropoff text not null check (char_length(btrim(dropoff)) between 8 and 250),
    vehicle text not null check (vehicle in ('motorcycle','car')),
    parcel_type text not null check (parcel_type in ('documents','parcel','fragile','other')),
    weight_kg numeric(8,2) not null check (weight_kg > 0 and weight_kg <= 1000),
    recipient_name text not null check (char_length(btrim(recipient_name)) between 2 and 120),
    recipient_phone text not null check (recipient_phone ~ '^\\+234[0-9]{10}$'),
    notes text not null default '' check (char_length(notes) <= 600),
    created_at timestamptz not null default now(),
    constraint zaiola_customer_drafts_distinct_places
      check (lower(btrim(pickup)) <> lower(btrim(dropoff))),
    constraint zaiola_customer_drafts_unique_request unique (user_id,idempotency_key)
);
create index if not exists zaiola_customer_drafts_owner_time_idx
  on public.zaiola_customer_drafts(user_id,created_at desc);

alter table public.zaiola_customer_drafts enable row level security;

-- API permissions and RLS are separate controls.
revoke all on table public.zaiola_customer_drafts from public, anon, authenticated;
grant select, insert on table public.zaiola_customer_drafts to authenticated;

create policy "Customers may read only their own drafts"
  on public.zaiola_customer_drafts for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Customers may create only their own drafts"
  on public.zaiola_customer_drafts for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- No UPDATE or DELETE permission/policy. Edits require a new, validated draft.
-- No admin access via end-user sessions; production admin APIs need separate RBAC.
-- Do not enable service-role keys on web/mobile clients.
