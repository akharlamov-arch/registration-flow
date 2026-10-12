// How the portal names a bank and explains a `bank_history` entry
// (PORTAL-BANK-02). The attention page (src/pages/attention/) renders through
// these, and so should anything else that shows a bank, so no surface can drift
// from the backend contract — docs/conventions/portal-api-contract.md in pijb.
//
// `method` is three-valued: `plaid`, `moov`, and `manual` (typed in, imported,
// or pre-Plaid). Collapsing it to two is how a bank Plaid never saw came to
// read "Verified instantly through Plaid". An unrecognised value reads as
// manual: the portal never claims a verification the backend did not report.

const METHOD_KEYS = {
  plaid: 'attention.bank.historyMethod.plaid',
  moov: 'attention.bank.historyMethod.moov',
  manual: 'attention.bank.historyMethod.manual',
}

const NOTE_KEYS = {
  plaid: 'attention.bank.historyViaPlaid',
  moov: 'attention.bank.historyViaMoov',
  manual: 'attention.bank.historyViaManual',
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

// Sentences for the statuses only a portal (MOOV) submission reaches.
const SUBMISSION_NOTE_KEYS = {
  pending_verification: 'attention.bank.historyAwaitingCode',
  rejected: 'attention.bank.historyRejectedNote',
  failed: 'attention.bank.historyFailedNote',
}

// i18n key for the sentence under a history entry, or null for none. A staged
// entry is not verified yet, however it was submitted, so `pending_review` wins
// over method, and a submission's own statuses say where it stands. A status
// with no copy gets no sentence rather than one claiming a verification that
// did not happen.
export function historyNoteKey({ status, method } = {}) {
  if (status === 'pending_review') return 'attention.bank.historyAwaitingReview'
  if (SUBMISSION_NOTE_KEYS[status]) return SUBMISSION_NOTE_KEYS[status]
  if (!ACCEPTED_STATUSES.includes(status)) return null
  return NOTE_KEYS[method] || NOTE_KEYS.manual
}

// Statuses in which a submitted bank is still under way.
const OPEN_SUBMISSION_STATUSES = ['pending_review', 'pending_verification']

// The customer's open portal (MOOV) submission from `bank_history`, or null.
// Its status is the stage (PORTAL-MOOV-04): `pending_review` — our team has
// not approved it and nothing went to Moov (or, verified, it waits on the
// switch-over); `pending_verification` — approved, the deposit is on its way
// or its code can be entered (`bank_verification.awaiting_codes`). Read from
// the summary on every render, so a reload shows the same thing.
export function openSubmission(history = []) {
  return history.find((e) => String(e?.id).startsWith('sub-') && OPEN_SUBMISSION_STATUSES.includes(e.status)) || null
}

// Whether any new bank is still under way — a portal (MOOV) submission, or a
// Plaid re-link staged for our review (not a `sub-` entry, so `openSubmission`
// does not see it). Either way the bank in use has not been replaced yet.
export function bankChangeUnderWay(history = []) {
  return history.some((e) => OPEN_SUBMISSION_STATUSES.includes(e?.status))
}

// Whether the customer's bank counts as verified — what every bank gate reads.
// `bank_verification.status` covers Plaid and Moov alike (PORTAL-MOOV-02); a
// bank verified through a MOOV submission has no Plaid item, so reading
// `plaid_linked` alone told a customer who had just entered their code to go
// connect with Plaid. An older API without `status` falls back to
// `plaid_linked`; with neither, returns null (unknown), and a gate must not
// block on unknown.
export function bankVerified(bankVerification) {
  if (!bankVerification) return null
  if (bankVerification.status) return bankVerification.status === 'verified'
  if (typeof bankVerification.plaid_linked === 'boolean') return bankVerification.plaid_linked
  return null
}
