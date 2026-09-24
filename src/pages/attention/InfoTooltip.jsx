// A small "i" beside a label that opens an explanation on hover, focus or tap.
//
// It is a disclosure (button + aria-expanded), not a `role="tooltip"`: the
// panel may carry a link, and a tooltip must not hold anything interactive.
// The panel stays open while the pointer is over it — the transparent top
// padding bridges the gap from the icon, so moving down to the link does not
// close it on the way — and closes on Escape or when focus leaves.
//
// It opens under the icon and is nudged left just enough to keep a 16px
// gutter on a narrow screen, where an icon partway across the row would push a
// fixed-width panel off the right edge.

import { useId, useLayoutEffect, useRef, useState } from 'react'

const GUTTER = 16

export default function InfoTooltip({ label, children }) {
  const [open, setOpen] = useState(false)
  const [shift, setShift] = useState(0)
  const panelId = useId()
  const wrapper = useRef(null)
  const panel = useRef(null)

  // Measured before paint, from an unshifted panel (the shift resets on close).
  useLayoutEffect(() => {
    if (!open) {
      setShift(0)
      return
    }
    const overflow = panel.current.getBoundingClientRect().right - (document.documentElement.clientWidth - GUTTER)
    setShift(overflow > 0 ? -overflow : 0)
  }, [open])

  return (
    <span
      ref={wrapper}
      className="relative inline-flex align-middle"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!wrapper.current?.contains(e.relatedTarget)) setOpen(false)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpen(false)
      }}
    >
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={panelId}
        // Opens rather than toggles: a tap also focuses, and a toggle would
        // close what the focus just opened. Tapping elsewhere closes it.
        onClick={() => setOpen(true)}
        className="ml-1.5 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" d="M12 11v5M12 8h.01" />
        </svg>
      </button>

      {open && (
        <span
          id={panelId}
          ref={panel}
          className="absolute left-0 top-full z-20 w-64 max-w-[calc(100vw-2rem)] pt-1.5"
          style={shift ? { transform: `translateX(${shift}px)` } : undefined}
        >
          <span className="block rounded-lg border border-gray-200 bg-white p-3 text-xs font-normal leading-relaxed text-gray-600 shadow-ds-sm">
            {children}
          </span>
        </span>
      )}
    </span>
  )
}
