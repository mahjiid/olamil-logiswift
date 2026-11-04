# ZAIOLA Delivery — Customer Native App

**Status: Development preview only.** This is a native React Native + Expo SDK 58 app, separate from the existing Next.js web app in the repository.

## What's implemented

- **Home:** branded editorial hero, delivery quick action, service information.
- **Activity:** honest empty state; no synthetic orders.
- **Payments:** unavailable state; no mock wallet balances or collection.
- **Account:** preview account with no fake authentication.
- **New delivery:** native, step-based route, vehicle, parcel and recipient forms.
- **Review:** validated summary with explicit `Finish preview` state.
- Shared semantic colors and custom wordmark across app screens.
- Safe-area handling, keyboard avoidance and accessibility labels.
- The typed booking validation lives in `src/lib/booking.ts`.

## Local development

**Prerequisites:** Node.js 22.13+, Expo Go or an Expo development build, and Android Studio or Xcode for local simulators.

```bash
cd apps/customer-mobile
npm install
npx expo install --check
npm run typecheck
npm run start
```

In Expo Go, select a compatible runtime for Expo SDK 58. If native dependencies differ, prefer `npx expo install --fix` and commit the resulting lockfile.

## Data handling and launch safety

- The app currently holds delivery draft data **only in React memory**, not in unencrypted AsyncStorage. Quitting the app clears it.
- No backend API calls, Paystack payment, location permission, QR scan, rider assignment, or server-side order creation.
- No live tracking, fake rider GPS, fake transaction totals or fabricated user identity.
- Do not present this preview as a functioning production delivery service.
- Do not create an APK for public distribution without a full security, usability, and backend integration review.
- Android package identifier, iOS bundle identifier, app icon, and store assets need legal/brand approval before publishing.

## Next engineering milestones

1. Add authenticated account/session with proper secret handling and access controls.
2. Integrate the same server-authoritative booking API as the web customer application.
3. Implement address geocoding, service zone eligibility, package weight and vehicle suitability checks.
4. Implement verified server-side quote, payment initialization, Paystack webhook verification, idempotent shipment creation.
5. Add real order history and event-based tracking with privacy controls.
6. Add automated RN component tests, device E2E, accessibility tests, Android and iOS QA.

## Branding

Public product name: **ZAIOLA Delivery**. Existing GitHub repository name (`olamil-logiswift`) is retained temporarily.

## Architecture decisions

- Expo Router is used for declarative routing and tab navigation.
- The delivery draft state is provider-based and is not persisted until backend and privacy constraints are defined.
- Copy, colors and components are independent of any web DOM implementation.
- Native packages are aligned to the Expo SDK 58 release compatibility matrix.
