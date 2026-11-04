# ZAIOLA Driver · Native Mobile Foundation

**Development preview, not a functioning delivery-partner app.**

The driver product is a **separate Expo / React Native application** under `apps/driver-mobile`, independent of customer web/mobile deployments.

## Included

- Professional, outdoor-friendly ZAIOLA visual identity, accessible native controls and safe areas.
- Driver navigation: **Home · Jobs · Earnings · Account**.
- **Offline-first default:** availability toggle is locked; no attempt to impersonate an approved driver.
- Job list, payout and profile states are honest about missing live service connections.
- Verification requirements: identity, vehicle eligibility, payout account and authorized location.
- Guided **simulation**, clearly marked as not live: offer → to pickup → arrival → pickup PIN → transit → arrival at destination → recipient PIN → completion, with a decline path.
- Pure validation with unit tests preventing skipped stages or invalid simulated proof.
- No real customer contact details, live GPS or synthetic financial balances.

## How to run

From the repository root:

```bash
cd apps/driver-mobile
npm install
npm run typecheck
npm test
npm run start
```

The developer should test using a compatible Expo SDK 58 runtime or a development build. An Android JavaScript export is **not an installable APK**.

## Architecture and security boundaries

This is a *design implementation* with an in-memory training session, not a dispatch integration.
- **No API keys, driver identity data or permissions** have been introduced.
- The training-only PINs are visibly labeled examples and are never sent to a backend. Do not reuse these values in production.
- **No location permissions** are requested yet; introduce foreground/background location only with transparent consent, minimal collection, appropriate OS UX and a documented retention policy.
- No job assignment or completion status is written to a server. Real delivery events require authenticated driver authorization and server-controlled state transitions.
- Driver onboarding requires third-party identity/document verification review and audit before activation.
- Never add real driver contact, bank data or photos into mock data/fixtures.
- Real payouts must be issued from server-owned ledger entries, not the mobile client.
- Safe operation must prevent distracting on-road interaction.

## Next implementation gates

1. Stand up staging booking/dispatch backend separate from the inactive existing `olamilogi` Supabase project.
2. Define driver-specific RLS, roles and authenticated approval workflow (never rely on user-editable profile metadata).
3. Build server-authoritative delivery offer accept/decline with atomically protected assignment, expiration and idempotency.
4. Verify pickup and drop-off proof server-side with unique order-scoped PINs; rate-limit retries and track audits.
5. Integrate authorized maps, navigation and location with carefully scoped permissions.
6. Real earnings queries, settlement reconciliation and customer privacy controls.
7. Device security, accessibility, reconnection and battery/performance QA on Android and iOS.
8. Produce native test build and review branding, UI and real-device usability before release.

## Local checks

```bash
npm test
npm run typecheck
npm run export:android
```

No store IDs, entitlement requests or driver KYC uploads are configured at this stage.
