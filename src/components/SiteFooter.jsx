// Site footer (SITE-CHROME-01) — the tutorials page's footer
// (now src/pages/tutorials/components/Footer/), rebuilt in
// Tailwind for every other page and translated into all four app languages.

import { createContext, useContext, useEffect } from 'react'
import { useI18n } from '../context/I18nContext'

// The footer is opt-in per page: AppShell (App.jsx) renders it only while the
// current page asks for it through `useSiteFooter`. That lets the customer
// portal keep it off its sign-in screens (ATTENTION-LOGIN-NO-FOOTER-01) and
// show it only once the customer is signed in.
export const SiteFooterContext = createContext(() => {})

export function useSiteFooter(show) {
  const setShown = useContext(SiteFooterContext)
  useEffect(() => {
    setShown(show)
    return () => setShown(false)
  }, [show, setShown])
}

const linkCls = 'block text-[0.938rem] text-gray-500 hover:text-primary transition-colors duration-ds-slow'
const smallCls = 'block mt-1 text-[0.813rem] text-gray-400'
const socialCls = 'flex items-center gap-3 px-5 py-3 rounded-lg font-medium text-white border-2 border-transparent ' +
  'transition-[transform,box-shadow] duration-ds-slow hover:-translate-y-0.5'

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-base font-semibold tracking-[-0.02em] text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  )
}

export default function SiteFooter() {
  const { t } = useI18n()

  // Privacy and Terms have no pages yet — like the tutorials footer, they lead
  // back to the top instead of letting HashRouter route "#" to the lead form.
  const toTop = (e) => {
    e.preventDefault()
    window.scrollTo(0, 0)
  }

  return (
    <footer className="site-footer bg-white border-t border-gray-200 px-8 pt-12 pb-8 font-[Instrument_Sans,sans-serif] leading-[1.7]">
      <div className="max-w-[1400px] mx-auto grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8">
        <Section title={t('footer.contact')}>
          <div className="flex flex-col gap-2.5">
            <a href="tel:+19162694606" className={linkCls}>
              <span>{t('footer.mainPhone')}</span>
              <small className={smallCls}>+1 (916) 269-4606</small>
            </a>
            <a href="tel:+19162694606,3" className={linkCls}>
              <span>{t('footer.accountingPhone')}</span>
              <small className={smallCls}>+1 (916) 269-4606 ext. 3</small>
            </a>
            <a href="tel:+19162340257" className={linkCls}>
              <span>{t('footer.tirePhone')}</span>
              <small className={smallCls}>+1 (916) 234-0257</small>
            </a>
          </div>
        </Section>

        <Section title={t('footer.departments')}>
          <div className="flex flex-col gap-2.5">
            <a href="mailto:info@itruckingservices.com" className={linkCls}>
              <span>{t('footer.general')}</span>
              <small className={smallCls}>info@itruckingservices.com</small>
            </a>
            <a href="mailto:fuel@itrucking.org" className={linkCls}>
              <span>{t('footer.fuel')}</span>
              <small className={smallCls}>fuel@itrucking.org</small>
            </a>
          </div>
        </Section>

        <Section title={t('footer.resources')}>
          <div className="flex flex-col gap-2.5">
            <a href="https://www.itruckingservices.com" target="_blank" rel="noopener noreferrer" className={linkCls}>
              www.itruckingservices.com
            </a>
            <a href="#" onClick={toTop} className={linkCls}>{t('footer.privacy')}</a>
            <a href="#" onClick={toTop} className={linkCls}>{t('footer.terms')}</a>
          </div>
        </Section>

        <Section title={t('footer.address')}>
          <p className="text-[0.938rem] text-gray-500">1229 Pleasant Grove Blvd<br />Roseville, CA 95678</p>
        </Section>

        <Section title={t('footer.social')}>
          <div className="flex flex-col gap-3">
            <a
              href="https://www.instagram.com/itrucking.inc/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${socialCls} bg-[linear-gradient(45deg,#f09433_0%,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888_100%)] hover:shadow-[0_4px_12px_rgba(188,24,136,0.4)]`}
            >
              <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span className="text-[0.938rem]">Instagram</span>
            </a>
            <a
              href="https://www.facebook.com/itruckingservicesinc/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${socialCls} bg-[#1877F2] hover:shadow-[0_4px_12px_rgba(24,119,242,0.4)]`}
            >
              <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-[0.938rem]">Facebook</span>
            </a>
          </div>
        </Section>
      </div>

      <div className="max-w-[1400px] mx-auto mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-400">
        <p>© 2024 <span>{t('footer.copyright')}</span></p>
      </div>
    </footer>
  )
}
