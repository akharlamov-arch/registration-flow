// Date display shared by the contract panels (ContractSigned, ContractInInbox).

// "October 2, 2026", or null for a missing or unparseable timestamp — never a
// placeholder date.
export function formatLongDate(iso) {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
