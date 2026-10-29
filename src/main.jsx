import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { crossHostTarget } from './config/surfaces'

// A route that lives on the other host (an old link, a typed URL) leaves for it
// before anything renders, so none of this host's chrome flashes on the way.
// Again on every hash change: a route typed into the address bar does not
// reload the page.
function leaveForOtherHost() {
  const target = crossHostTarget()
  if (target) window.location.replace(target)
  return target !== null
}

window.addEventListener('hashchange', leaveForOtherHost)

if (!leaveForOtherHost()) {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
