import type { Localized } from '@/content/schema';

/**
 * Типографика: короткие предлоги, союзы и артикли не остаются в конце строки,
 * а тире не переносится в начало следующей. Для этого обычный пробел заменяется неразрывным.
 * Применяется ко всем текстам сайта один раз — при загрузке контента и надписей интерфейса.
 */

const NBSP = ' ';

// Слова, которые привязываются к следующему слову.
const RU_SHORT = String.raw`[а-яё]{1,2}|для|без|под|над|при|про|или`;
const EN_SHORT = String.raw`a|an|the|to|of|in|on|at|by|for|and|or|as|if`;
// Частицы, которые, наоборот, привязываются к предыдущему слову.
const RU_PARTICLES = String.raw`же|ли|бы`;

// Перед словом — начало строки, пробел или открывающая скобка/кавычка; после — один обычный пробел.
const BEFORE = String.raw`(?<=^|[\s(«„“"])`;
const SHORT_WORD = new RegExp(`${BEFORE}(${RU_SHORT}|${EN_SHORT}) (?=\\S)`, 'giu');
const PARTICLE = new RegExp(String.raw` (${RU_PARTICLES})(?=[\s.,!?:;)»]|$)`, 'giu');
const DASH = / ([—–]) /g;

export function typograph(text: string): string {
  return text
    .replace(SHORT_WORD, (_, word: string) => `${word}${NBSP}`)
    .replace(PARTICLE, (_, word: string) => `${NBSP}${word}`)
    .replace(DASH, `${NBSP}$1 `);
}

export function typographLocalized(text: Localized): Localized {
  return { ru: typograph(text.ru), en: typograph(text.en) };
}
