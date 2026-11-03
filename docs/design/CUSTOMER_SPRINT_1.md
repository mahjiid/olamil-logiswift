# LogiSwift 2.0 — Customer Web Sprint 1

## Reviewable routes

- `/v2` — isolated redesigned customer homepage.
- `/v2/book` — local-session delivery planning flow.

No existing routes have been replaced. The current application still lives at `/`, `/book`, and `/admin`.

## Scope completed

- New restrained visual style, isolated under the `.ls2` CSS scope.
- Customer nav, custom mark, editorial landing page and responsive abstract street illustration.
- Accessible input labels, two vehicle preferences, clear field errors, package and recipient details.
- Three-step booking experience: locations → package → review.
- Client-side validation and browser-session-only draft persistence.
- Explicit preview states in place of false tracking, delivery fees, or payment confirmations.
- Reduced-motion support, focus states, responsive layout down to narrow mobile widths.

## Security and product constraints

**Do not merge into production or advertise this as a live booking product yet.**

The new flow intentionally does **not** call `shipments.insert`, Paystack, or any dispatcher API.
It does **not** generate a tracking number, collect money, or dispatch a rider.
Drafts live in the browser session and are not durable server-side bookings.
This is a UX implementation, not a substitute for real pickup address geocoding or serviceability checks.
There are no fabricated delivery statistics, driver positions, or price estimates.

## Manual QA scenarios

1. Open `/v2` on desktop; verify nav, hero, booking widget, features and footer.
2. Enter too-short addresses or the same address in both fields; check useful error feedback.
3. Enter valid distinct addresses and select a vehicle; continue to `/v2/book`.
4. Confirm prefilled values survive the navigation and a browser refresh in the same session.
5. Step 1: reject identical or incomplete addresses.
6. Step 2: reject missing weight, invalid phone, and recipient name under 2 characters.
7. Step 3: verify every entered value is displayed without a fake quote.
8. Save draft: confirm the message states that nothing was submitted or charged.
9. Use Back/Edit to change information; confirm the saved state clears.
10. Clear draft and start again; ensure the form resets.
11. Repeat with keyboard navigation, screen reader and reduced-motion settings.
12. Inspect 360px, 390px, 768px, 1024px, 1440px layouts for clipping and contrast.

## Engineering quality gates

- TypeScript: `npx tsc --noEmit`
- Build: `npm run build`
- Browser smoke tests and WCAG 2.2 AA audit before promotion to production.
- Ensure we can test all build steps; existing Next config currently suppresses TypeScript and ESLint build failure and must be addressed separately.
- Review the existing Supabase RLS policies and the unsecured legacy Paystack webhook before enabling real booking.

## Next: Customer Backend Sprint

1. Specify and migrate canonical booking, quotes, parcel and recipient schemas.
2. Validate addresses/service zones and vehicle eligibility server-side.
3. Enforce access control at the database layer and API boundary.
4. Generate authoritative quotes from controlled rate tables.
5. Create idempotent server-side bookings and unique tracking IDs.
6. Integrate verified Paystack transactions and signed webhooks.
7. Implement authorized shipment tracking without fabricated fallbacks.
8. Add e2e scenarios for the booking/payment/dispatch lifecycle.

## Mobile strategy

The above web layout is responsive but is **not** a React Native app.
After the web primitives are validated, establish a dedicated Expo customer app and share semantic design tokens/typed domain models rather than duplicating browser-specific components.
A separate driver Expo app will require background-location permissions and lifecycle-specific testing.
