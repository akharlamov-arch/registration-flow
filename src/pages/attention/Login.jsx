// Sign-in for the attention page.
//
//   email + password → one-time code → in
//   email, "send me a code" → one-time code → password → in
//   first login only (no password exists yet) → one-time code → create one → in
//   forgotten password → a fresh reset code → set a new one → in
//
// Both factors are always required once a password exists. Asking for the code
// instead of the password does not skip it: the server withholds the session
// and asks for the password after the code. The only single-factor sign-in is
// the very first one, when there is no password to ask for.
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
import { requestCode } from '../../api/portal'
import {
  verifyPassword, setPassword, verifyCodeWithFactor, completeSignIn,
  requestReset, verifyReset, resetPassword,
} from './api'

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

  // 'signin' | 'code' | 'afterCode' | 'create' | 'resetCode' | 'reset'
  const [stage, setStage] = useState('signin')
  // Proof of a factor already cleared in this attempt. Neither is a session.
  const [passwordToken, setPasswordToken] = useState('')
  const [pendingToken, setPendingToken] = useState('')
  const [resetToken, setResetToken] = useState('')

  const [email, setEmail] = useState('')
  const [password, setPasswordValue] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [code, setCode] = useState('')

  const [session, setSession] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  // A rejected password is the one failure where "you may not have a password
  // yet" is the likely explanation, so the hint under the code button is
  // highlighted in that case only.
  const [signInFailed, setSignInFailed] = useState(false)

  const fail = (key) => { setError(t(key)); setBusy(false) }

  const validEmail = () => /^\S+@\S+\.\S+$/.test(email.trim())

  // Password path: verify, then still require an OTP.
  const submitSignIn = async (e) => {
    e.preventDefault()
    if (!validEmail()) return setError(t('attention.login.errEmail'))
    if (!password) return setError(t('attention.login.errPasswordRequired'))
    setError(''); setSignInFailed(false); setBusy(true)

    const { ok, data } = await verifyPassword(email.trim(), password)
    // One message for every failure — a wrong password, an account with no
    // password, and an unknown address must be indistinguishable.
    if (!ok) {
      setSignInFailed(true)
      return fail('attention.login.errSignIn')
    }

    setPasswordToken(data.password_token || '')
    await requestCode(email.trim())
    setBusy(false)
    setStage('code')
  }

  // Code path: no password needed to reach the OTP screen.
  const sendCode = async () => {
    if (!validEmail()) return setError(t('attention.login.errEmail'))
    setError(''); setBusy(true)
    await requestCode(email.trim())
    setBusy(false)
    setStage('code')
  }

  const submitCode = async (e) => {
    e.preventDefault()
    if (!code.trim()) return setError(t('attention.login.errCode'))
    setError(''); setBusy(true)

    const { ok, data } = await verifyCodeWithFactor(email.trim(), code.trim(), passwordToken)
    if (!ok || !data?.success) return fail('attention.login.errCode')

    setBusy(false)

    // The account has a password and it has not been proved in this attempt —
    // the server sent no session, only permission to finish with the password.
    if (data.password_required) {
      setPendingToken(data.pending_token)
      return setStage('afterCode')
    }

    // No password on file: the one sign-in that cannot have two factors.
    // Creating one is the next step.
    if (data.customer?.has_password === false) {
      setSession({ token: data.session_token, customer: data.customer })
      return setStage('create')
    }

    onSignedIn(data.session_token, data.customer)
  }

  // Code-first path, second factor.
  const submitAfterCode = async (e) => {
    e.preventDefault()
    if (!password) return setError(t('attention.login.errPasswordRequired'))
    setError(''); setBusy(true)

    const { ok, data } = await completeSignIn(pendingToken, password)
    if (!ok || !data?.success) return fail('attention.login.errSignIn')

    setBusy(false)
    onSignedIn(data.session_token, data.customer)
  }

  // ── Forgotten password ────────────────────────────────────────────────────
  // A fresh code on its own endpoint, never the sign-in one, so a code already
  // in flight cannot be turned into a reset.
  const startReset = async () => {
    setError(''); setBusy(true)
    await requestReset(email.trim())
    setCode('')
    setBusy(false)
    setStage('resetCode')
  }

  const submitResetCode = async (e) => {
    e.preventDefault()
    if (!code.trim()) return setError(t('attention.login.errCode'))
    setError(''); setBusy(true)

    const { ok, data } = await verifyReset(email.trim(), code.trim())
    if (!ok || !data?.success) return fail('attention.login.errCode')

    setResetToken(data.reset_token)
    setNewPassword(''); setConfirm('')
    setBusy(false)
    setStage('reset')
  }

  const submitReset = async (e) => {
    e.preventDefault()
    if (newPassword.length < MIN_PASSWORD) return setError(t('attention.login.errPasswordShort'))
    if (newPassword !== confirm) return setError(t('attention.login.errPasswordMismatch'))
    setError(''); setBusy(true)

    const { ok, data } = await resetPassword(resetToken, newPassword)
    if (!ok || !data?.success) return fail('attention.login.errPasswordShort')

    setBusy(false)
    onSignedIn(data.session_token, data.customer)
  }

  const submitNewPassword = async (e) => {
    e.preventDefault()
    if (newPassword.length < MIN_PASSWORD) return setError(t('attention.login.errPasswordShort'))
    if (newPassword !== confirm) return setError(t('attention.login.errPasswordMismatch'))
    setError(''); setBusy(true)

    const { ok } = await setPassword(session.token, newPassword)
    if (!ok) return fail('attention.login.errPasswordShort')

    setBusy(false)
    onSignedIn(session.token, session.customer)
  }

  const HEAD = {
    signin:    ['attention.login.heading', 'attention.login.sub'],
    code:      ['attention.login.heading', 'attention.login.sub'],
    afterCode: ['attention.login.afterCodeHeading', 'attention.login.afterCodeSub'],
    create:    ['attention.login.createHeading', 'attention.login.createSub'],
    resetCode: ['attention.login.resetCodeHeading', 'attention.login.resetCodeSub'],
    reset:     ['attention.login.resetHeading', 'attention.login.resetSub'],
  }[stage]

  const restart = () => {
    setStage('signin'); setCode(''); setPasswordValue(''); setError(''); setSignInFailed(false)
    setPasswordToken(''); setPendingToken(''); setResetToken('')
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
            <Field label={t('attention.login.emailLabel')}>
              <input
                type="email" autoComplete="email" className={inputCls} value={email}
                placeholder="you@company.com" onChange={(e) => setEmail(e.target.value)}
              />
            </Field>

            <Field label={t('attention.login.passwordLabel')}>
              <PasswordInput value={password} onChange={setPasswordValue} autoComplete="current-password" />
            </Field>

            <button className={primaryBtn} disabled={busy}>
              {busy ? t('attention.login.verifying') : t('attention.login.signInBtn')}
            </button>

            {/* Directly under Continue: until people have set a password this is
                the path almost everyone takes. The line beneath explains it, and
                turns red after a rejected password — the likeliest reason being
                that no password exists for this account yet. */}
            <button type="button" onClick={sendCode} disabled={busy} className={secondaryBtn}>
              {busy ? t('attention.login.sending') : t('attention.login.useCodeBtn')}
            </button>

            <p
              className={`text-xs leading-relaxed ${
                signInFailed ? 'text-red-600 font-medium' : 'text-gray-500'
              }`}
              role={signInFailed ? 'alert' : undefined}
            >
              {t('attention.login.firstTime')}
            </p>
          </form>
        )}

        {stage === 'code' && (
          <form onSubmit={submitCode} className="space-y-4">
            <Field label={t('attention.login.codeLabel')}>
              <input
                type="text" inputMode="text" autoComplete="one-time-code" maxLength={6}
                className={`${inputCls} text-center text-lg [@media(pointer:coarse)]:text-lg font-bold tracking-[0.3em] uppercase`}
                value={code} placeholder="000000" onChange={(e) => setCode(e.target.value)}
              />
            </Field>

            <p className="text-xs text-gray-500 leading-relaxed">
              {t('attention.login.codeAfterPassword')}
            </p>

            <button className={primaryBtn} disabled={busy}>
              {busy ? t('attention.login.verifying') : t('attention.login.continueBtn')}
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button type="button" onClick={restart} className="text-gray-500 hover:text-gray-800">
                {t('attention.login.changeEmail')}
              </button>
              <button type="button" onClick={sendCode} className="text-primary hover:text-secondary">
                {t('attention.login.resend')}
              </button>
            </div>
          </form>
        )}

        {stage === 'afterCode' && (
          <form onSubmit={submitAfterCode} className="space-y-4">
            <Field label={t('attention.login.passwordLabel')}>
              <PasswordInput value={password} onChange={setPasswordValue} autoComplete="current-password" />
            </Field>
            <button className={primaryBtn} disabled={busy}>
              {busy ? t('attention.login.verifying') : t('attention.login.signInBtn')}
            </button>
            <div className="flex items-center justify-between text-xs pt-1">
              <button type="button" onClick={restart} className="text-gray-500 hover:text-gray-800">
                {t('attention.login.changeEmail')}
              </button>
              <button
                type="button"
                onClick={startReset}
                disabled={busy}
                className="font-medium text-primary hover:text-secondary transition-colors duration-ds-normal"
              >
                {t('attention.login.forgotBtn')}
              </button>
            </div>
          </form>
        )}

        {stage === 'resetCode' && (
          <form onSubmit={submitResetCode} className="space-y-4">
            <Field label={t('attention.login.codeLabel')}>
              <input
                type="text" inputMode="text" autoComplete="one-time-code" maxLength={6}
                className={`${inputCls} text-center text-lg [@media(pointer:coarse)]:text-lg font-bold tracking-[0.3em] uppercase`}
                value={code} placeholder="000000" onChange={(e) => setCode(e.target.value)}
              />
            </Field>
            <button className={primaryBtn} disabled={busy}>
              {busy ? t('attention.login.verifying') : t('attention.login.continueBtn')}
            </button>
            <div className="flex items-center justify-between text-xs pt-1">
              <button type="button" onClick={restart} className="text-gray-500 hover:text-gray-800">
                {t('attention.login.changeEmail')}
              </button>
              <button type="button" onClick={startReset} className="text-primary hover:text-secondary">
                {t('attention.login.resend')}
              </button>
            </div>
          </form>
        )}

        {stage === 'reset' && (
          <form onSubmit={submitReset} className="space-y-4">
            <Field label={t('attention.login.newPasswordLabel')}>
              <PasswordInput value={newPassword} onChange={setNewPassword} autoComplete="new-password" />
            </Field>
            <Field label={t('attention.login.confirmLabel')}>
              <PasswordInput value={confirm} onChange={setConfirm} autoComplete="new-password" />
            </Field>
            <p className="text-xs text-gray-400">{t('attention.login.errPasswordShort')}</p>
            <button className={primaryBtn} disabled={busy}>
              {busy ? t('attention.login.saving') : t('attention.login.resetSaveBtn')}
            </button>
          </form>
        )}

        {stage === 'create' && (
          <form onSubmit={submitNewPassword} className="space-y-4">
            <Field label={t('attention.login.newPasswordLabel')}>
              <PasswordInput value={newPassword} onChange={setNewPassword} autoComplete="new-password" />
            </Field>
            <Field label={t('attention.login.confirmLabel')}>
              <PasswordInput value={confirm} onChange={setConfirm} autoComplete="new-password" />
            </Field>
            <p className="text-xs text-gray-400">{t('attention.login.errPasswordShort')}</p>
            <button className={primaryBtn} disabled={busy}>
              {busy ? t('attention.login.saving') : t('attention.login.createBtn')}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
