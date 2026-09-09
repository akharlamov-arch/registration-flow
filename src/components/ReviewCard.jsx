// Shared read-only "review" primitives.
//
// Extracted from OtpVerification.jsx so the customer portal (PortalPage.jsx)
// and the registration review step render summaries with one consistent design.
// These are presentational only — no i18n, no business logic.

// ── Bordered section with header + optional edit/done affordance ────────────
export function ReviewSection({ title, onEdit, editLabel, children }) {
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
        {onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-secondary
                       transition-colors duration-200 cursor-pointer focus:outline-none"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
            {editLabel}
          </button>
        ) : (
          editLabel && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              {editLabel}
            </span>
          )
        )}
      </div>
      <div className="px-5 divide-y divide-gray-50">{children}</div>
    </div>
  )
}

// ── Label/value row (label left, value right) ───────────────────────────────
export function ReviewRow({ label, value }) {
  return (
    <div className="flex items-start justify-between py-3 gap-6">
      <span className="text-xs text-gray-400 flex-shrink-0 mt-0.5 leading-relaxed">{label}</span>
      <span className="text-sm text-gray-900 text-right font-medium leading-relaxed break-all">{value || '—'}</span>
    </div>
  )
}

// ── Stacked label-over-value row; hidden when empty ─────────────────────────
export function Row({ label, value }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-0.5 py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-900 break-all">{value}</span>
    </div>
  )
}

export const US_STATES = [
  ['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],
  ['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['FL','Florida'],['GA','Georgia'],
  ['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],['IN','Indiana'],['IA','Iowa'],
  ['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],['MD','Maryland'],
  ['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],['MS','Mississippi'],['MO','Missouri'],
  ['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],['NH','New Hampshire'],['NJ','New Jersey'],
  ['NM','New Mexico'],['NY','New York'],['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],
  ['OK','Oklahoma'],['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],
  ['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],
  ['VA','Virginia'],['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming'],
]

// Formats an address object ({line1,line2,city,state,zip}) into a single line.
// Returns '' when there is nothing to show.
export function formatAddress(address) {
  if (!address) return ''
  const street = [address.line1, address.line2].filter(Boolean).join(', ')
  const cityState = [address.city, address.state].filter(Boolean).join(', ')
  const tail = [cityState, address.zip].filter(Boolean).join(' ')
  return [street, tail].filter(Boolean).join(' • ')
}
