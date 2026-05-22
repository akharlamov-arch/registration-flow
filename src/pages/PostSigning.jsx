import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import bannerTires from '../assets/banner-tires.jpg'
import bannerFactoring from '../assets/banner-factoring.jpg'
import bannerProtection from '../assets/banner-protection.jpg'
import { useI18n } from '../context/I18nContext'
import { validateSession, completeSigning, setFuelCards } from '../api/leads'
import { buildFuelCardsPayload } from '../api/leadMappers'

// ── Fuel card truck row input ──────────────────────────────────────────────
const truckInputClass = (err) => [
  'w-full px-3 py-2.5 text-sm border rounded-xl',
  'focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400',
  'transition-colors duration-200 bg-white text-gray-900',
  err ? 'border-red-300 bg-red-50' : 'border-gray-200',
].join(' ')

export default function PostSigning() {
  const { t } = useI18n()
  const location = useLocation()

  // ── Session token from URL (ZohoSign appends ?token= or ?code= fallback) ─
  const params = new URLSearchParams(location.search)
  const sessionToken = params.get('token') || params.get('code') || ''

  // ── Page-level state ───────────────────────────────────────────────────
  const [pageState, setPageState] = useState('loading') // 'loading' | 'error' | 'ready'
  const [pageError, setPageError] = useState('')

  // ── Post-signing step ──────────────────────────────────────────────────
  const [postStep, setPostStep] = useState('fuelCards') // 'fuelCards' | 'allDone'

  // ── Fuel cards state ───────────────────────────────────────────────────
  const MAX_TRUCKS = 50
  const [trucks, setTrucks] = useState([{ truckNumber: '', driverId: '' }])
  const [truckErrors, setTruckErrors] = useState([])
  const [fuelCardsSubmitting, setFuelCardsSubmitting] = useState(false)
  const [fuelCardsError, setFuelCardsError] = useState('')

  // ── Session validation on mount ────────────────────────────────────────
  useEffect(() => {
    if (!sessionToken) {
      setPageError(t('postSigning.errorNoToken'))
      setPageState('error')
      return
    }
    doValidateSession()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function doValidateSession() {
    try {
      const { ok, data } = await validateSession(sessionToken)

      if (!ok || !data.success || !data.lead) {
        setPageError(data?.message || t('postSigning.errorInvalidSession'))
        setPageState('error')
        return
      }

      const completedStep = parseInt(data.lead.completed_step || data.lead.completedStep || 0, 10)
      const status = (data.lead.status || '').toLowerCase()

      if (completedStep < 10 && status !== 'signed') {
        setPageError(t('postSigning.errorNotSigned'))
        setPageState('error')
        return
      }

      setPageState('ready')

      // ONRAMP leads are app-based — no physical fuel cards; skip to allDone
      if ((data.lead.account || '').toUpperCase() === 'ONRAMP') {
        setPostStep('allDone')
      }

      // Idempotent — marks lead as signed and creates the onboarding task
      completeSigning(sessionToken).catch(() => {})

    } catch {
      setPageError(t('postSigning.errorNetwork'))
      setPageState('error')
    }
  }

  // ── Fuel card helpers ──────────────────────────────────────────────────
  const updateTruck = (idx, field, val) => {
    setTrucks(prev => prev.map((tr, i) => i === idx ? { ...tr, [field]: val } : tr))
    setTruckErrors(prev => {
      const next = [...prev]
      if (next[idx]) next[idx] = { ...next[idx], [field]: undefined }
      return next
    })
  }

  const addTruck = () => {
    if (trucks.length >= MAX_TRUCKS) return
    setTrucks(prev => [...prev, { truckNumber: '', driverId: '' }])
  }

  const removeTruck = (idx) => {
    setTrucks(prev => prev.filter((_, i) => i !== idx))
    setTruckErrors(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSave = async () => {
    const errs = trucks.map(truck => ({
      truckNumber: !truck.truckNumber.trim() ? t('contractSigned.errorTruckRequired') : undefined,
      driverId:    !truck.driverId.trim()    ? t('contractSigned.errorDriverIdRequired') : undefined,
    }))
    const hasErr = errs.some(e => e.truckNumber || e.driverId)
    if (hasErr) { setTruckErrors(errs); return }

    setFuelCardsSubmitting(true)
    setFuelCardsError('')
    try {
      const fuelCards = trucks.map(tr => ({ unit: tr.truckNumber, driver_id: tr.driverId }))
      // sessionToken only — no otpCode available in this flow
      const { ok, data } = await setFuelCards(buildFuelCardsPayload(null, sessionToken, fuelCards))
      if (!ok || data.success === false) {
        setFuelCardsError(data.message || t('contractSigned.errorSaveFailed'))
        return
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setPostStep('allDone')
    } catch {
      setFuelCardsError(t('common.networkError'))
    } finally {
      setFuelCardsSubmitting(false)
    }
  }

  // ── Loading state ──────────────────────────────────────────────────────
  if (pageState === 'loading') {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <svg className="w-8 h-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-gray-500">{t('postSigning.validating')}</p>
        </div>
      </main>
    )
  }

  // ── Error state ────────────────────────────────────────────────────────
  if (pageState === 'error') {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white rounded-2xl shadow-ds-md border border-gray-100 p-10 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('postSigning.errorTitle')}</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">{pageError}</p>
          <a
            href="/#/registration"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-primary
                       border border-primary rounded-md hover:bg-primary hover:text-white
                       transition-colors duration-200"
          >
            {t('postSigning.errorReturnLink')}
          </a>
        </div>
      </main>
    )
  }

  // ── Fuel cards step ────────────────────────────────────────────────────
  if (postStep === 'fuelCards') {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-16">

        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-5">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-ds-h1 font-bold text-gray-900">{t('contractSigned.heading')}</h1>
          <p className="text-gray-500 mt-3 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {t('contractSigned.subheading')}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border-2 border-primary bg-blue-50/40 p-6 sm:p-8">

            <div className="relative mb-5">
              <div className="absolute top-0 right-0 flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <h2 className="text-base font-bold text-gray-900 pr-14">{t('contractSigned.truckBlockTitle')}</h2>
              <p className="text-sm text-gray-600 mt-0.5 leading-relaxed pr-14">{t('contractSigned.truckBlockDesc')}</p>
              <p className="mt-3 text-xs text-blue-700 bg-blue-100 rounded-lg px-3 py-2">
                {t('contractSigned.pinRecommendation')}
              </p>
            </div>

            <div className="space-y-3">
              {trucks.map((truck, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      {t('contractSigned.labelTruckNumber')}
                    </p>
                    <input
                      type="text"
                      value={truck.truckNumber}
                      onChange={e => updateTruck(idx, 'truckNumber', e.target.value)}
                      placeholder={t('contractSigned.placeholderTruckNumber')}
                      className={truckInputClass(truckErrors[idx]?.truckNumber)}
                      maxLength={30}
                    />
                    {truckErrors[idx]?.truckNumber && (
                      <p className="mt-1 text-xs text-red-600">{truckErrors[idx].truckNumber}</p>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      {t('contractSigned.labelDriverId')}
                    </p>
                    <input
                      type="text"
                      value={truck.driverId}
                      onChange={e => updateTruck(idx, 'driverId', e.target.value)}
                      placeholder={t('contractSigned.placeholderDriverId')}
                      className={truckInputClass(truckErrors[idx]?.driverId)}
                      maxLength={20}
                    />
                    {truckErrors[idx]?.driverId && (
                      <p className="mt-1 text-xs text-red-600">{truckErrors[idx].driverId}</p>
                    )}
                  </div>
                  {trucks.length > 1 && (
                    <div className="pt-6">
                      <button
                        type="button"
                        onClick={() => removeTruck(idx)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors focus:outline-none"
                        aria-label="Remove truck"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {trucks.length < MAX_TRUCKS && (
              <button
                type="button"
                onClick={addTruck}
                className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary
                           border border-primary rounded-md hover:bg-primary hover:text-white
                           transition-colors duration-200 cursor-pointer focus:outline-none"
              >
                {t('contractSigned.addTruckBtn')}
              </button>
            )}

            {fuelCardsError && (
              <p className="mt-4 text-sm text-red-600 text-center">{fuelCardsError}</p>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={fuelCardsSubmitting}
              className="mt-6 w-full flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white
                         bg-primary hover:bg-secondary rounded-md shadow-ds-sm
                         transition-colors duration-200 cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-primary/30
                         disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {fuelCardsSubmitting ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {t('contractSigned.saveBtn')}
            </button>
          </div>
        </div>

      </main>
    )
  }

  // ── All done step ──────────────────────────────────────────────────────
  const services = [
    {
      title: t('allDone.service1Title'),
      desc:  t('allDone.service1Desc'),
      href:  'https://itruckingservices.com/services/tire-discounts',
      img:   bannerTires,
    },
    {
      title: t('allDone.service2Title'),
      desc:  t('allDone.service2Desc'),
      href:  'https://itruckingservices.com/services/freight-factoring',
      img:   bannerFactoring,
    },
    {
      title: t('allDone.service3Title'),
      desc:  t('allDone.service3Desc'),
      href:  'https://itruckingservices.com/services/driver-business-support',
      img:   bannerProtection,
    },
  ]

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-16">

      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-ds-h1 font-bold text-gray-900">{t('allDone.heading')}</h1>
        <p className="text-gray-500 mt-3 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          {t('allDone.subheading')}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-ds-sm overflow-hidden">
        <div className="text-center px-6 py-5 bg-blue-600">
          <p className="text-sm font-semibold text-white">{t('allDone.servicesTitle')}</p>
          <p className="text-xs text-blue-100 mt-1">{t('allDone.servicesSubtitle')}</p>
        </div>

        <div className="flex flex-col gap-4 p-4 sm:p-6">
          {services.map((svc) => (
            <a
              key={svc.href}
              href={svc.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col sm:flex-row rounded-xl border border-gray-100 overflow-hidden
                         hover:border-primary hover:shadow-ds-sm transition-all duration-200"
            >
              <div className="w-full sm:w-1/2 sm:flex-shrink-0 overflow-hidden">
                <img src={svc.img} alt={svc.title} className="w-full h-auto sm:h-full sm:object-cover block" />
              </div>
              <div className="w-full sm:w-1/2 p-5 sm:p-8 flex flex-col justify-center">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{svc.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{svc.desc}</p>
                <span className="mt-4 text-xs font-semibold text-primary group-hover:underline">
                  {t('allDone.learnMore')}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

    </main>
  )
}
