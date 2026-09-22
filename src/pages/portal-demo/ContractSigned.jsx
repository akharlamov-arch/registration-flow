// Step 1 in its completed state.
//
// Reopening a signed step must not show an editable, empty form with a "Sign"
// button — the rail already calls it Completed, and pressing Sign again would
// re-submit. This panel is what a done step 1 looks like.

function CheckBadge() {
  return (
    <span className="w-10 h-10 rounded-full bg-green-50 border border-green-200 text-green-600 flex items-center justify-center shrink-0">
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </span>
  )
}

function formatSignedAt(iso) {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function ContractSigned({ signedAt }) {
  const when = formatSignedAt(signedAt)

  return (
    <div className="space-y-4">
      <header className="mb-2">
        <h2 className="text-xl font-bold text-gray-900">Updated contract details</h2>
        <p className="text-sm text-gray-500 mt-1 max-w-2xl">
          Nothing further is needed here.
        </p>
      </header>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-ds-sm p-6">
        <div className="flex items-start gap-4">
          <CheckBadge />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">Updated contract signed</p>
            <p className="text-sm text-gray-500 mt-0.5">
              {when ? `Signed on ${when}.` : 'Signed just now.'} Your details are on file with our team.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              To change any of these details, contact iTrucking and we will send a new agreement.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
