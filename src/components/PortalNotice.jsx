import { createPortal } from 'react-dom'

/**
 * The portal's blocking notice, in its two renderings (PORTAL-PLAID-GATE-01,
 * CONTRACT-REFRESH-01).
 *
 * Both things the portal has to stop a customer for — an unverified bank and a
 * contract that predates the current terms — look and behave identically: a
 * red modal that cannot be dismissed by a backdrop click or Esc, a `Collapse`
 * control, and a banner pinned below the site header once collapsed. This is
 * that chrome, configured by props; the gates own their own flow and pass in
 * what the action does.
 *
 * **The notice does not own where it appears.** Both renderings are portalled
 * into slots the page provides — one overlay for the modals, one sticky stack
 * for the banners — because a customer can owe us two things at once. Two
 * self-positioned modals would stack two dimmed overlays with one card hidden
 * behind the other, and two self-positioned banners would both claim the same
 * `top` and overlap on scroll. With slots, the page states the order once and
 * the notices queue inside them.
 *
 * A gate keeps one mount point whichever rendering is showing, so collapsing
 * never drops work in flight.
 *
 * @param {string}   props.heading — the notice title, in both renderings.
 * @param {string}   props.body — the explanatory line, in both renderings.
 * @param {Function} props.onAction — the primary button (Verify / Update).
 * @param {React.ReactNode} props.actionLabel — its contents, including any spinner.
 * @param {boolean}  [props.actionDisabled]
 * @param {boolean}  [props.collapsed] — render the banner instead of the modal.
 * @param {Function} [props.onCollapse] — shown in the modal's header when given.
 * @param {string}   [props.collapseLabel] — its accessible name.
 * @param {React.ReactNode} [props.children] — extra modal content (errors, notes).
 * @param {React.ReactNode} [props.bannerNote] — one extra line inside the banner.
 * @param {React.ReactNode} [props.footer] — below the modal's action (e.g. Sign out).
 * @param {HTMLElement|null} [props.modalSlot] — the page's overlay container.
 * @param {HTMLElement|null} [props.bannerSlot] — the page's sticky-banner container.
 *   A notice renders nothing until its slot exists (one frame on first paint).
 */
export default function PortalNotice({
  heading,
  body,
  onAction,
  actionLabel,
  actionDisabled = false,
  collapsed = false,
  onCollapse,
  collapseLabel = 'Collapse',
  children,
  bannerNote,
  footer,
  modalSlot,
  bannerSlot,
}) {
  if (collapsed) {
    if (!bannerSlot) return null

    return createPortal(
      <div className="bg-red-600 rounded-xl shadow-ds-lg px-4 py-3 sm:px-5 sm:py-4" role="alert">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-col sm:flex-row">
          <WarningIcon className="w-6 h-6 text-white flex-shrink-0 hidden sm:block" />

          <div className="min-w-0 flex-1">
            <p className="text-sm sm:text-base font-bold text-white">{heading}</p>
            <p className="text-xs sm:text-sm text-red-50 leading-relaxed mt-0.5">{body}</p>
            {bannerNote}
          </div>

          <button
            type="button"
            onClick={onAction}
            disabled={actionDisabled}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold
                       text-red-700 bg-white hover:bg-red-50 rounded-md shadow-ds-sm flex-shrink-0
                       transition-colors duration-200 cursor-pointer focus:outline-none
                       focus:ring-2 focus:ring-white/60 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {actionLabel}
          </button>
        </div>
      </div>,
      bannerSlot,
    )
  }

  if (!modalSlot) return null

  return createPortal(
    <div
      className="w-full max-w-lg bg-white rounded-2xl shadow-ds-xl border-2 border-red-600 overflow-hidden"
      role="alertdialog"
      aria-modal="true"
      aria-label={heading}
    >
      <div className="bg-red-600 px-6 py-4 flex items-center gap-3">
          <WarningIcon className="w-7 h-7 text-white flex-shrink-0" />
          <h2 className="text-lg sm:text-xl font-bold text-white flex-1">{heading}</h2>

          {/* Collapse — closes the modal but not the requirement. */}
          {onCollapse && (
            <button
              type="button"
              onClick={onCollapse}
              aria-label={collapseLabel}
              title={collapseLabel}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md text-white
                         hover:bg-red-700 transition-colors duration-200 cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15" />
              </svg>
            </button>
          )}
        </div>

      <div className="px-6 py-6 space-y-5">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{body}</p>

          {children}

          <button
            type="button"
            onClick={onAction}
            disabled={actionDisabled}
            className="w-full flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white
                       bg-red-600 hover:bg-red-700 rounded-md shadow-ds-sm transition-colors duration-200
                       cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-300
                       disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {actionLabel}
          </button>

        {footer && <div className="text-center">{footer}</div>}
      </div>
    </div>,
    modalSlot,
  )
}

export function WarningIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  )
}

/** The spinner both gates show while their action is in flight. */
export function Spinner({ className = 'w-4 h-4 animate-spin' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}
