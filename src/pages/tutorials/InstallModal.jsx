import { useEffect, useRef, useState } from 'react'

// PWA "install" affordance, as on the original site: the header button shows
// on iOS/Android (or once Chrome offers an install prompt), and opens either
// the native prompt or step-by-step "Add to Home Screen" instructions.
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
const isAndroid = /Android/.test(navigator.userAgent)

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
}

export function useInstallPrompt() {
  const deferredPrompt = useRef(null)
  const [visible, setVisible] = useState(() => (isIOS || isAndroid) && !isStandalone())
  const [kind, setKind] = useState(null) // 'ios' | 'android'
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault()
      deferredPrompt.current = e
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  const showInstructions = (nextKind) => {
    setKind(nextKind)
    setOpen(true)
  }

  const install = async () => {
    if (isIOS) {
      showInstructions('ios')
    } else if (isAndroid) {
      const prompt = deferredPrompt.current
      if (prompt) {
        prompt.prompt()
        const { outcome } = await prompt.userChoice
        if (outcome === 'accepted') setVisible(false)
        deferredPrompt.current = null
      } else {
        showInstructions('android')
      }
    }
  }

  return { visible, install, open, kind, close: () => setOpen(false) }
}

// `kind` outlives `open` so the dialog keeps its content while hidden, like the
// original's static markup.
export default function InstallModal({ open, kind, onClose, s }) {
  let title = s('install-app')
  let steps = null

  if (kind === 'ios') {
    title = s('ios-install-title')
    steps = [
      <p key="1">{`${s('ios-install-step1')} `}<span className="ios-install-icon">⋯</span>{` ${s('ios-install-step1-desc')}`}</p>,
      <p key="2">{`${s('ios-install-step2')} `}<strong>{`"${s('ios-install-step2-desc')}"`}</strong></p>,
      <p key="3">{`${s('ios-install-step3')} ${s('ios-install-step3-desc')}`}</p>,
    ]
  } else if (kind === 'android') {
    title = s('android-install-title')
    steps = [
      <p key="1">{`${s('android-install-step1')} `}<span className="ios-install-icon">⋮</span>{` ${s('android-install-step1-desc')}`}</p>,
      <p key="2">{`${s('android-install-step2')} `}<strong>{`"${s('android-install-step2-desc')}"`}</strong></p>,
    ]
  }

  return (
    <div
      className={`ios-install-modal${open ? ' active' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="ios-install-content">
        <div className="ios-install-header">
          <h3>{title}</h3>
          <button className="ios-install-close" onClick={onClose}>×</button>
        </div>
        <div className="ios-install-steps">
          {steps?.map((step, i) => (
            <div className="ios-install-step" key={i}>
              <div className="ios-install-step-number">{i + 1}</div>
              <div className="ios-install-step-content">{step}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
