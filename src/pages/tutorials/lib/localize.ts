import type { Lang, LocalizedOrShared } from '@/content/schema';

/** Возвращает значение для языка; общее для всех языков значение отдаётся как есть. */
export function localize<T>(value: LocalizedOrShared<T>, lang: Lang): T {
  if (typeof value === 'object' && value !== null && 'ru' in value && 'en' in value) {
    return (value as Record<Lang, T>)[lang];
  }
  return value as T;
}
