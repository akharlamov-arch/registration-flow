import { useRef, useLayoutEffect } from 'react'

function formatPhone(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 11)
  if (digits.length === 0) return ''
  const d = digits.startsWith('1') ? digits.slice(1) : digits
  let out = '+1'
  if (d.length > 0) out += ' (' + d.slice(0, 3)
  if (d.length >= 3) out += ') '
  if (d.length > 3) out += d.slice(3, 6)
  if (d.length >= 6) out += '-'
  if (d.length > 6) out += d.slice(6, 10)
  return out
}

export default function PhoneInput({ value, onChange, className, ...props }) {
  const inputRef = useRef(null)
  const cursorRef = useRef(null)

  // Restore cursor position after React re-renders the input value
  useLayoutEffect(() => {
    if (inputRef.current && cursorRef.current !== null) {
      inputRef.current.setSelectionRange(cursorRef.current, cursorRef.current)
      cursorRef.current = null
    }
  })

  function handleChange(e) {
    const input = e.target
    const oldCursor = input.selectionStart
    const oldVal = input.value
    const newVal = formatPhone(oldVal)

    // Count user digits before cursor, skipping the country-code "1" at index 1
    // when the value is already in "+1 ..." format.
    let digitsBeforeCursor = 0
    for (let i = 0; i < oldCursor; i++) {
      if (i === 1 && oldVal.startsWith('+1')) continue
      if (/\d/.test(oldVal[i])) digitsBeforeCursor++
    }

    // Find where that many user digits land in the new formatted value,
    // again skipping the country-code "1" at index 1.
    let digitsSeen = 0
    let newCursor = newVal.length
    for (let i = 0; i < newVal.length; i++) {
      if (i === 1 && newVal.startsWith('+1')) continue
      if (/\d/.test(newVal[i])) {
        digitsSeen++
        if (digitsSeen === digitsBeforeCursor) {
          newCursor = i + 1
          break
        }
      }
    }

    cursorRef.current = newCursor
    onChange(newVal)
  }

  return (
    <input
      {...props}
      ref={inputRef}
      type="tel"
      inputMode="numeric"
      placeholder="+1 (555) 000-0000"
      value={value}
      onChange={handleChange}
      className={className}
    />
  )
}
