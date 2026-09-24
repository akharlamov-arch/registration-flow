// The one Zoho Sign frame (PORTAL-SIGN-02): a full-viewport iframe over the
// signing URL, covering everything including the Header. Rendered by the lead
// registration flow's signing step and by the customer portal's contract tab,
// so "signs the way a lead does" is the same markup, not a copy of it.
//
// `onResult` is the portal's. When Zoho finishes, it loads the portal's return
// page (public/portal-signing-return.html, a static file because Zoho refuses a
// `#` in a redirect URL) inside this frame; that page posts
// `{ type: 'itrucking:portal-signing', result }` to us. The message is only
// accepted from this frame's own window on this page's own origin — Zoho's
// pages are cross-origin and another window cannot pose as the frame. The
// result is a hint, never proof: the caller asks the server, which asks Zoho.
//
// The lead flow renders it without `onResult`; its return (Zoho →
// /#/post-signing) navigates the frame and is handled there, unchanged.

import { useEffect, useRef } from 'react'

export const PORTAL_SIGNING_MESSAGE = 'itrucking:portal-signing'

export default function ContractSigningFrame({ url, onResult, title = 'Contract signing' }) {
  const frameRef = useRef(null)
  // Held in a ref so a parent re-render does not re-register the listener.
  const onResultRef = useRef(onResult)
  onResultRef.current = onResult
  // One result per signing session: the return page may post more than once
  // (React runs its effect twice in development), and the frame is still
  // mounted until the parent re-renders.
  const reportedRef = useRef(false)

  useEffect(() => {
    reportedRef.current = false
  }, [url])

  useEffect(() => {
    if (!onResult) return undefined

    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return
      if (event.source !== frameRef.current?.contentWindow) return
      if (event.data?.type !== PORTAL_SIGNING_MESSAGE) return
      if (reportedRef.current) return
      reportedRef.current = true
      onResultRef.current?.(event.data.result === 'completed' ? 'completed' : 'declined')
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
    // Only whether a handler exists matters; its identity is read from the ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(onResult)])

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <iframe
        ref={frameRef}
        src={url}
        title={title}
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      />
    </div>
  )
}
