# ZAIOLA Delivery — Operations Command Center / Sprint 4

**Working branch:** `feature/zaiola-operations-command-center`
**UI route:** `/v2/ops`
**Read-only API:** `GET /api/v2/ops/overview`
**Status:** Implemented and build-verified; **NOT connected to an active delivery database or deployed**.

## Product experience

A brand-consistent desktop-first operations workspace with responsive mobile layouts:

- **Overview** — shipment and driver summaries calculated solely from the records returned by the API (up to 100 per collection). Summaries are labelled to avoid claims of global counts.
- **Orders** — searchable and status-filterable read-only shipment register.
- **Dispatch** — board grouping waiting, active and closed shipments; no drag-and-drop or server mutations.
- **Drivers** — verification and availability overview with no private KYC documents or banking data.
- **Analytics** — sample-based shipment status distribution, never fabricated revenue.
- **Finance and Support** — explicit not-connected states; no fake balances, payments or tickets.
- **Settings** — operator scope and integration readiness.
- **Unauthenticated/restricted screens** — sign-in and membership-denied or offline states, without exposing records.

The legacy `/admin` page previously used a client-side unscoped shipment query and update. In this branch it is replaced by a server redirect to `/v2/ops`. This does **not** deploy a fix to production by itself.

## Authorization architecture

1. Client submits email/password only to the configured Supabase Auth client using **public credentials**.
2. Browser sends the session bearer token to `/api/v2/ops/overview`; sessions are **memory-only** in this sprint.
3. The server uses `supabase.auth.getUser(token)` to validate the token; anonymous users are denied.
4. The server reads `zaiola_operator_memberships` and requires **one active organization membership** with an approved role. The user cannot assign their own role through the API. Users with multiple active memberships get 409 pending explicit organization selection.
5. Shipment and driver queries inherit the user's JWT, filter by the verified organization and must pass RLS rules.
6. The API returns **GET only**. No server-side shipment creation or update, driver assignment, payouts, or shipment status transitions.

**Never** grant public or self-service INSERT/UPDATE permissions for operator memberships. The proposed schema disallows direct writes by `authenticated` users. Provision roles through an audited trusted operations pathway only.

## SQL proposed, not applied

`docs/database/PROPOSED_zaiola_operations.sql` defines:

- `zaiola_organizations`
- `zaiola_operator_memberships`
- `zaiola_dispatch_shipments`
- `zaiola_dispatch_drivers`

All tables have RLS enabled. Membership reads are self-scoped. Shipment and driver reads require active matching organization membership. There are **no user-facing write policies**.

This is a schema proposal, **not an official migration**. It is intentionally separate from customer drafts and the insecure legacy `shipments` table. Do not activate it against production without a staging review, migration file, integration checks and backups.

## Required integration milestones

- Identify/reactivate or create a **dedicated staging** Supabase project. The existing `olamilogi` project was inactive when last checked.
- Review the proposed schema against existing tables, migrations and business ownership model.
- Create an official migration through `supabase migration new` after consulting the installed CLI help.
- Test RLS using two organizations and two operators; assert each cannot read the other's orders, drivers or memberships.
- Verify unapproved/disabled memberships yield 403. Test anonymous JWT and expired JWT 401. Test multiple active memberships 409.
- Connect a controlled shipment creation pipeline; customer drafts are **not** dispatch-ready orders.
- Add audited, **atomic** server-side assignment and lifecycle endpoints with idempotency, delivery proof, authorized driver access and concurrency tests.
- Implement real driver onboarding and compliant location permissions before enabling availability or GPS.
- Implement server-side payments/settlements and verified webhook signatures before populating finance.
- Run browser/device/accessibility and network-failure QA, manual regression tests, and Supabase security advisors.

## Build verification

CI workflow: `.github/workflows/zaiola-ops-ci.yml`

- Node 22 dependency installation (temporary `--legacy-peer-deps` because the legacy React 19 / react-paystack 6 incompatibility is still tracked in issue #3).
- `node --experimental-strip-types --test tests/ops-model.test.mjs` for status grouping, search and truthful metrics.
- `npx tsc --noEmit`
- `npm run build`

**Important:** Passing build and model tests is not evidence that RLS works against a real database. The live database was not modified, so operator sign-in, row isolation and end-to-end dispatch are still untested.

## Publishing rule

Do **not** merge to the public branch until the existing admin bypass and legacy webhook/payment issues have separate security verification. This stacked PR is a draft by design.
