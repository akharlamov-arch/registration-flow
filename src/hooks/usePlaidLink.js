import { useCallback, useEffect, useRef } from 'react'

/**
 * The single Plaid Link launcher (PORTAL-PLAID-GATE-01).
 *
 * Every surface that opens Plaid — the standalone re-link page and the customer
 * portal's bank-verification gate — goes through this hook, so there is exactly
 * one `window.Plaid.create` call site in the app. The SDK itself is loaded
 * globally from `index.html`.
 *
 * The hook owns only the handler lifecycle (create → open → destroy, including
 * on unmount). Screen state stays with the caller, which is why the callbacks
 * are plain props rather than state this hook manages.
 *
 * @param {Object}   opts
 * @param {Function} opts.fetchLinkToken — async () => ({ ok, data }) where a
 *   successful `data` carries `link_token`. Anything else is reported through
 *   `onError`. This is also where a caller may mint whatever session the link
 *   token needs.
 * @param {Function} opts.onSuccess — (publicToken, metadata) from Plaid Link.
 *   In update mode the SDK may pass a null `publicToken`; the backend resolves
 *   the stored access token, so it is forwarded as-is.
 * @param {Function} [opts.onExit] — (err, metadata) when the user closes Plaid.
 * @param {Function} [opts.onEvent] — (eventName, metadata) for Plaid's own
 *   telemetry stream (the lead flow's combined-link probe reads it).
 * @param {Function} [opts.onError] — ({ code, message }) for failures before
 *   Plaid opens: `PLAID_LINK_TOKEN_FAILED` or `PLAID_SCRIPT_MISSING`.
 *
 * @returns {{ open: Function, destroy: Function }}
 */
export default function usePlaidLink({ fetchLinkToken, onSuccess, onExit, onEvent, onError }) {
  const handlerRef = useRef(null)

  // Callbacks live in a ref because Plaid captures them at `create` time: a
  // plain closure would freeze whatever state the component held when the
  // handler was built, which is how a post-success `onExit` used to read a
  // stale status and undo the success.
  const callbacksRef = useRef({ onSuccess, onExit, onEvent, onError })
  callbacksRef.current = { onSuccess, onExit, onEvent, onError }

  const destroy = useCallback(() => {
    try {
      handlerRef.current?.destroy()
    } catch {
      /* the SDK throws if it was already torn down — nothing to recover */
    }
    handlerRef.current = null
  }, [])

  useEffect(() => destroy, [destroy])

  const open = useCallback(async () => {
    const { ok, data } = await fetchLinkToken()

    if (!ok || !data?.success || !data?.link_token) {
      callbacksRef.current.onError?.({
        code: data?.code || 'PLAID_LINK_TOKEN_FAILED',
        message: data?.message,
      })
      return false
    }

    if (!window.Plaid?.create) {
      callbacksRef.current.onError?.({ code: 'PLAID_SCRIPT_MISSING' })
      return false
    }

    destroy()

    handlerRef.current = window.Plaid.create({
      token: data.link_token,
      onSuccess: (publicToken, metadata) =>
        callbacksRef.current.onSuccess?.(publicToken, metadata),
      onExit: (err, metadata) => callbacksRef.current.onExit?.(err, metadata),
      onEvent: (eventName, metadata) => callbacksRef.current.onEvent?.(eventName, metadata),
    })

    handlerRef.current.open()
    return true
  }, [fetchLinkToken, destroy])

  return { open, destroy }
}
