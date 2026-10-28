import type { Lang, LocalizedOrShared } from '@/content/schema';

/**
 * Возвращает значение для языка; общее для всех языков значение отдаётся как есть.
 * Нет значения для uk (например, обложки) — отдаётся ru.
 */
export function localize<T>(value: LocalizedOrShared<T>, lang: Lang): T {
  if (typeof value === 'object' && value !== null && 'ru' in value && 'en' in value) {
    const localized = value as Record<Lang, T>;
    return localized[lang] ?? localized.ru;
  }
  return value as T;
}
