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
| `http://localhost:5173/registration-flow/#/tutorials` | Tutorials (knowledge base, signed-in portal customers only — otherwise redirects to `#/attention`; `#/tutorials/<slug>` opens one tutorial; `…/tutorials[/<slug>]` without `#` redirects here) |

A plain path like `/registration-flow/registration` (no `#`) matches no route and renders LeadForm as the catch-all `/`.

## Distinct flows

**LeadForm** (`src/pages/LeadForm.jsx`) — new applicant self-registration. Collects contact info, account type, business details, fuel program, and referral. Submits to `POST /api/leads/save`. Uses a client-generated 6-digit OTP code (`generateOtpCode()`) that the backend uses to send a verification email.

**OtpVerification** (`src/pages/OtpVerification.jsx`) — post-approval multi-step registration for approved leads. Entry point is the OTP code from that email. Step order: OTP entry → company address → mailing address → personal info → personal address → billing contact → **bank/Plaid** → final review (summary) → contract signing → fuel cards → confirmation. **Plaid was deliberately moved to the end** (just before the summary/signing) so customers complete the simpler inputs first and don't drop out at the bank step right after OTP — the `src/obsolete/index.js` order (Plaid right after OTP) is no longer authoritative for step ordering. Persisted `completed_step` numbers: address=2–4, personalInfo=5, personalAddress=6, billingContact=7, plaid=8, finalReview=9, contractSigning=10, contractSigned=11, allDone=12 (mapped in `mapObsoleteStepToString`). The "after Plaid" cursor (9) is also stamped server-side in `lib/pijb_web/controllers/lead_controller.ex` (Plaid exchange + skip).

**PortalPage** (`src/pages/PortalPage.jsx`) — self-serve portal for **existing customers** (distinct from leads). Internal view state machine (like `RelinkPage`): OTP-to-email login (`requestCode` → `verifyCode`) → read-only `DASHBOARD` (masked summary + document downloads) → `CHANGE` (propose edits to whitelisted fields + note + S3-uploaded files) → `SUBMITTED`. Talks to `/api/portal/*` (see `src/api/portal.js`); the session token lives in `sessionStorage` under `itrucking-portal-token`. Nothing here mutates the customer record — submissions are change requests an operator reviews in the CRM. Backend contract: `docs/conventions/portal-api-contract.md`.

**Tutorials** (`src/pages/tutorials/`) — the customer knowledge base: the React app from the `react-migration` branch of `akharlamov-arch/tutorial.itrucking.pro` (TypeScript + CSS Modules), copied in nearly verbatim so it can be re-synced by copying its `src/` folders again. Vite aliases `@` to `src/pages/tutorials`, which is what its `@/…` imports expect (nothing else in the app uses `@`). Entry: `app/App.tsx`, mounted by `App.jsx` at `#/tutorials/*` behind `RequirePortalSession` (ticket `docs/tickets/TUTORIALS-AUTH-01.md`): only a customer signed in to the portal gets in — it reads the portal's token from `sessionStorage` (`ATTENTION_TOKEN_KEY` = `itrucking-attention-token`, exported from `src/api/portal.js` and used by `AttentionPage`) and checks it once with `validateSession` on entering `#/tutorials`; no token, a refused one or an unreachable backend drops the token and redirects (`replace`) to the portal sign-in `#/attention`, which after sign-in lands on the portal overview, not back on the tutorial; the list is `#/tutorials` (`?category=<id>` filters), a tutorial is `#/tutorials/<slug>` (modal over the list), and legacy `#/tutorials?article=<1–9>` links redirect to their slug. Adaptations to the original (keep them when re-syncing): `react-router` → `react-router-dom` v6 and React 19 context APIs (`use`, `<Ctx value>`) → React 18 (`useContext`, `<Ctx.Provider>`); `app/navigation.ts` `HOME_PATH` is `/tutorials`; no own `BrowserRouter`, `ThemeProvider` or `Header` — `App.tsx` renders the shared site `Header` (`lang`/`onLangChange`, `extra` = its `InstallButton`) and uses the shared `ThemeContext`; `i18n/LanguageProvider.tsx` derives the tutorials language from the app language (`ru`/`en`/`uk` as is, EN for `es`, RU before any language is chosen, without persisting it); a third language, `uk`, exists only here (ticket `docs/tickets/TUTORIALS-UK-01.md`): `LANGS` in `content/schema.ts`, `uk` strings in `i18n/messages.ts` and `content/categories.ts`, a `uk` field next to every `ru`/`en` text of every tutorial plus its `cover-uk.jpg`, and Ukrainian short words in `lib/typography.ts` — a missing `uk` text or cover falls back to `ru` (`typographLocalized`, `localize`), so content re-synced without `uk` still renders, but copying the original's `content/tutorials/` over these files would drop the translations, so merge instead; `pages/HomePage.tsx` adds a "Back to portal" button (`#/attention`); `config/site.ts` has no accounting e-mail in the footer's departments (removed with its `footerAccounting` string, TUTORIALS-AUTH-01 — keep it out when re-syncing); `CategoryFilter.module.css` lays the category buttons out in one row stretched to full width on desktop (wrapping only when they do not fit) with centred, larger, bold labels, and on mobile (≤768px) replaces them with a custom dropdown (thick 2px-accent trigger with a chevron; `CategoryFilter.tsx` renders both); `hooks/useTutorialsHead.ts` swaps in its favicons; `styles/tokens.css` and `styles/global.css` are scoped to `.tutorials-page` / `.tutorials-content` (token names clash with `src/index.css`; global.css rolls back Tailwind preflight inside the page). Not copied: its own Header, theme, tests, prerender/deploy scripts. Adding a tutorial = a folder `content/tutorials/<slug>/` with `index.ts` + images (see `content/tutorials/_template` and `content/schema.ts`); it is picked up automatically. Its UI strings are in `i18n/messages.ts`, not `translations.js` (only the tab title is `tutorials.title` there: RU | EN, and UK | EN for `uk`). The portal's tutorials block (`src/pages/attention/PortalTutorials.jsx`) reads tutorials by slug from `content/`. The clean URL `…/tutorials` is handled by `public/tutorials/index.html` (static servers) and a script in `index.html` (SPA-fallback servers, also `…/tutorials/<slug>`).

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

## Site chrome and theme

Every page gets `src/components/Header.jsx` (logo, 4-language dropdown, 🌙/☀️ theme toggle) — from `AppShell` in `App.jsx`, except the tutorials page, which renders it itself. `src/components/SiteFooter.jsx` is shown only on the signed-in customer portal (`#/attention`, which `#/portal` redirects to) — not on its sign-in screens. A page opts in with `useSiteFooter(show)` (exported from `SiteFooter.jsx`; `AppShell` renders the footer only while a page asks for it), and only `AttentionPage` does, in its `portal` view (ticket `docs/tickets/ATTENTION-LOGIN-NO-FOOTER-01.md`); the registration pages (`#/`, `#/registration`, `#/post-signing`, `#/relink`) deliberately have no footer, and the tutorials keep their own; both are Tailwind rebuilds of the tutorials page's header and footer (ticket `docs/tickets/SITE-CHROME-01.md`). Their strings are `header.*` / `footer.*` in `translations.js`. The footers' "Departments" column lists General Inquiries and Fuel Department only — the Accounting Team e-mail was removed from both (TUTORIALS-AUTH-01); its phone stays under "Contact".

`useTheme()` from `src/context/ThemeContext.jsx` exposes `{ theme, toggleTheme }`; the theme persists under `itrucking-theme` (shared with the tutorials page) and is set as `<html data-theme>` (also before first paint by a script in `index.html`). Dark mode works by palette, not by `dark:` variants: `tailwind.config.js` makes `gray`, `slate`, `red`, `green`, `amber`, `blue`, `emerald`, `primary`, `secondary`, `surface`, `ds-text` read `--c-*` channels from `src/index.css`, which `html[data-theme="dark"]` swaps for an inverted set. So existing classes follow the theme automatically. Things to know:
- `white` is not themed (it is also the label on blue buttons); `index.css` turns only `bg-white` surfaces dark. Use `bg-white` for cards, never a raw hex.
- A dark fill (any themed shade 500–950, incl. `hover:` fills) turns light in dark mode; `index.css` switches `text-white` on and inside it to dark text. A brand mark that must stay saturated uses `dark:bg-[#hex] dark:!text-white`. `border-white` becomes the surface colour.
- Other palettes (e.g. `indigo`, `purple`) are **not** themed — add them to `themed()` in `tailwind.config.js` and regenerate their `--c-*` values before using them.
- `darkMode` is `['selector', '[data-theme="dark"]']`, so `dark:` variants work for one-off tweaks.
- After editing `tailwind.config.js`, restart `npm run dev`: a running dev server can keep serving utilities built from the old config, which mixes old fixed colours with the new `index.css` overrides (light page, unreadable dark cards).

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
