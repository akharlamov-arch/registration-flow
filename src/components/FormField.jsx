/**
 * FormField — labelled input/textarea/select wrapper
 *
 * Props:
 *   label        — visible label string
 *   required     — mark as required (shows red asterisk)
 *   optional     — mark as optional (shows gray "(optional)" tag)
 *   error        — error message string (renders red hint)
 *   children     — the actual <input>, <select>, or <textarea>
 *   hint         — optional hint below the input
 */
export default function FormField({ label, required = false, optional = false, error, hint, children }) {
  return (
    <div className="input-wrapper">
      {label && (
        <label className="block text-sm font-medium text-slate-900 mb-1.5">
          {label}
          {required && (
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          )}
          {optional && (
            <span className="text-gray-400 font-normal ml-1.5 text-xs">(optional)</span>
          )}
        </label>
      )}

      {children}

      {error && (
        <p className="mt-1 text-xs text-red-500" role="alert">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1 text-xs text-slate-400">{hint}</p>
      )}
    </div>
  )
}
