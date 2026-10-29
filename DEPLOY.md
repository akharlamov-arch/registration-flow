# Deployment

Production is deployed from the **`pijb-infra`** repository, not from here:

- `ansible/playbooks/setup-ec2-static.yaml` builds this checkout (`npm ci && npm run build`)
  with the production `.env.production` it writes (`VITE_API_BASE_URL`,
  `VITE_ONBOARDING_ORIGIN`, `VITE_PORTAL_ORIGIN`, …) and uploads `dist/` as a new release to
  `/var/www/registration.itrucking.pro/releases/<timestamp>`, pointing `current` at it.
  Five releases are kept, so a rollback is re-pointing `current`.
- `ansible/playbooks/setup-ec2-proxy.yaml` holds the nginx side. One release is served on two
  names, and the app picks its routes by host (`src/config/surfaces.js`):
  - `registration.itrucking.pro`: onboarding, `static.conf`, on the `itrucking.us`
    certificate. `/application` and `/post-signing` are short links into the hash routes.
  - `portal.itrucking.pro`: the customer portal and the tutorials, `portal.conf`
    (`roles/portal-site`), with a certificate of its own.

  On both, `/assets/` (and the older `/registration-flow/assets/`) is cached for a year,
  and everything else gets `index.html`, never cached.

Point the playbook at this checkout with `-e static_site_source_dir=…`, the
`REGISTRATION_FLOW_DIR` environment variable, or by checking this repository out as a sibling
of `pijb-infra`. Plan and history: `pijb-infra/docs/tickets/PUBLIC-HOSTS-01.md` and this
repository's `docs/tickets/PUBLIC-HOSTS-02.md`.

The GitHub Pages preview is separate: `.github/workflows/deploy.yml` publishes every push to
`main` to https://akharlamov-arch.github.io/registration-flow/ as a one-host build (the portal
under `#/portal`).

A build fails without `VITE_ONBOARDING_ORIGIN` and `VITE_PORTAL_ORIGIN` (`vite.config.js`).
