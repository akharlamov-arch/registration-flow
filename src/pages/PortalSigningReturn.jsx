// Where Zoho sends the customer portal's signing frame when the signer
// finishes (PORTAL-SIGN-02): `#/portal-signing-return?result=completed|declined`.
//
// It runs INSIDE the frame, on the portal's own origin, and does one thing:
// tell the page that framed it how signing ended. That page holds the session
// and asks the server to confirm with Zoho. Nothing here carries or reads a
// credential — the URL never holds one (PORTAL-SIGN-01), and this page does not
// touch sessionStorage.
//
// Opened outside a frame (a bookmarked or forwarded link), there is no parent
// to tell, so it offers the way back to the portal instead.

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useI18n } from '../context/I18nContext'
import { PORTAL_SIGNING_MESSAGE } from '../components/ContractSigningFrame'

export default function PortalSigningReturn() {
  const { t } = useI18n()
  const { search } = useLocation()
  const framed = window.parent !== window

  useEffect(() => {
    if (!framed) return
    const result = new URLSearchParams(search).get('result') === 'completed' ? 'completed' : 'declined'
    window.parent.postMessage({ type: PORTAL_SIGNING_MESSAGE, result }, window.location.origin)
  }, [framed, search])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-sm text-gray-500">{t('attention.signing.finishing')}</p>
      {!framed && (
        <a href="#/attention" className="text-sm font-semibold text-primary hover:underline">
          {t('attention.signing.backToPortal')}
        </a>
      )}
    </main>
  )
}
