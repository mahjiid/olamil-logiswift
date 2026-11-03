# ZAIOLA Delivery — Design system and experience principles

**Design decision:** Option C is the next milestone after the product brief.  
**Status:** Design foundations / concept screens; not a production release.  
**Customer-facing brand:** **ZAIOLA Delivery**; the parent identity is **ZAIOLA**. `olamil-logiswift` and LogiSwift 2.0 remain internal project/repository names during migration.  
**Core concept:** **Quiet Momentum** — editorial clarity for customers, field-first execution for drivers, operational density for dispatchers.

## 1. Product principles

1. **One obvious next action.** The page hierarchy should point to the next meaningful step, not decorative content.
2. **Real data or clearly labelled examples.** Never present mock drivers, pricing, GPS positions, order counts or service levels as live.
3. **Status is a contract.** Booking, payment, assignment, pickup, transit, and delivery are separate states.
4. **Accessible by default.** Target WCAG 2.2 AA; strong focus indicators, keyboard access, screen reader labels, reliable contrast and reduced motion.
5. **Purposeful restraint.** No arbitrary gradients, glassmorphism or stock dashboard ornamentation. Photography must be licensed and authentic.
6. **Shared foundations, distinct ergonomics.** Customer and admin are not the same screen shrunk or expanded. Driver controls account for outdoor visibility, unreliable connectivity and safe operation.
7. **Local and credible.** Nigerian addresses, naira formatting, service-zone availability, supported payment methods, and network failure states are first-class scenarios.

## 2. Brand and design grammar

**Working wordmark:** uppercase `ZAIOLA.` with a small `DELIVERY` descriptor and a compact custom Z mark. Use the wordmark consistently on customer, driver and operations surfaces. This remains a proposed mark pending vector refinement and trademark screening.

**Visual motif:** route junction, endpoint and delivery state. Never a generic 3D package illustration.

**Palette:** deep evergreen ink, neutral limestone, terracotta signal. The accent color supports primary actions; avoid using it for unrelated statuses.

| Token | Hex | Usage |
|---|---|---|
| `ink` | `#17201E` | Headlines, dense navigation, dark surfaces |
| `ink-secondary` | `#31403C` | Secondary headings and controls |
| `limestone` | `#F7F7F2` | Content canvas |
| `white` | `#FFFFFF` | Surface panels |
| `line` | `#E2E5DF` | Borders and separators |
| `muted` | `#73817B` | Secondary labels; not critical small text |
| `signal` | `#C34325` | Primary CTA and branded landmarks |
| `signal-soft` | `#FFF0EA` | Selected option background |
| `success` | `#17634C` | Verified success state |
| `success-soft` | `#E9F5EE` | Success surface |
| `warning` | `#8D6108` | Attention state |
| `warning-soft` | `#FFF4DD` | Attention surface |
| `danger` | `#B42318` | Errors and destructive actions |
| `info` | `#2167A3` | Informational statuses |

**Measured contrast:** signal `#C34325` with white is about 5.06:1 and with limestone about 4.71:1 (normal text AA). Validate all new pairs during implementation. Avoid low-contrast muted gray on small important labels.

**Typography:** DM Sans (400, 500, 600, 700, 800) with system fallback; IBM Plex Mono for reference numbers, timestamps and numeric metadata. Never use mono for long instructional text.

**Suggested hierarchy:**

- Marketing display: 72 / 1.04 / -0.055em desktop; 48 / 1.08 / -0.045em mobile.
- Page heading: 30 / 1.2 / -0.035em.
- Panel heading: 20 / 1.25 / -0.025em.
- Body: 16 / 1.55 normal; dense operations 13 / 1.45.
- Label: 12 / 1.35 / 600 or 700.
- Micro-label: 11 / 1.35 / 700; do not put low-contrast critical text at this size.

**Spacing scale:** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80 px; 8 px base. Dense operations may use 6 px / 10 px adjustments.

**Radius:** 8 px controls; 10–12 px panels; 16 px hero booking; 20+ px native bottom sheets, never on every card.

**Motion:** 120–200 ms transitions, never delaying the user's next step. Support `prefers-reduced-motion` and reduced mobile motion.

**Icons:** 1.75–2px outline stroke, cohesive proportions; visible text beside core operational actions.

## 3. Interaction patterns

### Customer web + mobile

- Landing hero prioritizes pickup/drop-off entry rather than a promotional banner.
- Quote clearly distinguishes **illustrative estimate** from live server-calculated price.
- Vehicle eligibility is calculated from package constraints and supported service zones, not a visual-only picker.
- After payment, move to actual dispatch status, not simulated progress.
- Order timeline is based on authoritative events, with timestamp and source.
- Critical failure states: no coverage, no driver available, payment pending, unsafe/restricted package, recipient unavailable, tracking temporarily unavailable.

### Driver native app

- Map takes visual priority during navigation; bottom action sheet shows current task.
- One dominant action at each stage: arrive, confirm collection, arrive at destination, verify handoff.
- Availability switch represents actual server status; preserve last known state offline and reconcile safely.
- Minimum 48 x 48 px touch targets for high-frequency actions; 56 px where feasible.
- Do not display full recipient details before the appropriate state or permit interaction-heavy operations while driving.
- Completion requires proper evidence (e.g. PIN or approved photograph) and must be idempotent.

### Operations desktop

- Left navigation: overview, deliveries, dispatch, drivers, customers, business, finance, support, analytics, settings.
- Dense tables must support filters, search, stable sorting, saved views and contextual row inspection.
- Map and order list should be linked by selection, not separate fake surfaces.
- Exceptions are action-oriented: reason, owner, elapsed time, next action and escalation route.
- Privileged actions require server-side RBAC, audit event and undo/recovery where appropriate.
- Operational numbers are never fabricated or treated as production telemetry while in demo mode.

## 4. Core screen specifications

| Experience | Priority screen | Hero action | Secondary context |
|---|---|---|---|
| Customer web | Home / book | Set route | Service coverage, business, track |
| Customer mobile | Home | Send a package | Active delivery, saved places |
| Customer | Checkout | Confirm and pay | Verified fare breakdown |
| Customer | Tracking | Follow live status | Driver and support access |
| Driver | Home | Go online / view task | Daily earnings |
| Driver | Incoming offer | Accept job | Route, time, expected earnings |
| Driver | Active task | Confirm next milestone | Navigation, support |
| Driver | Earnings | Review available balance | Payout and history |
| Admin | Overview | Resolve exception | Active deliveries, driver supply |
| Admin | Dispatch | Assign / reassign | Map, constraints, proximity |
| Admin | Order detail | Advance permitted state | Full audit timeline |
| Admin | Finance | Reconcile | Payment, refunds, settlement |

## 5. Responsive implementation

- Customer web: max content width 1280–1360 px, top navigation 72–80 px, desktop two-column hero with booking module roughly 390–420 px. On mobile, booking form becomes the first dominant content block.
- Driver: native-first screen width from 320 px upwards, safe-area handling, bottom sheet accommodates keyboard/IME and gesture controls.
- Admin: 220–240 px sidebar, collapsible into icon rail. At narrower desktop widths collapse multi-column layouts, never overflow key status labels invisibly.

## 6. Design-to-development rules

- Use tokens, not arbitrary inline colors. No raw hex values scattered through production components.
- Use typed state/status enums and a single format helper for currency, timestamps and delivery references.
- All financial actions stay server-authoritative, with verified callbacks and idempotency.
- Separate presentation components from shipment state and remote data access.
- Use accessible buttons and input elements with correct semantics; never rely on text-only faux controls.
- Map visualization must not claim real time without fresh authorized coordinates.
- Every screen gets real empty, loading, partial failure, error and success states before launch.
- Photograph and illustration assets require documented provenance and usage rights.

## 7. Design acceptance gates

1. **Visual review:** no visual inconsistencies across the three products; branded but not copied from Uber Eats or other benchmark products.
2. **Usability review:** new customers book without instruction; drivers identify next required action; dispatchers investigate delayed shipments without navigating multiple disconnected pages.
3. **Accessibility review:** keyboard, contrast, focus, screen reader, text resizing and reduced motion checks.
4. **Operational review:** lifecycle states, error handling, privacy boundaries and permission tests.
5. **Production review:** build, lint, tests, secure backend endpoints, validated payments and measured performance.

## 8. Prototype limitations

The **Design Lab** is an HTML interaction prototype. All names, maps, prices, counts and statuses are illustrative. It does not connect to Supabase, Paystack, GPS, live driver dispatch or production authentication. Its quote toggle and availability switch are visual examples only. It must not be used as a functional delivery platform.

**Next build milestone:** Convert this visual foundation into typed shared design tokens and reusable components. Then implement authenticated customer booking, driver active task, and operations dispatch as vertically integrated workflows behind an explicitly isolated preview environment.