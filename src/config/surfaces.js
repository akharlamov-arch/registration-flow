// Which public host this page is on, and where the other host's routes go
// (docs/tickets/PUBLIC-HOSTS-02.md).
//
// One build serves both hosts: onboarding (registration.itrucking.pro — the
// lead form at #/, #/setup, #/post-signing, #/relink) and the customer portal
// with the tutorials (portal.itrucking.pro — the portal at #/, #/tutorials).
// The origins are baked in at build time; vite.config.js refuses a build
// without them.

export const ONBOARDING_ORIGIN = import.meta.env.VITE_ONBOARDING_ORIGIN
export const PORTAL_ORIGIN = import.meta.env.VITE_PORTAL_ORIGIN

// A one-host build has the same origin twice: the GitHub Pages preview, or a
// dev server set up that way. Both route tables are mounted on it, and the
// portal moves to #/portal because #/ is the lead form there.
export const ONE_HOST = ONBOARDING_ORIGIN === PORTAL_ORIGIN

// The route tables this page mounts: 'onboarding', 'portal' or 'both'. Any
// origin that is not the portal's (an IP, `vite preview`) is onboarding.
export const SURFACE = ONE_HOST
  ? 'both'
  : window.location.origin === PORTAL_ORIGIN ? 'portal' : 'onboarding'

// The portal's home route.
export const PORTAL_HOME = ONE_HOST ? '/portal' : '/'

// The other host's routes as old links and typed URLs bring them to this one:
// a path here, and the path it becomes there. The query always rides along.
const PORTAL_ROUTES = [
  [/^\/(attention|attantion|portal-demo|portal)\/?$/, () => '/'],
  [/^\/tutorials(\/.*)?$/, (path) => path],
]

const ONBOARDING_ROUTES = [
  [/^\/(setup|registration)\/?$/, () => '/setup'],
  [/^\/post-signing\/?$/, () => '/post-signing'],
  [/^\/relink\/?$/, () => '/relink'],
]

// The URL on the other host for a hash route that belongs there, or null.
// Read from the hash itself (`#/attention?x=1`) so it can run before React
// renders anything.
export function crossHostTarget(hash = window.location.hash) {
  if (ONE_HOST) return null

  const route = hash.replace(/^#/, '') || '/'
  const queryAt = route.indexOf('?')
  const path = queryAt === -1 ? route : route.slice(0, queryAt)
  const query = queryAt === -1 ? '' : route.slice(queryAt)

  const [routes, origin] = SURFACE === 'portal'
    ? [ONBOARDING_ROUTES, ONBOARDING_ORIGIN]
    : [PORTAL_ROUTES, PORTAL_ORIGIN]

  for (const [pattern, to] of routes) {
    if (pattern.test(path)) return `${origin}/#${to(path)}${query}`
  }
  return null
}
