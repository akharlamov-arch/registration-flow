import { createContext, useContext, useState, useEffect } from 'react'
import translations from '../data/translations'

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('itrucking-lang') || 'en'
  })

  const setLang = (newLang) => {
    if (!translations[newLang]) return
    setLangState(newLang)
    localStorage.setItem('itrucking-lang', newLang)
    document.documentElement.lang = newLang
  }

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const t = (key) => {
    const parts = key.split('.')
    let value = translations[lang]
    for (const part of parts) {
      if (value == null) return key
      value = value[part]
    }
    return value ?? key
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
