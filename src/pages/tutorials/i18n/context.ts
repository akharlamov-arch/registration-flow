import { createContext, useContext } from 'react';
import type { Lang } from '@/content/schema';
import type { Messages } from './messages';

export interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Messages;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

export function useI18n(): I18nContextValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside <LanguageProvider>');
  return value;
}
