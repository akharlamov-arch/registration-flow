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

The app uses `HashRouter`; all routes are hash-based. **One build serves two hosts** and picks its route table by the one it is on (`src/config/surfaces.js`, ticket `docs/tickets/PUBLIC-HOSTS-02.md`):

| Production | Dev (`npm run dev`) | Page |
|-----|-----|------|
| `https://registration.itrucking.pro/#/` | `http://localhost:5173/#/` | LeadForm (`?invite=`) |
| `…/#/setup` | `http://localhost:5173/#/setup` | OtpVerification (`?code=`, `?sessionToken=`) |
| `…/#/post-signing`, `…/#/relink` | same on `localhost:5173` | PostSigning, RelinkPage |
| `https://portal.itrucking.pro/#/` | `http://portal.localhost:5173/#/` | the customer portal (`AttentionPage`) |
| `https://portal.itrucking.pro/#/tutorials` | `http://portal.localhost:5173/#/tutorials` | Tutorials (signed-in portal customers only — otherwise redirects to the portal's sign-in; `#/tutorials/<slug>` opens one; `…/tutorials[/<slug>]` without `#` redirects here) |

- **The origins are build-time env** (`VITE_ONBOARDING_ORIGIN`, `VITE_PORTAL_ORIGIN`). `vite.config.js` refuses a build without them, or with anything but a bare origin. `.env.development` (committed) holds the dev pair, and `.env.production` the production pair; the static deploy playbook rewrites it. `base` is `/` unless `VITE_BASE` says otherwise.
- **A route of the other host leaves before React renders** (`crossHostTarget()` in `src/config/surfaces.js`, called from `main.jsx` and on every `hashchange`). On onboarding, `#/attention` goes to the portal's `#/`. On the portal, `#/registration?code=…` goes to onboarding's `#/setup?code=…`. The query always comes along.
- **Retired names on the same host** go through `src/components/RenameRoute.jsx`, which keeps the query (`<Navigate>` alone drops it): `#/registration` → `#/setup`; `#/attention`, `#/attantion`, `#/portal-demo`, `#/portal` → the portal's home.
- **One-host mode**: when both origins are equal, both route tables are mounted and the portal moves to `#/portal` (`PORTAL_HOME`), since `#/` is the lead form there. The GitHub Pages preview (`.github/workflows/deploy.yml`, `VITE_BASE=/registration-flow/`) runs this way, as does the `registration-flow (one host)` entry in `.claude/launch.json`.
- **Links inside the app are relative** (`#/setup`, `window.location.replace('#/…')`), never `/#/…`: a root-relative link leaves a sub-path deploy such as GitHub Pages.

An unknown hash route renders nothing.

## Distinct flows

**LeadForm** (`src/pages/LeadForm.jsx`) — new applicant self-registration. Collects contact info, account type, business details, fuel program, and referral. Submits to `POST /api/leads/save`. Uses a client-generated 6-digit OTP code (`generateOtpCode()`) that the backend uses to send a verification email.

**OtpVerification** (`src/pages/OtpVerification.jsx`) — post-approval multi-step registration for approved leads. Entry point is the OTP code from that email. Step order: OTP entry → company address → mailing address → personal info → personal address → billing contact → **bank/Plaid** → final review (summary) → contract signing → fuel cards → confirmation. **Plaid was deliberately moved to the end** (just before the summary/signing) so customers complete the simpler inputs first and don't drop out at the bank step right after OTP — the `src/obsolete/index.js` order (Plaid right after OTP) is no longer authoritative for step ordering. Persisted `completed_step` numbers: address=2–4, personalInfo=5, personalAddress=6, billingContact=7, plaid=8, finalReview=9, contractSigning=10, contractSigned=11, allDone=12 (mapped in `mapObsoleteStepToString`). The "after Plaid" cursor (9) is also stamped server-side in `lib/pijb_web/controllers/lead_controller.ex` (Plaid exchange + skip).

**The customer portal** (`src/pages/attention/AttentionPage.jsx`, at the portal host's `#/`) — self-serve for **existing customers** (distinct from leads). Talks to `/api/portal/*` (see `src/api/portal.js`); backend contract: `docs/conventions/portal-api-contract.md` in `pijb-phx`. The older `#/portal` page (`PortalPage.jsx`, with its gates and `portalMappers.js`) was removed in PUBLIC-HOSTS-02: no route had rendered it since PORTAL-UI-01. `AttentionPage` still reads a session token and an `entry` from router state, which those gates sent; nothing sends them any more.

**Tutorials** (`src/pages/tutorials/`) — the customer knowledge base: the React app from the `react-migration` branch of `akharlamov-arch/tutorial.itrucking.pro` (TypeScript + CSS Modules), copied in nearly verbatim so it can be re-synced by copying its `src/` folders again. Vite aliases `@` to `src/pages/tutorials`, which is what its `@/…` imports expect (nothing else in the app uses `@`). Entry: `app/App.tsx`, mounted by `App.jsx` at `#/tutorials/*` behind `RequirePortalSession` (ticket `docs/tickets/TUTORIALS-AUTH-01.md`): only a customer signed in to the portal gets in — it reads the portal's token from `sessionStorage` (`ATTENTION_TOKEN_KEY` = `itrucking-attention-token`, exported from `src/api/portal.js` and used by `AttentionPage`) and checks it once with `validateSession` on entering `#/tutorials`; no token, a refused one or an unreachable backend drops the token and redirects (`replace`) to the portal sign-in at `PORTAL_HOME` (`src/config/surfaces.js`), which after sign-in lands on the portal overview, not back on the tutorial; the list is `#/tutorials` (`?category=<id>` filters), a tutorial is `#/tutorials/<slug>` (modal over the list), and legacy `#/tutorials?article=<1–9>` links redirect to their slug. Adaptations to the original (keep them when re-syncing): `react-router` → `react-router-dom` v6 and React 19 context APIs (`use`, `<Ctx value>`) → React 18 (`useContext`, `<Ctx.Provider>`); `app/navigation.ts` `HOME_PATH` is `/tutorials`; no own `BrowserRouter`, `ThemeProvider` or `Header` — `App.tsx` renders the shared site `Header` (`lang`/`onLangChange`, `extra` = its `InstallButton`) and uses the shared `ThemeContext`; `i18n/LanguageProvider.tsx` derives the tutorials language from the app language (`ru`/`en`/`uk` as is, EN for `es`, RU before any language is chosen, without persisting it); a third language, `uk`, exists only here (ticket `docs/tickets/TUTORIALS-UK-01.md`): `LANGS` in `content/schema.ts`, `uk` strings in `i18n/messages.ts` and `content/categories.ts`, a `uk` field next to every `ru`/`en` text of every tutorial plus its `cover-uk.jpg`, and Ukrainian short words in `lib/typography.ts` — a missing `uk` text or cover falls back to `ru` (`typographLocalized`, `localize`), so content re-synced without `uk` still renders, but copying the original's `content/tutorials/` over these files would drop the translations, so merge instead; `pages/HomePage.tsx` adds a "Back to portal" button (to `PORTAL_HOME` from `src/config/surfaces.js`: `#/` on the portal host, `#/portal` in one-host mode); `config/site.ts` has no accounting e-mail in the footer's departments (removed with its `footerAccounting` string, TUTORIALS-AUTH-01 — keep it out when re-syncing); `CategoryFilter.module.css` lays the category buttons out in one row stretched to full width on desktop (wrapping only when they do not fit) with centred, larger, bold labels, and on mobile (≤768px) replaces them with a custom dropdown (thick 2px-accent trigger with a chevron; `CategoryFilter.tsx` renders both); `hooks/useTutorialsHead.ts` swaps in its favicons; `styles/tokens.css` and `styles/global.css` are scoped to `.tutorials-page` / `.tutorials-content` (token names clash with `src/index.css`; global.css rolls back Tailwind preflight inside the page). Not copied: its own Header, theme, tests, prerender/deploy scripts. Adding a tutorial = a folder `content/tutorials/<slug>/` with `index.ts` + images (see `content/tutorials/_template` and `content/schema.ts`); it is picked up automatically. Its UI strings are in `i18n/messages.ts`, not `translations.js` (only the tab title is `tutorials.title` there: RU | EN, and UK | EN for `uk`). The portal's tutorials block (`src/pages/attention/PortalTutorials.jsx`) reads tutorials by slug from `content/`. The clean URL `…/tutorials` is handled by `public/tutorials/index.html` (static servers) and a script in `index.html` (SPA-fallback servers, also `…/tutorials/<slug>`).

The read-only summary primitives (`ReviewSection`, `ReviewRow`, `Row`, `US_STATES`, `formatAddress`) are shared via `src/components/ReviewCard.jsx` — used by both `OtpVerification` and the portal (`src/pages/attention/inputs.jsx`).

The obsolete Alpine.js implementations in `src/obsolete/` are the authoritative reference for business logic — `register.js` maps to LeadForm, `index.js` maps to OtpVerification, `post-signing.js` maps to the post-signing page.

## API layer

`src/api/leads.js` — all HTTP calls. Uses three internal helpers (`apiFetch`, `apiPost`, `apiGet`) so individual functions are one-liners. Three functions intentionally swallow errors and never reject: `requestNewCode` (anti-enumeration), `completeSigning` (idempotent fire-and-forget), `uploadFuelInvoice`. `updateLead` is also fire-and-forget but does reject — callers use `.catch()` and never `await` it in navigation paths.

`src/api/leadMappers.js` — pure transformation functions, no HTTP. Splits into three sections: response mappers (API snake_case → React camelCase), payload builders (React state → request body), and validation helpers. Import from here when converting API responses or building request bodies.

`src/api/portal.js` — the customer-portal API (same helper style). It sends the session token as `Authorization: Bearer`; `requestCode` swallows errors (anti-enumeration).

**Environment variables** (`.env.local`):
- `VITE_API_BASE_URL` — backend API base (e.g. `http://localhost:4000`)
- `VITE_UPLOAD_LAMBDA_URL` — pre-auth Lambda for fuel invoice upload (no session token required)
- `VITE_PLAID_STEP5_ENABLED` — default `true`; set to `false` to bypass Plaid and use manual bank entry
- `VITE_PLAID_COMBINED_LINK_ENABLED` — default `false`; enables combined auth + identity verification flow
- `VITE_ONBOARDING_ORIGIN`, `VITE_PORTAL_ORIGIN` — required, the two hosts (see *URL structure*); dev values in `.env.development`
- `VITE_BASE` — optional build base path, default `/` (GitHub Pages: `/registration-flow/`)

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

Every page gets `src/components/Header.jsx` (logo, 4-language dropdown, 🌙/☀️ theme toggle) — from `AppShell` in `App.jsx`, except the tutorials page, which renders it itself. `src/components/SiteFooter.jsx` is shown only on the signed-in customer portal (the portal host's `#/`) — not on its sign-in screens. A page opts in with `useSiteFooter(show)` (exported from `SiteFooter.jsx`; `AppShell` renders the footer only while a page asks for it), and only `AttentionPage` does, in its `portal` view (ticket `docs/tickets/ATTENTION-LOGIN-NO-FOOTER-01.md`); the registration pages (`#/`, `#/setup`, `#/post-signing`, `#/relink`) deliberately have no footer, and the tutorials keep their own; both are Tailwind rebuilds of the tutorials page's header and footer (ticket `docs/tickets/SITE-CHROME-01.md`). Their strings are `header.*` / `footer.*` in `translations.js`. The footers' "Departments" column lists General Inquiries and Fuel Department only — the Accounting Team e-mail was removed from both (TUTORIALS-AUTH-01); its phone stays under "Contact".

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
