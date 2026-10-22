import { useLayoutEffect, useRef } from 'react'

// Content strings carry trusted inline HTML (links, <strong>, <br>) authored in
// content.js, so they are rendered as HTML like the original did.
function Html({ as: Tag = 'p', html, ...rest }) {
  return <Tag {...rest} dangerouslySetInnerHTML={{ __html: html }} />
}

// Store buttons are placeholders on the original site too (href="#"); they
// must not navigate, since "#" is the lead form under HashRouter.
function DownloadButtons({ s }) {
  const stay = (e) => e.preventDefault()
  return (
    <div className="download-buttons">
      <a href="#" target="_blank" className="download-btn apple" onClick={stay}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
        </svg>
        <div className="download-btn-text">
          <span className="download-label">{s('download-on')}</span>
          <span className="download-store">App Store</span>
        </div>
      </a>
      <a href="#" target="_blank" className="download-btn google" onClick={stay}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
        </svg>
        <div className="download-btn-text">
          <span className="download-label">{s('download-on')}</span>
          <span className="download-store">Google Play</span>
        </div>
      </a>
    </div>
  )
}

function Step({ step, lang, s, zoom }) {
  return (
    <div className="step">
      <h3>{step.title[lang]}</h3>
      <Html html={step.content[lang]} />
      {step.hasDownloadButtons && <DownloadButtons s={s} />}
      {step.image && <img src={step.image} alt={step.title[lang]} className="step-image" onClick={zoom} />}
      {step.note && (
        <div className="step-note">
          <Html html={`💡 ${step.note[lang]}`} />
        </div>
      )}
      {step.note && step.noteImage && <img src={step.noteImage} alt="Note" className="step-image" onClick={zoom} />}
      {step.solution && (
        <div className="step-solution">
          <strong>{s('how-to-avoid')}</strong>
          <Html html={step.solution[lang]} />
        </div>
      )}
      {step.tip && (
        <div className="step-solution">
          <strong>{s('tip')}</strong>
          <Html html={step.tip[lang]} />
        </div>
      )}
    </div>
  )
}

// The overlay stays mounted and toggles `.active`, like the original, so its
// fade/slide animations replay on every open.
export default function TutorialModal({
  tutorial, open, lang, s, categoryName, recommendations, onClose, onNavigate, onZoom,
}) {
  const overlayRef = useRef(null)

  useLayoutEffect(() => {
    if (open) overlayRef.current.scrollTop = 0
  }, [open, tutorial])

  const zoom = (e) => onZoom(e.currentTarget.src)

  // Links between tutorials ("#tutorial-9") live inside content HTML as well
  // as in the recommendations, so they are caught by delegation.
  const onBodyClick = (e) => {
    const link = e.target.closest('.internal-link')
    if (!link) return
    e.preventDefault()
    const href = link.getAttribute('href')
    if (href && href.startsWith('#tutorial-')) onNavigate(Number(href.replace('#tutorial-', '')))
  }

  const t = tutorial
  return (
    <div
      ref={overlayRef}
      className={`modal${open ? ' active' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{t?.title[lang]}</h2>
            <div className="tutorial-meta">
              {t && <span className="tutorial-badge">{categoryName(t.category)}</span>}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body" onClick={onBodyClick}>
          {t && (
            <>
              {t.mainImage && <img src={t.mainImage[lang]} alt={t.title[lang]} className="tutorial-main-image" onClick={zoom} />}

              {t.preIntro && (
                <div className="tutorial-pre-intro">
                  <Html html={t.preIntro[lang]} />
                  {t.preIntroImage && <img src={t.preIntroImage} alt="Instructions" className="tutorial-pre-intro-image" onClick={zoom} />}
                </div>
              )}
              {t.preIntroLink && <Html className="tutorial-pre-intro-link" html={t.preIntroLink[lang]} />}
              {t.intro && !t.preIntro && <Html className="tutorial-intro" html={t.intro[lang]} />}

              {t.instructionsList?.length > 0 && (
                <div className="instructions-section">
                  <h3>{s('form-instructions')}</h3>
                  <ol className="instructions-list">
                    {t.instructionsList.map((item, i) => <Html as="li" key={i} html={item[lang]} />)}
                  </ol>
                </div>
              )}

              {t.tip && t.stepsCount === 0 && (
                <div className="tutorial-tip-section">
                  <strong>{s('tip')}</strong>
                  <Html html={t.tip[lang]} />
                </div>
              )}

              {t.steps?.length > 0 && (
                <>
                  <h2>{s('steps-title')}</h2>
                  <div className="steps-container">
                    {t.steps.map((step, i) => <Step key={i} step={step} lang={lang} s={s} zoom={zoom} />)}
                  </div>
                </>
              )}

              {t.note && (
                <div className="tutorial-note">
                  <strong>{s('note')}</strong>
                  <Html html={t.note[lang]} />
                </div>
              )}

              {t.editingSteps?.length > 0 && (
                <>
                  <h2 style={{ marginTop: '2rem' }}>{s('editing-users')}</h2>
                  <div className="editing-steps">
                    {t.editingSteps.map((editStep, i) => (
                      <div className="editing-step" key={i}>
                        <h4><span className="editing-number">{i + 1}</span>{` ${editStep.title[lang]}`}</h4>
                        <Html html={editStep.content[lang]} />
                        {editStep.image && <img src={editStep.image} alt={editStep.title[lang]} className="step-image" onClick={zoom} />}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {t.conclusion && (
                <div className="tutorial-conclusion">
                  <h3>{s('conclusion')}</h3>
                  <Html html={t.conclusion[lang]} />
                </div>
              )}

              {recommendations.length > 0 && (
                <div className="recommendations">
                  <h3>{s('recommendations-title')}</h3>
                  <div className="recommendation-links">
                    {recommendations.map((rec) => (
                      <a key={rec.id} href={`#tutorial-${rec.id}`} className="recommendation-link internal-link">{`→ ${rec.title[lang]}`}</a>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
