// How the portal names a bank and explains a `bank_history` entry
// (PORTAL-BANK-02). Both portal pages (src/pages/attantion,
// src/pages/portal-demo) render through these, so neither can drift from the
// backend contract — docs/conventions/portal-api-contract.md in pijb.
//
// `method` is three-valued: `plaid`, `moov`, and `manual` (typed in, imported,
// or pre-Plaid). Collapsing it to two is how a bank Plaid never saw came to
// read "Verified instantly through Plaid". An unrecognised value reads as
// manual: the portal never claims a verification the backend did not report.

const METHOD_KEYS = {
  plaid: 'portalDemo.bank.historyMethod.plaid',
  moov: 'portalDemo.bank.historyMethod.moov',
  manual: 'portalDemo.bank.historyMethod.manual',
}

const NOTE_KEYS = {
  plaid: 'portalDemo.bank.historyViaPlaid',
  moov: 'portalDemo.bank.historyViaMoov',
  manual: 'portalDemo.bank.historyViaManual',
}

// "Chase ···· 4471", "···· 0000" (no institution on file), "Chase" (no last
// four), or null when the summary sent neither. Never a placeholder bank.
export function bankLabel(bank) {
  const parts = [bank?.institution, bank?.last4 && `···· ${bank.last4}`].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : null
}

// i18n key for the small method tag on a history entry.
export function historyMethodKey(method) {
  return METHOD_KEYS[method] || METHOD_KEYS.manual
}

// Statuses whose bank was accepted onto the account — the only ones that may
// say how they were verified.
const ACCEPTED_STATUSES = ['active', 'replaced']

// i18n key for the sentence under a history entry, or null for none. A staged
// entry is not verified yet, however it was submitted, so `pending_review` wins
// over method; a status with no copy yet (PORTAL-MOOV-03 reserves
// `pending_verification | rejected | failed`) gets no sentence rather than one
// claiming a verification that did not happen.
export function historyNoteKey({ status, method } = {}) {
  if (status === 'pending_review') return 'portalDemo.bank.historyAwaitingReview'
  if (!ACCEPTED_STATUSES.includes(status)) return null
  return NOTE_KEYS[method] || NOTE_KEYS.manual
}
