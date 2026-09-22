// Sign-in for the portal demo.
//
//   email + password → one-time code → in
//   email, "send me a code" → one-time code → create a password → in
//
// The screen never asks the server who has a password, and never tells the
// customer whether an account exists: both paths start from the same form, and
// a failed password returns one message for a wrong password, an account with
// no password, and an address we have never seen.
//
// Whether to offer creating a password is decided *after* the OTP, from
// `customer.has_password` on the authenticated response. At launch nobody has
// one, so the one-time code is the path most people take — which is why it is
// a full-width button rather than a footnote.
//
// A password alone never mints a session: only /verify-code returns a token,
// so the second factor stays in place for returning customers too.

import { useState } from 'react'
import { useI18n } from '../../context/I18nContext'
import { requestCode, verifyCode } from '../../api/portal'
import { verifyPassword, setPassword } from './api'

const MIN_PASSWORD = 8

const inputCls =
  // 16px on touch devices so mobile Safari does not zoom on focus.
  'w-full px-3 py-2.5 text-sm [@media(pointer:coarse)]:text-base rounded-lg border border-gray-300 ' +
  'text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 ' +
  'focus:ring-primary/30 focus:border-primary transition-colors duration-ds-normal'

const primaryBtn =
  'w-full px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-secondary rounded-lg ' +
  'shadow-ds-sm transition-colors duration-ds-normal cursor-pointer ' +
  'focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60 disabled:cursor-not-allowed'

const secondaryBtn =
  'w-full px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 ' +
  'hover:bg-gray-50 rounded-lg transition-colors duration-ds-normal cursor-pointer ' +
  'focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-60'

function EyeIcon({ open }) {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243" />
      ) : (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </>
      )}
    </svg>
  )
}

// Same treatment the registration flow gives SSN and driver licence: a real
// password field with a reveal toggle.
function PasswordInput({ value, onChange, autoComplete, placeholder }) {
  const { t } = useI18n()
  const [shown, setShown] = useState(false)

  return (
    <div className="relative">
      <input
        type={shown ? 'text' : 'password'}
        autoComplete={autoComplete}
        className={`${inputCls} pr-10`}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        onClick={() => setShown((v) => !v)}
        aria-label={shown ? t('common.hide') : t('common.show')}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
      >
        <EyeIcon open={shown} />
      </button>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-900 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

export default function Login({ onSignedIn }) {
  const { t } = useI18n()

  // 'signin' | 'code' | 'create'
  const [stage, setStage] = useState('signin')

  const [email, setEmail] = useState('')
  const [password, setPasswordValue] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [code, setCode] = useState('')

  const [session, setSession] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const fail = (key) => { setError(t(key)); setBusy(false) }

  const validEmail = () => /^\S+@\S+\.\S+$/.test(email.trim())

  // Password path: verify, then still require an OTP.
  const submitSignIn = async (e) => {
    e.preventDefault()
    if (!validEmail()) return setError(t('portalDemo.login.errEmail'))
    if (!password) return setError(t('portalDemo.login.errPasswordRequired'))
    setError(''); setBusy(true)

    const { ok } = await verifyPassword(email.trim(), password)
    // One message for every failure — a wrong password, an account with no
    // password, and an unknown address must be indistinguishable.
    if (!ok) return fail('portalDemo.login.errSignIn')

    await requestCode(email.trim())
    setBusy(false)
    setStage('code')
  }

  // Code path: no password needed to reach the OTP screen.
  const sendCode = async () => {
    if (!validEmail()) return setError(t('portalDemo.login.errEmail'))
    setError(''); setBusy(true)
    await requestCode(email.trim())
    setBusy(false)
    setStage('code')
  }

  const submitCode = async (e) => {
    e.preventDefault()
    if (!code.trim()) return setError(t('portalDemo.login.errCode'))
    setError(''); setBusy(true)

    const { ok, data } = await verifyCode(email.trim(), code.trim())
    if (!ok || !data?.success) return fail('portalDemo.login.errCode')

    setBusy(false)
    // Only now, inside an authenticated response, do we learn whether this
    // customer has a password — and offer to create one if not.
    if (data.customer?.has_password === false) {
      setSession({ token: data.session_token, customer: data.customer })
      return setStage('create')
    }
    onSignedIn(data.session_token, data.customer)
  }

  const submitNewPassword = async (e) => {
    e.preventDefault()
    if (newPassword.length < MIN_PASSWORD) return setError(t('portalDemo.login.errPasswordShort'))
    if (newPassword !== confirm) return setError(t('portalDemo.login.errPasswordMismatch'))
    setError(''); setBusy(true)

    const { ok } = await setPassword(session.token, newPassword)
    if (!ok) return fail('portalDemo.login.errPasswordShort')

    setBusy(false)
    onSignedIn(session.token, session.customer)
  }

  const HEAD = {
    signin: ['portalDemo.login.heading', 'portalDemo.login.sub'],
    code:   ['portalDemo.login.heading', 'portalDemo.login.sub'],
    create: ['portalDemo.login.createHeading', 'portalDemo.login.createSub'],
  }[stage]

  const restart = () => {
    setStage('signin'); setCode(''); setPasswordValue(''); setError('')
  }

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-xl font-bold text-gray-900 mb-1">{t(HEAD[0])}</h1>
      <p className="text-sm text-gray-500 mb-6">{t(HEAD[1])}</p>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-ds-sm p-6">
        {error && (
          <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2" role="alert">
            {error}
          </p>
        )}

        {stage === 'signin' && (
          <form onSubmit={submitSignIn} className="space-y-4">
            <Field label={t('portalDemo.login.emailLabel')}>
              <input
                type="email" autoComplete="email" className={inputCls} value={email}
                placeholder="you@company.com" onChange={(e) => setEmail(e.target.value)}
              />
            </Field>

            <Field label={t('portalDemo.login.passwordLabel')}>
              <PasswordInput value={password} onChange={setPasswordValue} autoComplete="current-password" />
            </Field>

            <button className={primaryBtn} disabled={busy}>
              {busy ? t('portalDemo.login.verifying') : t('portalDemo.login.signInBtn')}
            </button>

            {/* Prominent, not a footnote: until people have set a password this
                is the path almost everyone takes. */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 leading-relaxed mt-3 mb-2">
                {t('portalDemo.login.firstTime')}
              </p>
              <button type="button" onClick={sendCode} disabled={busy} className={secondaryBtn}>
                {busy ? t('portalDemo.login.sending') : t('portalDemo.login.useCodeBtn')}
              </button>
            </div>
          </form>
        )}

        {stage === 'create' && (
          <form onSubmit={submitNewPassword} className="space-y-4">
            <Field label={t('portalDemo.login.newPasswordLabel')}>
              <PasswordInput value={newPassword} onChange={setNewPassword} autoComplete="new-password" />
            </Field>
            <Field label={t('portalDemo.login.confirmLabel')}>
              <PasswordInput value={confirm} onChange={setConfirm} autoComplete="new-password" />
            </Field>
            <p className="text-xs text-gray-400">{t('portalDemo.login.errPasswordShort')}</p>
            <button className={primaryBtn} disabled={busy}>
              {busy ? t('portalDemo.login.saving') : t('portalDemo.login.createBtn')}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
