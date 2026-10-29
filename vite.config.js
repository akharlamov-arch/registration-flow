import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// One build serves two hosts and picks its routes by the one it is on
// (src/config/surfaces.js, PUBLIC-HOSTS-02), so both origins are required.
// Without them the build stops here, rather than shipping a bundle that would
// quietly put the portal back on the onboarding host.
const REQUIRED_ORIGINS = ['VITE_ONBOARDING_ORIGIN', 'VITE_PORTAL_ORIGIN']

function assertOrigin(name, value) {
  let origin
  try {
    origin = new URL(value).origin
  } catch {
    origin = null
  }
  if (!value || origin !== value) {
    throw new Error(
      `${name} must be a bare origin such as https://portal.itrucking.pro ` +
        `(no path, no trailing slash); got ${JSON.stringify(value ?? null)}. ` +
        'Set it in .env.production / .env.development or the environment.',
    )
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  REQUIRED_ORIGINS.forEach((name) => assertOrigin(name, env[name]))

  return {
    plugins: [react()],
    // '/' on registration.itrucking.pro and portal.itrucking.pro. The GitHub
    // Pages preview lives under the repository's name and sets
    // VITE_BASE=/registration-flow/ (.github/workflows/deploy.yml).
    base: env.VITE_BASE || '/',
    resolve: {
      // The tutorials app (src/pages/tutorials/, from tutorial.itrucking.pro)
      // imports its own files as `@/…`; pointing `@` at its root keeps those
      // files as in the original, so they can be re-synced by copying.
      alias: { '@': fileURLToPath(new URL('./src/pages/tutorials', import.meta.url)) },
    },
  }
})
