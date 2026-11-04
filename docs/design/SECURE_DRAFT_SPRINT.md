# ZAIOLA Delivery — Secure Customer Accounts & Drafts

**Status:** Implemented in a draft feature branch, NOT deployed. No real bookings or payments are permitted.

## Scope

- Customer native app: email/password sign-in and registration, session-only authentication, explicit "Save draft to my account" step, private draft history.
- API: `GET /api/v2/drafts` and `POST /api/v2/drafts` on the existing Next.js backend.
- SQL proposal: `docs/database/PROPOSED_zaiola_customer_drafts.sql`.
- Automated validation: `tests/v2-drafts.test.mjs`, native app booking tests, TypeScript and bundle builds.

## Critical limitations

The existing Supabase project named `olamilogi` was reported as **INACTIVE** by the connected account on November 4, 2026. No table, policy, migration or credentials were changed. The SQL file is a reviewable proposal only: the server responds with 503 unless a valid environment is provided, and mobile hides remote saving when its API origin is not configured.

A stored **draft is NOT an order**. No quote, payment, dispatch, tracking ID, GPS, or payout is generated. Existing legacy booking and payment routes are intentionally outside this sprint's production approval.

## Authentication and privacy

- Configure only `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `EXPO_PUBLIC_API_BASE_URL` in the native app. **Never commit a service role/secret key**.
- Native auth intentionally uses **memory-only sessions**; app restarts require sign-in. This avoids unaudited plaintext token persistence. Before production, implement and audit encrypted session persistence, refresh and logout behaviour.
- No draft content is persisted to device storage, only explicit server-side save when configured.
- `POST` validates access tokens via Supabase Auth `getUser(token)`. Uses the user's JWT for database access. Never uses service-role bypass.
- Owner-only RLS on `user_id = auth.uid()`, with no UPDATE/DELETE policies. Client cannot set payment or shipment state because the proposed draft schema contains no such fields.
- API rejects unexpected fields, invalid types, invalid route/weight/recipient information, and oversized bodies. Idempotency key protects against repeated uploads.
- Do not log tokens, passwords, recipient names or addresses.
- Server-side schema constraints and API validation are **both** required.

## How to activate after security review

1. Confirm the correct production/preview Supabase project, reactivate it if needed, and inventory existing tables, settings, backup state and exposure.
2. Confirm the `zaiola_customer_drafts` name and constraints do not conflict with real migrations and roles.
3. Create a **new official migration** using `supabase migration new zaiola_customer_drafts` (follow `supabase migration new --help` for your CLI version), copy the reviewed SQL proposal into the new migration, and deploy to a **staging** environment first.
4. Verify `anon` role has no table access, user A cannot see/insert data as user B, and authenticated owners can insert/select only their rows. Verify existing RLS is unaffected.
5. Run Supabase security advisors and resolve notices. Test idempotent replay and different-payload reuse.
6. Set the Next.js service environment: `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` (public project key; no secret needed for customer-scoped endpoints).
7. Set the native public settings in `apps/customer-mobile/.env` using `.env.example`. The `EXPO_PUBLIC_API_BASE_URL` must be the audited HTTPS host running the Next.js API.
8. Configure Supabase Auth email confirmation, redirect URL, approved SMTP and rate-limit/CAPTCHA settings.
9. Validate real device sign-in → save draft → list draft → sign out → sign in and verify again. Test network loss and expired token.
10. Add monitoring/retention policies, complete privacy and security review, and only then discuss releasing this feature.

## Current verification

- Root: `node --experimental-strip-types --test tests/v2-drafts.test.mjs`; `npx tsc --noEmit`; `npm run build`.
- Native: `cd apps/customer-mobile && npm install && npm test && npx tsc --noEmit && npx expo export --platform android`.
- `npm ci --legacy-peer-deps` remains temporary due to pre-existing `react-paystack@6` React 19 incompatibility. See issue #3.
- Browser/device sign-in and actual RLS integration tests cannot pass until a staging project has the schema applied and configured.

## Acceptance criteria for next iteration

- Staging database online; SQL applied using migration history.
- RLS security tests with two real test accounts.
- Verified sign-in, authenticated draft save, list, expiry and logout across native and web.
- A server-side quote service with address geocoding/serviceability, never user-supplied amounts.
- Production payment webhook signature and idempotency, separate from this draft API.
