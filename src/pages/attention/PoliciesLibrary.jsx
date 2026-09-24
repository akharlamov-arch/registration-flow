// Library of internal documents and how they have changed over time.
//
// Not a step: nothing here is asked of the customer. It exists so a customer
// who is told "our terms have changed" can see exactly what changed and when,
// and read any earlier revision they agreed to.

import { useI18n } from '../../context/I18nContext'
import { useState } from 'react'

function formatDate(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function DocIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
}

function PolicyCard({ policy }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const older = policy.history.slice(1)

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-ds-sm p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <span className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 text-gray-500 flex items-center justify-center shrink-0">
          <DocIcon />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <h3 className="text-base font-semibold text-gray-900">{policy.title}</h3>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded px-1.5 py-0.5">
              v{policy.current_version}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {t('attention.policies.inEffect')} {formatDate(policy.effective_date)}
          </p>

          {policy.history[0]?.summary && (
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{policy.history[0].summary}</p>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
            <a
              href={policy.history[0]?.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-primary hover:text-secondary transition-colors duration-ds-normal"
            >
              {t('attention.policies.readCurrent')}
            </a>

            {older.length > 0 && (
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors duration-ds-normal"
              >
                {open ? t('attention.policies.hide') : `${t('attention.policies.earlier')} (${older.length})`}
              </button>
            )}
          </div>

          {open && older.length > 0 && (
            <ol className="mt-4 border-l border-gray-200 pl-4 space-y-4">
              {older.map((rev) => (
                <li key={rev.version}>
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-sm font-medium text-gray-700">v{rev.version}</span>
                    <span className="text-xs text-gray-400">{formatDate(rev.effective_date)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{rev.summary}</p>
                  <a
                    href={rev.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-xs font-medium text-gray-500 hover:text-gray-900 underline underline-offset-2 mt-1"
                  >
                    {t('attention.policies.readThis')}
                  </a>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  )
}

export default function PoliciesLibrary({ policies, loading }) {
  const { t } = useI18n()
  return (
    <div className="space-y-4">
      <header className="mb-2">
        <h2 className="text-xl font-bold text-gray-900">{t('attention.policies.heading')}</h2>
        <p className="text-sm text-gray-500 mt-1 max-w-2xl">{t('attention.policies.blurb')}</p>
      </header>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-28 bg-white rounded-2xl border border-gray-200" />
          <div className="h-28 bg-white rounded-2xl border border-gray-200" />
        </div>
      ) : policies.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-ds-sm p-6">
          <p className="text-sm text-gray-500">{t('attention.policies.empty')}</p>
        </div>
      ) : (
        policies.map((p) => <PolicyCard key={p.id} policy={p} />)
      )}
    </div>
  )
}
