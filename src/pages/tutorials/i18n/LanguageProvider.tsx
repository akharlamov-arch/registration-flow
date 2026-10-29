import { useMemo, useState, type ReactNode } from 'react';
import { useI18n as useAppI18n } from '../../../context/I18nContext';
import type { Lang } from '@/content/schema';
import { I18nContext } from './context';
import { messages } from './messages';

// В registration-flow язык общий для всего приложения (itrucking-lang, 4 языка),
// а туториалы есть на RU, EN и UK: es показывает EN. Пока посетитель
// нигде не выбрал язык, страница открывается на RU, как оригинал, и ничего не сохраняет.
const LANG_KEY = 'itrucking-lang';

function hasStoredLang(): boolean {
  try {
    return Boolean(localStorage.getItem(LANG_KEY));
  } catch {
    return false;
  }
}

/**
 * Язык страницы. `selected` — код для выпадающего списка в общем Header (en/ru/uk/es),
 * `lang` — язык туториалов (ru/en/uk), `choose` — выбор в Header.
 */
export function usePageLanguage() {
  const { lang: appLang, setLang: setAppLang } = useAppI18n();
  const [chosen, setChosen] = useState(hasStoredLang);
  const selected: string = chosen ? appLang : 'ru';
  const lang: Lang = selected === 'ru' || selected === 'uk' ? selected : 'en';
  const choose = (code: string) => {
    setAppLang(code);
    setChosen(true);
  };
  return { lang, selected, choose };
}

interface LanguageProviderProps {
  lang: Lang;
  setLang: (lang: Lang) => void;
  children: ReactNode;
}

export function LanguageProvider({ lang, setLang, children }: LanguageProviderProps) {
  const value = useMemo(() => ({ lang, setLang, t: messages[lang] }), [lang, setLang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
