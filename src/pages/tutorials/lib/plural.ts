import type { Lang } from '@/content/schema';
import type { Messages } from '@/i18n/messages';

const rules = new Map<Lang, Intl.PluralRules>();

/** «1 шаг», «2 шага», «5 шагов» / «1 step», «2 steps». */
export function pluralizeSteps(count: number, lang: Lang, t: Messages): string {
  let rule = rules.get(lang);
  if (!rule) {
    rule = new Intl.PluralRules(lang);
    rules.set(lang, rule);
  }
  switch (rule.select(count)) {
    case 'one':
      return t.stepsOne;
    case 'few':
      return t.stepsFew;
    default:
      return t.stepsMany;
  }
}
