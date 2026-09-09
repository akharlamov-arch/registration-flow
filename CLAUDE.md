# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start Vite dev server (localhost:5173)
npm run build     # production build
npm run preview   # serve the production build locally
```

No test runner is configured.

## URL structure

The app uses `HashRouter` (required for GitHub Pages). All routes are hash-based:

| URL | Page |
|-----|------|
| `http://localhost:5173/registration-flow/#/` | LeadForm |
| `http://localhost:5173/registration-flow/#/registration` | OtpVerification |
| `http://localhost:5173/registration-flow/#/portal` | PortalPage (existing-customer self-serve) |

A plain path like `/registration-flow/registration` (no `#`) matches no route and renders LeadForm as the catch-all `/`.

## Distinct flows

**LeadForm** (`src/pages/LeadForm.jsx`) — new applicant self-registration. Collects contact info, account type, business details, fuel program, and referral. Submits to `POST /api/leads/save`. Uses a client-generated 6-digit OTP code (`generateOtpCode()`) that the backend uses to send a verification email.

**OtpVerification** (`src/pages/OtpVerification.jsx`) — post-approval multi-step registration for approved leads. Entry point is the OTP code from that email. Step order: OTP entry → company address → mailing address → personal info → personal address → billing contact → **bank/Plaid** → final review (summary) → contract signing → fuel cards → confirmation. **Plaid was deliberately moved to the end** (just before the summary/signing) so customers complete the simpler inputs first and don't drop out at the bank step right after OTP — the `src/obsolete/index.js` order (Plaid right after OTP) is no longer authoritative for step ordering. Persisted `completed_step` numbers: address=2–4, personalInfo=5, personalAddress=6, billingContact=7, plaid=8, finalReview=9, contractSigning=10, contractSigned=11, allDone=12 (mapped in `mapObsoleteStepToString`). The "after Plaid" cursor (9) is also stamped server-side in `lib/pijb_web/controllers/lead_controller.ex` (Plaid exchange + skip).

**PortalPage** (`src/pages/PortalPage.jsx`) — self-serve portal for **existing customers** (distinct from leads). Internal view state machine (like `RelinkPage`): OTP-to-email login (`requestCode` → `verifyCode`) → read-only `DASHBOARD` (masked summary + document downloads) → `CHANGE` (propose edits to whitelisted fields + note + S3-uploaded files) → `SUBMITTED`. Talks to `/api/portal/*` (see `src/api/portal.js`); the session token lives in `sessionStorage` under `itrucking-portal-token`. Nothing here mutates the customer record — submissions are change requests an operator reviews in the CRM. Backend contract: `docs/conventions/portal-api-contract.md`.

The read-only summary primitives (`ReviewSection`, `ReviewRow`, `Row`, `US_STATES`, `formatAddress`) are shared via `src/components/ReviewCard.jsx` — used by both `OtpVerification` and `PortalPage`.

The obsolete Alpine.js implementations in `src/obsolete/` are the authoritative reference for business logic — `register.js` maps to LeadForm, `index.js` maps to OtpVerification, `post-signing.js` maps to the post-signing page.

## API layer

`src/api/leads.js` — all HTTP calls. Uses three internal helpers (`apiFetch`, `apiPost`, `apiGet`) so individual functions are one-liners. Three functions intentionally swallow errors and never reject: `requestNewCode` (anti-enumeration), `completeSigning` (idempotent fire-and-forget), `uploadFuelInvoice`. `updateLead` is also fire-and-forget but does reject — callers use `.catch()` and never `await` it in navigation paths.

`src/api/leadMappers.js` — pure transformation functions, no HTTP. Splits into three sections: response mappers (API snake_case → React camelCase), payload builders (React state → request body), and validation helpers. Import from here when converting API responses or building request bodies.

`src/api/portal.js` + `src/api/portalMappers.js` — the customer-portal API + transforms (same helper style). `portal.js` sends the session token as `Authorization: Bearer`; `requestCode` swallows errors (anti-enumeration). `portalMappers.js` holds the proposable-field whitelist (mirrors the backend's `ChangeRequest.proposable_fields/0`), `initialChangeForm`, and `buildChangeRequestPayload` (diffs the form vs. current so only changed fields are proposed).

**Environment variables** (`.env.local`):
- `VITE_API_BASE_URL` — backend API base (e.g. `http://localhost:4000`)
- `VITE_UPLOAD_LAMBDA_URL` — pre-auth Lambda for fuel invoice upload (no session token required)
- `VITE_PLAID_STEP5_ENABLED` — default `true`; set to `false` to bypass Plaid and use manual bank entry
- `VITE_PLAID_COMBINED_LINK_ENABLED` — default `false`; enables combined auth + identity verification flow

## i18n

`useI18n()` from `src/context/I18nContext.jsx` exposes `{ t, lang, setLang }`. Call `t('some.nested.key')` — the function walks dot-separated keys into `src/data/translations.js` and falls back to the key string if missing. Language preference persists in `localStorage` under `itrucking-lang`. Supported: `en`, `ru`, `uk`, `es`. Every user-facing string must go through `t()`.

## Phone number format

`PhoneInput` stores values as `"+1 (231) 231-2312"` — 11 raw digits including the country code. Validation must strip non-digits then remove the leading `1` before checking for 10 local digits:

```js
const d = value.replace(/\D/g, '')
const local = d.length === 11 ? d.slice(1) : d
// local.length === 10 → valid
```

## Design system

Tailwind tokens are defined in `tailwind.config.js` and documented in `design-system/itrucking-registration/MASTER.md`. Use design-system classes rather than arbitrary values:

- **Colors:** `primary` (#2563EB), `secondary` (#1D4ED8), `cta` (#F97316), `surface`, `ds-text`
- **Shadows:** `shadow-ds-sm/md/lg/xl`
- **Typography:** `text-ds-hero`, `text-ds-h1`, `text-ds-h2`
- **Transitions:** `duration-ds-fast` (150ms), `duration-ds-normal` (200ms), `duration-ds-slow` (300ms)
- **Spacing:** `2xl` = 48px (section margins), `3xl` = 64px (hero padding)

## Key invariants

- `bank.routingNumber` must be **omitted** (not sent as empty string) in `updateLead` payloads after a non-tokenized Plaid exchange — sending `""` would overwrite the server-stored value. `buildUpdateLeadPayload` in `leadMappers.js` handles this.
- `requiresManualBankInput` in `mapPlaidExchangeResult` is derived from `data.requires_manual_bank_input` returned by the backend's plaid_exchange endpoint. It is `true` for tokenized accounts that cannot provide routing/account numbers directly through Plaid — in that case the user is prompted to enter them manually in the bankInfo step after Plaid.
- OTP codes accept hex characters A–F in addition to digits (`/^[0-9A-F]{6}$/`) for backward compatibility with legacy alphanumeric codes, even though `generateOtpCode()` produces numeric-only codes.
- `uploadDocument` (voidCheck, driverLicenseScan) uses `FormData` and must **not** set `Content-Type` — the browser sets the multipart boundary. `uploadFuelInvoice` is different: it sends raw bytes to a Lambda with explicit `Content-Type` and `X-File-Name` headers.
