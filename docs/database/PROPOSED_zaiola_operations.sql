-- ZAIOLA Delivery · OPERATIONS STAGING SCHEMA PROPOSAL ONLY
-- NOT APPLIED to any database. Review with migrations, staging and RLS audits.
-- No customer drafts are converted into deliveries by this schema.
-- No INSERT/UPDATE/DELETE is available to browser/authenticated roles.
-- Organizational provisioning and role assignment must be performed separately by trusted ops.

create table if not exists public.zaiola_organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 3 and 120),
  created_at timestamptz not null default now()
);
alter table public.zaiola_organizations enable row level security;
revoke all on public.zaiola_organizations from public, anon, authenticated;

create table if not exists public.zaiola_operator_memberships (
  user_id uuid not null references auth.users(id) on delete cascade,
  organization_id uuid not null references public.zaiola_organizations(id) on delete cascade,
  role text not null check(role in ('admin','dispatcher','viewer')),
  active boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (user_id,organization_id)
);
create index if not exists zaiola_membership_org_idx
  on public.zaiola_operator_memberships(organization_id,user_id);
alter table public.zaiola_operator_memberships enable row level security;
revoke all on public.zaiola_operator_memberships from public, anon, authenticated;
grant select on public.zaiola_operator_memberships to authenticated;
create policy "Operator reads own memberships"
on public.zaiola_operator_memberships for select to authenticated
using (user_id = (select auth.uid()));

create table if not exists public.zaiola_dispatch_shipments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.zaiola_organizations(id),
  reference text not null check (char_length(reference) between 6 and 48),
  pickup_area text not null check (char_length(btrim(pickup_area)) between 2 and 160),
  dropoff_area text not null check (char_length(btrim(dropoff_area)) between 2 and 160),
  vehicle_type text not null check (vehicle_type in ('motorcycle','car','van')),
  status text not null check (status in (
    'awaiting_dispatch','assigning','assigned','at_pickup',
    'picked_up','in_transit','at_dropoff','delivered','cancelled','failed'
  )),
  driver_id uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id,reference)
);
create index if not exists zaiola_dispatch_shipments_org_time_idx
  on public.zaiola_dispatch_shipments(organization_id,created_at desc);
create index if not exists zaiola_dispatch_shipments_org_status_idx
  on public.zaiola_dispatch_shipments(organization_id,status);
alter table public.zaiola_dispatch_shipments enable row level security;
revoke all on public.zaiola_dispatch_shipments from public, anon, authenticated;
grant select on public.zaiola_dispatch_shipments to authenticated;
create policy "Members read only own organization shipments"
on public.zaiola_dispatch_shipments for select to authenticated
using (
  exists(select 1 from public.zaiola_operator_memberships m
    where m.organization_id = zaiola_dispatch_shipments.organization_id
      and m.user_id = (select auth.uid()) and m.active = true
      and m.role in ('admin','dispatcher','viewer'))
);

create table if not exists public.zaiola_dispatch_drivers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.zaiola_organizations(id),
  display_name text not null check (char_length(btrim(display_name)) between 2 and 120),
  verification_state text not null check(verification_state in ('pending','approved','suspended')),
  availability_state text not null check(availability_state in ('offline','available','busy')),
  vehicle_type text not null check(vehicle_type in ('motorcycle','car','van')),
  updated_at timestamptz not null default now()
);
create index if not exists zaiola_dispatch_drivers_org_state_idx
  on public.zaiola_dispatch_drivers(organization_id,availability_state);
alter table public.zaiola_dispatch_drivers enable row level security;
revoke all on public.zaiola_dispatch_drivers from public, anon, authenticated;
grant select on public.zaiola_dispatch_drivers to authenticated;
create policy "Members read only own organization driver summaries"
on public.zaiola_dispatch_drivers for select to authenticated
using (
  exists(select 1 from public.zaiola_operator_memberships m
    where m.organization_id = zaiola_dispatch_drivers.organization_id
      and m.user_id = (select auth.uid()) and m.active = true
      and m.role in ('admin','dispatcher','viewer'))
);
-- No policy grants operator roles to users: membership provisioning is trusted.
-- No policy permits shipment/driver writes: real assignment needs an audited
-- server-side atomic transaction with idempotency and lifecycle verification.
-- Rows represent authenticated operational records, not direct client drafts.
