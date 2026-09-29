// Sign-in for the attention page (PORTAL-AUTH-03).
//
//   email → one-time code → password → in            a password is on file
//   email → one-time code → create a password → in   first sign-in
//   email → "forgot" → reset code → new password → in
//
// Code first, always. Once a customer has a password both factors are required
// on every sign-in, so asking for the password first never saved the email —
// it only made every customer guess which order to take, and at launch nobody
// has a password to start with.
//
// Nothing before the code depends on the account. Continue asks for a code and
// moves on whatever happens (the server always answers 200), so the code step
// looks the same for an address we know and one we have never seen. What comes
// after the code is read from the verify-code response, once the mailbox is
// proved:
//   `password_required`             → the password is still owed (`pending_token`);
//   `customer.has_password: false`  → the one single-factor sign-in; creating a
//                                     password is the next step.
//
// A reset code is its own code on its own endpoint, never the sign-in one, so a
// code already in flight cannot become a reset. That is why "forgot" is offered
// on the first step too: from the password step it costs a second email.
//
// The server still accepts the password first (`verify-password`); this screen
// does not use it. The component reads nothing from its host but
// `onSignedIn(token, customer)`, so the /portal page can adopt it as is.

import { useState } from 'react'
import { useI18n } from '../../context/I18nContext'
import { requestCode, verifyCode } from '../../api/portal'
import { setPassword, completeSignIn, requestReset, verifyReset, resetPassword } from './api'

const MIN_PASSWORD = 8

// A 422 names the rule the password broke.
const refusalKey = (data) => (data?.code === 'PASSWORD_TOO_LONG' ? 'errPasswordLong' : 'errPasswordShort')

const inputCls =
  // 16px on touch devices so mobile Safari does not zoom on focus.
  'w-full px-3 py-2.5 text-sm [@media(pointer:coarse)]:text-base rounded-lg border border-gray-300 ' +
  'text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 ' +
  'focus:ring-primary/30 focus:border-primary transition-colors duration-ds-normal'

const codeInputCls =
  `${inputCls} text-center text-lg [@media(pointer:coarse)]:text-lg font-bold tracking-[0.3em] uppercase`

const primaryBtn =
  'w-full px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-secondary rounded-lg ' +
  'shadow-ds-sm transition-colors duration-ds-normal cursor-pointer ' +
  'focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60 disabled:cursor-not-allowed'

const linkBtn =
  'font-medium text-primary hover:text-secondary transition-colors duration-ds-normal ' +
  'disabled:opacity-60 disabled:cursor-not-allowed'

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
function PasswordInput({ value, onChange, autoComplete, autoFocus }) {
  const { t } = useI18n()
  const [shown, setShown] = useState(false)

  return (
    <div className="relative">
      <input
        type={shown ? 'text' : 'password'}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        className={`${inputCls} pr-10`}
        value={value}
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

// The address every step after the first is working on, and the way back to
// change it. Omitting `onChange` shows the address alone.
function SigningInAs({ email, onChange, disabled }) {
  const { t } = useI18n()

  return (
    // Label above the address rather than beside it: a long translation
    // ("Iniciando sesión como") would otherwise push the address out at phone
    // width, and the address is the part that matters.
    <div className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{t('attention.login.signingInAs')}</p>
        <p className="truncate text-sm font-medium text-gray-900" title={email}>{email}</p>
      </div>
      {onChange && (
        <button type="button" onClick={onChange} disabled={disabled} className={`shrink-0 text-sm ${linkBtn}`}>
          {t('attention.login.changeEmail')}
        </button>
      )}
    </div>
  )
}

// Password managers pair a password with the username field in the same form.
// The email was typed on an earlier step, so it rides along here: hidden by CSS,
// not `type="hidden"`, which they ignore.
function UsernameHint({ email }) {
  return (
    <input
      type="email" name="username" autoComplete="username" value={email}
      readOnly tabIndex={-1} aria-hidden="true" className="sr-only"
    />
  )
}

function PasswordRule() {
  const { t } = useI18n()
  return <p className="text-xs text-gray-500">{t('attention.login.passwordRule')}</p>
}

export default function Login({ onSignedIn }) {
  const { t } = useI18n()

  // 'email' | 'code' | 'password' | 'create' | 'resetCode' | 'reset'
  const [stage, setStage] = useState('email')
  // Proof of the code (`pendingToken`) or of mailbox control for a reset
  // (`resetToken`). Neither is a session.
  const [pendingToken, setPendingToken] = useState('')
  const [resetToken, setResetToken] = useState('')
  // First sign-in only: the session exists, the password does not yet.
  const [session, setSession] = useState(null)

  const [email, setEmail] = useState('')
  const [password, setPasswordValue] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [code, setCode] = useState('')

  // The action in flight, so only the pressed button relabels.
  const [busy, setBusy] = useState(null)
  // A translation key, not a string, so a language switch re-renders it.
  const [errorKey, setErrorKey] = useState('')
  const [resent, setResent] = useState(false)

  const address = email.trim()
  const validEmail = () => /^\S+@\S+\.\S+$/.test(address)
  const running = (action) => busy === action
  const label = (action, idle, pending) => t(`attention.login.${running(action) ? pending : idle}`)

  const run = async (action, work) => {
    setErrorKey(''); setResent(false); setBusy(action)
    try {
      await work()
    } catch {
      setErrorKey('errNetwork')
    } finally {
      setBusy(null)
    }
  }

  const restart = () => {
    setStage('email'); setCode(''); setPasswordValue(''); setNewPassword(''); setConfirm('')
    setErrorKey(''); setResent(false)
    setPendingToken(''); setResetToken(''); setSession(null)
  }

  // A proof or session ran out mid-way: back to the first step, email kept.
  const expire = () => { restart(); setErrorKey('errExpired') }

  const toNewPassword = (nextStage) => { setNewPassword(''); setConfirm(''); setStage(nextStage) }

  // ── Sign-in ───────────────────────────────────────────────────────────────

  const submitEmail = (e) => {
    e.preventDefault()
    if (!validEmail()) return setErrorKey('errEmail')
    run('continue', async () => {
      await requestCode(address)
      setCode('')
      setStage('code')
    })
  }

  const submitCode = (e) => {
    e.preventDefault()
    if (!code.trim()) return setErrorKey('errCode')
    run('verify', async () => {
      const { ok, data } = await verifyCode(address, code.trim())
      if (!ok || !data?.success) return setErrorKey('errCode')

      // A password is on file: the server sent no session, only permission to
      // finish with the password.
      if (data.password_required) {
        setPendingToken(data.pending_token)
        setPasswordValue('')
        return setStage('password')
      }

      // No password on file: the one sign-in that cannot have two factors.
      if (data.customer?.has_password === false) {
        setSession({ token: data.session_token, customer: data.customer })
        return toNewPassword('create')
      }

      onSignedIn(data.session_token, data.customer)
    })
  }

  const submitPassword = (e) => {
    e.preventDefault()
    if (!password) return setErrorKey('errPasswordRequired')
    run('signIn', async () => {
      const { ok, data } = await completeSignIn(pendingToken, password)
      // One message for a wrong password, a locked account and an expired
      // pending token: the server answers all three alike.
      if (!ok || !data?.success) return setErrorKey('errPasswordWrong')
      onSignedIn(data.session_token, data.customer)
    })
  }

  const submitNewPassword = (e) => {
    e.preventDefault()
    if (newPassword.length < MIN_PASSWORD) return setErrorKey('errPasswordShort')
    if (newPassword !== confirm) return setErrorKey('errPasswordMismatch')
    run('save', async () => {
      const { ok, status, data } = await setPassword(session.token, newPassword)
      // 409: a password is already on file (a double submit, another tab), so
      // the session is no longer limited — the goal is met.
      if (ok || status === 409) return onSignedIn(session.token, session.customer)
      if (status === 422) return setErrorKey(refusalKey(data))
      expire()
    })
  }

  // ── Forgotten password ────────────────────────────────────────────────────

  const startReset = () => {
    if (!validEmail()) return setErrorKey('errEmail')
    run('forgot', async () => {
      await requestReset(address)
      setCode('')
      setStage('resetCode')
    })
  }

  const submitResetCode = (e) => {
    e.preventDefault()
    if (!code.trim()) return setErrorKey('errCode')
    run('verify', async () => {
      const { ok, data } = await verifyReset(address, code.trim())
      if (!ok || !data?.success) return setErrorKey('errCode')
      setResetToken(data.reset_token)
      toNewPassword('reset')
    })
  }

  const submitReset = (e) => {
    e.preventDefault()
    if (newPassword.length < MIN_PASSWORD) return setErrorKey('errPasswordShort')
    if (newPassword !== confirm) return setErrorKey('errPasswordMismatch')
    run('save', async () => {
      const { ok, status, data } = await resetPassword(resetToken, newPassword)
      if (ok && data?.success) return onSignedIn(data.session_token, data.customer)
      if (status === 422) return setErrorKey(refusalKey(data))
      expire()
    })
  }

  // Same generic confirmation for every address, like the first send.
  const resend = (request) => run('resend', async () => {
    await request(address)
    setResent(true)
  })

  // ──────────────────────────────────────────────────────────────────────────

  const HEAD = {
    email:     ['heading', 'sub'],
    code:      ['codeHeading', 'codeSub'],
    password:  ['afterCodeHeading', 'afterCodeSub'],
    create:    ['createHeading', 'createSub'],
    resetCode: ['resetCodeHeading', 'resetCodeSub'],
    reset:     ['resetHeading', 'resetSub'],
  }[stage]

  const codeForm = (onSubmit, request) => (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Field label={t('attention.login.codeLabel')}>
        <input
          type="text" inputMode="text" autoComplete="one-time-code" maxLength={6} autoFocus
          className={codeInputCls} value={code} placeholder="000000"
          onChange={(e) => setCode(e.target.value)}
        />
      </Field>

      <button className={primaryBtn} disabled={!!busy}>
        {label('verify', 'continueBtn', 'verifying')}
      </button>

      <div className="flex items-center justify-between gap-3 text-xs pt-1">
        <span role="status" className="text-green-700">
          {resent && t('attention.login.resent')}
        </span>
        <button type="button" onClick={() => resend(request)} disabled={!!busy} className={linkBtn}>
          {label('resend', 'resend', 'sending')}
        </button>
      </div>
    </form>
  )

  const newPasswordForm = (onSubmit, saveKey) => (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <UsernameHint email={address} />
      <Field label={t('attention.login.newPasswordLabel')}>
        <PasswordInput value={newPassword} onChange={setNewPassword} autoComplete="new-password" autoFocus />
      </Field>
      <Field label={t('attention.login.confirmLabel')}>
        <PasswordInput value={confirm} onChange={setConfirm} autoComplete="new-password" />
      </Field>
      <PasswordRule />
      <button className={primaryBtn} disabled={!!busy}>
        {label('save', saveKey, 'saving')}
      </button>
    </form>
  )

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-xl font-bold text-gray-900 mb-1">{t(`attention.login.${HEAD[0]}`)}</h1>
      <p className="text-sm text-gray-500 mb-6">{t(`attention.login.${HEAD[1]}`)}</p>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-ds-sm p-6">
        {stage !== 'email' && (
          // The first sign-in's session already exists: changing the address
          // there would abandon it for nothing.
          <SigningInAs email={address} onChange={stage === 'create' ? undefined : restart} disabled={!!busy} />
        )}

        {errorKey && (
          <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2" role="alert">
            {t(`attention.login.${errorKey}`)}
          </p>
        )}

        {stage === 'email' && (
          <form onSubmit={submitEmail} className="space-y-4" noValidate>
            <Field label={t('attention.login.emailLabel')}>
              <input
                type="email" name="username" autoComplete="username" autoFocus className={inputCls}
                value={email} placeholder="you@company.com" onChange={(e) => setEmail(e.target.value)}
              />
            </Field>

            <button className={primaryBtn} disabled={!!busy}>
              {label('continue', 'continueBtn', 'sending')}
            </button>

            <div className="text-center text-sm">
              <button type="button" onClick={startReset} disabled={!!busy} className={linkBtn}>
                {label('forgot', 'forgotBtn', 'sending')}
              </button>
            </div>
          </form>
        )}

        {stage === 'code' && codeForm(submitCode, requestCode)}

        {stage === 'password' && (
          <form onSubmit={submitPassword} className="space-y-4" noValidate>
            <UsernameHint email={address} />
            <Field label={t('attention.login.passwordLabel')}>
              <PasswordInput value={password} onChange={setPasswordValue} autoComplete="current-password" autoFocus />
            </Field>

            <button className={primaryBtn} disabled={!!busy}>
              {label('signIn', 'signInBtn', 'verifying')}
            </button>

            <div className="text-center text-sm">
              <button type="button" onClick={startReset} disabled={!!busy} className={linkBtn}>
                {label('forgot', 'forgotBtn', 'sending')}
              </button>
            </div>
          </form>
        )}

        {stage === 'create' && newPasswordForm(submitNewPassword, 'createBtn')}

        {stage === 'resetCode' && codeForm(submitResetCode, requestReset)}

        {stage === 'reset' && newPasswordForm(submitReset, 'resetSaveBtn')}
      </div>
    </main>
  )
}
