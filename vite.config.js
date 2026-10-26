import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/registration-flow/',
  resolve: {
    // The tutorials app (src/pages/tutorials/, from tutorial.itrucking.pro)
    // imports its own files as `@/…`; pointing `@` at its root keeps those
    // files as in the original, so they can be re-synced by copying.
    alias: { '@': fileURLToPath(new URL('./src/pages/tutorials', import.meta.url)) },
  },
})
