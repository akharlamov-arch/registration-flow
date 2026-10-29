// "Tutorials" on the attention page's overview: one featured article and three
// more, taken from the knowledge base (src/pages/tutorials/content/). Each
// opens that article on #/tutorials/<slug>; "See all" opens the list itself.

import { useNavigate } from 'react-router-dom'
import { useI18n } from '../../context/I18nContext'
import { getTutorial } from '../tutorials/content'
import { messages } from '../tutorials/i18n/messages'
import { localize } from '../tutorials/lib/localize'

const FEATURED_SLUG = 'install-app'
const LIST_SLUGS = ['unit-pin', 'efs-card-block', 'transaction-report']

function ArrowIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  )
}

export default function PortalTutorials() {
  const { t, lang } = useI18n()
  const navigate = useNavigate()
  // The knowledge base is RU/EN/UK (Spanish shows EN) — same mapping as its LanguageProvider.
  const kbLang = lang === 'ru' || lang === 'uk' ? lang : 'en'
  const readTime = (tut) => `${tut.readTime} ${messages[kbLang].readTime}`
  const cover = (tut) => tut.cover && localize(tut.cover, kbLang)

  const featured = getTutorial(FEATURED_SLUG)
  const list = LIST_SLUGS.map(getTutorial).filter(Boolean)
  const href = (slug) => `#/tutorials/${slug}`
  const open = (e, slug) => {
    e.preventDefault()
    navigate(`/tutorials/${slug}`)
  }

  const cardCls = 'bg-white border border-gray-200 shadow-ds-sm overflow-hidden transition-[box-shadow,transform] duration-ds-slow ' +
    'hover:shadow-ds-lg hover:-translate-y-0.5'

  return (
    <section aria-labelledby="tutorials-h" className="mt-8">
      <div className="flex items-baseline justify-between gap-4 mb-3.5">
        <h2 id="tutorials-h" className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
          {t('attention.home.tutorials')}
        </h2>
        <a
          href="#/tutorials"
          onClick={(e) => { e.preventDefault(); navigate('/tutorials') }}
          className="shrink-0 inline-flex items-center gap-1 py-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          {t('attention.home.seeAll')}
          <ArrowIcon className="w-4 h-4" />
        </a>
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] xl:gap-4">
        {featured && (
          <a href={href(featured.slug)} onClick={(e) => open(e, featured.slug)} className={`group flex flex-col rounded-2xl ${cardCls}`}>
            <img
              src={cover(featured)}
              alt=""
              className="w-full aspect-[1200/630] object-cover bg-gray-100"
            />
            <span className="flex-1 flex flex-col gap-1 px-[18px] pt-4 pb-[18px]">
              <span className="text-[17px] font-semibold text-gray-900 leading-snug">{featured.title[kbLang]}</span>
              <span className="text-sm text-gray-500">{featured.description[kbLang]}</span>
              <span className="mt-auto pt-2.5 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                {t('attention.home.readArticle')}
                <ArrowIcon className="w-4 h-4 transition-transform duration-ds-slow group-hover:translate-x-[3px]" />
              </span>
            </span>
          </a>
        )}

        <ul className="grid gap-3 xl:grid-rows-3">
          {list.map((tut) => (
            <li key={tut.slug} className="flex">
              <a
                href={href(tut.slug)}
                onClick={(e) => open(e, tut.slug)}
                className={`w-full flex items-center gap-3.5 p-2.5 rounded-[14px] ${cardCls}`}
              >
                <img
                  src={cover(tut)}
                  alt=""
                  className="w-28 sm:w-32 shrink-0 aspect-[1200/630] object-cover rounded-lg bg-gray-100"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-gray-900 leading-snug line-clamp-3">{tut.title[kbLang]}</span>
                  <span className="block text-xs text-gray-500 mt-[3px]">{readTime(tut)}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
