import { useNavigate } from 'react-router-dom'
import { useI18n } from '../context/I18nContext'

// Placeholder data — replace with real data from backend/context
const PLACEHOLDER = {
  firstName: 'Michael',
  lastName: 'Torres',
  email: 'michael.torres@translogixfreight.com',
  phone: '+1 (916) 555-0184',
  accountType: 'Business',
  companyName: 'TransLogix Freight LLC',
  businessType: 'LLC',
  companyTitle: 'Owner / Operator',
  companyTrucks: '12',
  companyDOT: '3847291',
  companyMC: 'MC-920184',
  usesFuelProgram: 'Yes',
}

function Row({ label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500 shrink-0 w-40">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right">{value}</span>
    </div>
  )
}

export default function AccountReview() {
  const { t } = useI18n()
  const navigate = useNavigate()

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-16">

      {/* Heading */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-5">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-ds-h1 font-bold text-gray-900">
          {t('accountReview.heading')}
        </h1>
        <p className="text-gray-500 mt-3 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
          {t('accountReview.subheading')}
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-5">

        {/* Data card */}
        <div className="bg-white rounded-2xl shadow-ds-md border border-gray-100 p-6 sm:p-8">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            {t('accountReview.sectionContact')}
          </h2>
          <Row label={t('accountReview.labelName')}        value={`${PLACEHOLDER.firstName} ${PLACEHOLDER.lastName}`} />
          <Row label={t('accountReview.labelEmail')}       value={PLACEHOLDER.email} />
          <Row label={t('accountReview.labelPhone')}       value={PLACEHOLDER.phone} />
          <Row label={t('accountReview.labelAccountType')} value={PLACEHOLDER.accountType} />

          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-4">
            {t('accountReview.sectionBusiness')}
          </h2>
          <Row label={t('accountReview.labelCompany')}      value={PLACEHOLDER.companyName} />
          <Row label={t('accountReview.labelBizType')}      value={PLACEHOLDER.businessType} />
          <Row label={t('accountReview.labelTitle')}        value={PLACEHOLDER.companyTitle} />
          <Row label={t('accountReview.labelTrucks')}       value={PLACEHOLDER.companyTrucks} />
          <Row label={t('accountReview.labelDOT')}          value={PLACEHOLDER.companyDOT} />
          <Row label={t('accountReview.labelMC')}           value={PLACEHOLDER.companyMC} />
          <Row label={t('accountReview.labelFuel')}         value={PLACEHOLDER.usesFuelProgram} />
        </div>

        {/* Bank match notice */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <p className="text-sm text-blue-800 leading-relaxed">
            {t('accountReview.bankNotice')}
          </p>
        </div>

        {/* Error contact warning */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-sm text-amber-800 leading-relaxed">
            {t('accountReview.errorNotice')}{' '}
            <a href="tel:+19162694606" className="font-semibold whitespace-nowrap hover:underline">
              (916) 269-4606
            </a>
          </p>
        </div>

        {/* Continue button */}
        <button
          type="button"
          onClick={() => navigate('/registration')}
          className="w-full flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white
                     bg-primary hover:bg-secondary rounded-xl shadow-ds-sm
                     transition-colors duration-200 cursor-pointer
                     focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {t('accountReview.continueBtn')}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>

      </div>
    </main>
  )
}
