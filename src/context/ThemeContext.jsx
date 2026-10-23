// Light/dark theme for the whole app (SITE-CHROME-01). Stored under the key the
// tutorials page always used, so the choice is shared between the two. The
// theme lands on <html data-theme> — index.css swaps the colour palette from
// there, and index.html sets it before the first paint so a dark page never
// flashes light on load.

import { createContext, useContext, useLayoutEffect, useState } from 'react'

const THEME_KEY = 'itrucking-theme'

function readTheme() {
  try {
    return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} })

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readTheme)

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      // Ignore storage failures (e.g. private mode / blocked storage)
    }
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
