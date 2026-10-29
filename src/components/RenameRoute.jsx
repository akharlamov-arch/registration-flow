import { Navigate, useLocation } from 'react-router-dom'

/**
 * A retired route name on this host: replaces itself with `to`, keeping the
 * query. `<Navigate to="/setup">` alone would drop `?code=…`, which is exactly
 * what an OTP e-mail's link carries. `replace` keeps the old name out of the
 * history, so Back does not bounce through it.
 *
 * Routes that moved to the other host never get here: main.jsx sends them
 * there before React renders (src/config/surfaces.js).
 */
export default function RenameRoute({ to }) {
  const { search } = useLocation()
  return <Navigate to={{ pathname: to, search }} replace />
}
