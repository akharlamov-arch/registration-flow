# PUBLIC-HOSTS-02 — onboarding on `registration.itrucking.pro`, portal + tutorials on `portal.itrucking.pro`, no `/registration-flow/`

> Part of the **PUBLIC-HOSTS** stream. This is the frontend half:
>
> | Ticket | Where | What |
> |---|---|---|
> | PUBLIC-HOSTS-01 | `pijb-infra` `docs/tickets/PUBLIC-HOSTS-01.md` | nginx for both hosts, the portal's certificate, the two origins in the build env — done 2026-10-28 |
> | **PUBLIC-HOSTS-02** (this) | `registration-flow` | `base: '/'`, one route table per host, shorter routes, legacy aliases |
> | PUBLIC-HOSTS-03 | `pijb-phx` `docs/tickets/PUBLIC_HOSTS_LINKS_TICKET.md` | PR 1 (CORS for the portal origin) deployed 2026-10-28; PR 2 (the links the CRM hands out, Zoho embed host + return URLs) follows this |
> | PUBLIC-HOSTS-04 | `pijb-infra` `docs/tickets/PUBLIC-HOSTS-04.md` | the cutover: order, prod config, `/registration-flow/` 301, verification |

**Статус:** готово к ревью (branch `PUBLIC-HOSTS`, uncommitted)
**Дата:** 2026-10-28
**Depends on:** PUBLIC-HOSTS-01 (done: `/assets/` on both hosts, both origins in the build env) and PUBLIC-HOSTS-03 PR 1 (deployed: the API answers the portal origin). Goes live in the PUBLIC-HOSTS-04 window, immediately before PUBLIC-HOSTS-03 PR 2.

## Задача

Every public URL carried a path that said nothing: the build sat under
`base: '/registration-flow/'`, so the OTP step was
`https://registration.itrucking.pro/registration-flow/#/registration`
("registration" three times), and the customer portal was
`https://registration.itrucking.pro/registration-flow/#/attention`. Onboarding,
the portal and the tutorials shared one host.

Target (owner, 2026-10-27; hash routes stay):

| Host | Route | Page |
|---|---|---|
| `registration.itrucking.pro` | `#/` (`?invite=`) | `LeadForm` |
| | `#/setup` (`?code=`, `?sessionToken=`) | `OtpVerification` |
| | `#/post-signing`, `#/relink` | `PostSigning`, `RelinkPage` |
| `portal.itrucking.pro` | `#/` | `AttentionPage` (the portal) |
| | `#/tutorials`, `#/tutorials/<slug>` | `TutorialsApp` |

Every URL already handed out keeps working: OTP e-mails, relink and invite
links, Zoho return pages baked into in-flight requests, bookmarks.

## Решения

1. **`#/setup`** for the OTP step (the team's choice, 2026-10-28; `#/complete`
   was proposed).
2. **One build, served by both hosts.** The page picks its route tables from its
   origin: `'portal'` when it is `VITE_PORTAL_ORIGIN`, `'onboarding'` otherwise
   (an IP, `vite preview`). Rejected: a build per host, which doubles the deploy
   for a separation the lazy-loaded route chunks already give.
3. **Both origins are required at build time.** `vite.config.js` reads them with
   `loadEnv` and throws, naming the variable, when either is missing or is not
   a bare origin. Rejected: a silent default, which would quietly put the portal
   back on the onboarding host.
4. **One-host mode** (owner, 2026-10-28), for the GitHub Pages preview: when both
   origins are equal, both route tables are mounted on that one host, and the
   portal moves to `#/portal` (`PORTAL_HOME`) because `#/` is the lead form.
   The preview stays useful for design review. Rejected: retiring GitHub Pages.
5. **A route of the other host leaves before React renders.**
   `crossHostTarget()` (`src/config/surfaces.js`) maps it from the hash itself,
   and `main.jsx` calls it before `createRoot` and on every `hashchange`. So none
   of this host's header or language prompt flashes on the way out, and the
   route tables hold only their own host's routes. Rejected: redirect routes
   inside `<Routes>`, which render the shell first.
6. **Renames on the same host keep the query.** `<Navigate to="/setup">` drops
   `location.search`, and `?code=…` is exactly what an OTP e-mail's link
   carries. `src/components/RenameRoute.jsx` passes
   `{ pathname: to, search }` with `replace`, so Back skips the old name.
7. **Legacy routes:**

   | On | Route | Goes to |
   |---|---|---|
   | registration | `#/registration` | `#/setup` (same query) |
   | registration | `#/attention`, `#/attantion`, `#/portal-demo`, `#/portal` | portal `#/` |
   | registration | `#/tutorials`, `#/tutorials/<slug>` | portal, same route and query |
   | portal | `#/attention`, `#/attantion`, `#/portal-demo`, `#/portal` | `#/` |
   | portal | `#/setup`, `#/registration`, `#/post-signing`, `#/relink` | registration (`#/registration` → `#/setup`), same query |
   | one host | `#/attention`, `#/attantion`, `#/portal-demo` | `#/portal` |
   | one host | `#/registration` | `#/setup` |

   Server-side `/registration-flow/…` → `/…` is a 301 in PUBLIC-HOSTS-04. The
   browser keeps the `#…` fragment across it, so an old full URL lands on the
   new route through this table.
8. **Links inside the app are relative** (`#/setup`, `window.location.replace('#/…')`),
   never root-relative `/#/…`, which would leave a sub-path deploy such as
   GitHub Pages. Five places were root-relative.
9. **The old `/portal` page goes.** `src/pages/PortalPage.jsx` was lazy-imported
   but no route had rendered it since PORTAL-UI-01 (`#/portal` redirected to
   `#/attention`). With it go its two gates (`PortalBankVerificationGate`,
   `PortalContractUpdateGate`), `PortalNotice` (only the gates used it) and
   `src/api/portalMappers.js` (only `PortalPage` used it): 1,187 lines.
   `src/api/portal.js` stays, since `attention/` uses it.
10. **`AttentionPage` is not touched.** Its router-state handoff
    (`routedTokenRef`, `entry`, the bank-gate `lockedStep`) had the gates as its
    only sender, so it is inert now. Removing it reaches into five places of the
    file the frontend team is actively changing (next to the uncommitted
    `BankReminder.jsx` / `Step2Bank.jsx` work of 2026-10-27), so it is left for
    them (Вне рамок).
11. **`public/portal-signing-return.html` keeps `./#/attention`** as its "Back to
    your account" link. Through the aliases it is right everywhere: the portal's
    `#/`, `#/portal` on one host, and, from the registration host (where an
    in-flight, pre-cutover Zoho request returns), the portal host.
12. **Per-origin storage does not follow the customer.** `itrucking-lang` and
    `itrucking-theme` (localStorage) and the portal session (sessionStorage) are
    per origin. A portal customer sees the language prompt once on the new host,
    and anyone signed in at the cutover signs in again. Accepted. Rejected:
    carrying them in the URL, which would put a bearer token in it.

## Решение

### Config

| File | Change |
|---|---|
| `vite.config.js` | `defineConfig(({ mode }) => …)`: `loadEnv` + the origin check (Решение 3); `base: env.VITE_BASE \|\| '/'` |
| `.env.development` (new, committed) | `VITE_ONBOARDING_ORIGIN=http://localhost:5173`, `VITE_PORTAL_ORIGIN=http://portal.localhost:5173` |
| `.env.production` (tracked; the static playbook rewrites it on deploy) | the two production origins, so a local `npm run build` matches production |
| `.github/workflows/deploy.yml` | the Build step's env: `VITE_BASE=/registration-flow/`, both origins `https://akharlamov-arch.github.io` (one-host mode) |
| `.claude/launch.json` | a `registration-flow (one host)` entry: Vite on 5175 with both origins equal |

### Routing

| File | Change |
|---|---|
| `src/config/surfaces.js` (new) | `ONBOARDING_ORIGIN`, `PORTAL_ORIGIN`, `ONE_HOST`, `SURFACE`, `PORTAL_HOME`, `crossHostTarget(hash)`: the only place that knows the hosts |
| `src/main.jsx` | leave for the other host before rendering, and on `hashchange` |
| `src/components/RenameRoute.jsx` (new) | same-host rename that keeps the query |
| `src/App.jsx` | `onboardingRoutes` / `portalRoutes`, mounted by `SURFACE` (`'both'` mounts both); the retired names as `RenameRoute`s; `TitleUpdater` reads `titleKey(pathname)` (portal title for every non-tutorial page on the portal host) |

### Links inside the app

| File | Before | After |
|---|---|---|
| `src/pages/LeadForm.jsx:196` | `window.location.replace('/#/registration')` | `'#/setup'` |
| `src/pages/LeadForm.jsx:445` | `'/#/registration?sessionToken=' + …` | `'#/setup?sessionToken=' + …` |
| `src/pages/OtpVerification.jsx:710`, `:906` | `` `/#/post-signing?token=…` `` | `` `#/post-signing?token=…` `` |
| `src/pages/PostSigning.jsx:160` | `href="/#/registration"` | `href="#/setup"` |
| `src/pages/tutorials/pages/HomePage.tsx` ("Back to portal") | `navigate('/attention')` | `navigate(PORTAL_HOME)` (a new adaptation, recorded in `CLAUDE.md`) |
| `src/components/ReviewCard.jsx` | comment named `PortalPage.jsx` | names `src/pages/attention/` |

Unchanged on purpose: `PortalTutorials.jsx` (`#/tutorials`, same host),
`public/portal-signing-return.html` (Решение 11), `public/tutorials/index.html`
and the tutorials script in `index.html` (they derive the base from the path,
so at `/` they hand over to `/#/tutorials`).

### Removed

`src/pages/PortalPage.jsx`, `src/components/PortalBankVerificationGate.jsx`,
`src/components/PortalContractUpdateGate.jsx`, `src/components/PortalNotice.jsx`,
`src/api/portalMappers.js`. Comments elsewhere that still name them
(`attention/api.js`, `attention/inputs.jsx`, `attention/Attachment.jsx`,
`attention/MoovFallback.jsx`, `BankReminder.jsx`, `Step2Bank.jsx`) are history
in the team's files and were left.

### Docs

`CLAUDE.md`:
- *URL structure*: both hosts, dev origins, the cross-host redirect, renames,
  one-host mode, relative links.
- *Distinct flows*: the portal instead of `PortalPage`.
- The tutorials adaptation, the env vars, and *Site chrome*'s route names.

`DEPLOY.md`: rewritten as a pointer to `pijb-infra`. It described a
`/var/www/html/registration-flow` server that is not the one in use. `README.md`:
the pages and how to run it (it still described the pre-React site).

## Проверка

- **Builds:**
  - The production `npm run build` passes. Assets are at `/assets/`, both origins
    are in the bundle, and `portal-signing-return.html` and `tutorials/` are
    copied.
  - With `VITE_PORTAL_ORIGIN` empty, the build fails: "VITE_PORTAL_ORIGIN must be
    a bare origin … got """. With a trailing slash on the onboarding origin, it
    fails the same way.
  - The GitHub Pages build (its env) passes, with assets under
    `/registration-flow/assets/`.
- **Two hosts**, in the browser against `npm run dev` (`localhost:5173` /
  `portal.localhost:5173`). No console errors.

  | Open | Landed on |
  |---|---|
  | `localhost:5173/#/` | lead form |
  | `localhost:5173/#/registration?code=ABC123` | `#/setup`, the code in the form (the page strips it from the address bar itself) |
  | `localhost:5173/#/relink?token=t1`, `#/post-signing?token=t2` | stay, with their queries |
  | `localhost:5173/#/attention` | `portal.localhost:5173/#/`, "Customer Portal" |
  | `localhost:5173/#/tutorials/install-app?category=x` | `portal.localhost:5173/#/tutorials/install-app?category=x`, the tutorial open |
  | `localhost:5173/tutorials` (clean URL) | `portal.localhost:5173/#/tutorials` |
  | `portal.localhost:5173/#/` | the portal (behind the first-visit language prompt: storage is per host) |
  | `portal.localhost:5173/#/attantion?y=2` | `#/?y=2` |
  | `portal.localhost:5173/#/registration?code=ABC456` | `localhost:5173/#/setup`, the code in the form |
  | `portal.localhost:5173/#/relink?token=T9` | `localhost:5173/#/relink?token=T9` |
  | tutorials → «Назад в портал» | portal `#/` |
  | `portal.localhost:5173/portal-signing-return.html` (no frame) → its link | portal `#/` |
  | Back after `#/attention` → `#/` | the page before, not the old name |

  A non-hex code (`X1Y2Z3`) is left in the URL and not applied, as
  `isValidOtp` intends. That was my first test value, not a bug.
- **One host** (both origins `http://localhost:5175`): `#/` lead form; `#/portal`
  the portal; `#/attention?z=3` → `#/portal?z=3`; `#/registration?code=ABC789` →
  `#/setup` with the code; tutorials' back button → `#/portal`; `#/relink?token=t5`
  stays; nothing leaves the host.
- Not checked here: signing in to the portal and a full registration against an
  API (routing only), and Zoho's frame on the new host. Both belong to the
  PUBLIC-HOSTS-04 window, with PUBLIC-HOSTS-03 PR 2.

## Вне рамок

- `AttentionPage`'s inert router-state handoff (Решение 10), for the frontend team.
- Unknown hash routes still render an empty page, as before.
- `tutorial.itrucking.pro` (CloudFront, the original tutorials site) and
  `src/pages/tutorials/config/site.ts`'s `url`.
- Translations only `PortalPage` used (`portal.contractGate.*` and the like) are
  left in `translations.js`.
