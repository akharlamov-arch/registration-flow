# iTrucking Registration Portal

Onboarding for new applicants and the self-serve portal for existing customers: one React app
(Vite, Tailwind, `HashRouter`) served on two hosts.

## Pages

On `registration.itrucking.pro`:

- `#/` — Lead registration (new applicants; `?invite=` for invite links)
- `#/setup` — Full registration for approved leads (`?code=` from the approval e-mail)
- `#/post-signing`, `#/relink` — after the contract signature; Plaid re-link

On `portal.itrucking.pro`:

- `#/` — the customer portal
- `#/tutorials` — the knowledge base

Older links (`/registration-flow/…`, `#/registration`, `#/attention`) still land on the right
page. `CLAUDE.md` § *URL structure* has the details.

## Features

- Multi-step forms with progress bar
- 4 languages: English, Russian, Ukrainian, Spanish
- Responsive (mobile + desktop), light and dark themes
- File upload support

## Local Development

```bash
npm install
npm run dev   # http://localhost:5173 (onboarding), http://portal.localhost:5173 (portal)
```

## Deployment

See `DEPLOY.md`. The GitHub Pages preview, a one-host build with the portal under `#/portal`:
https://akharlamov-arch.github.io/registration-flow/
