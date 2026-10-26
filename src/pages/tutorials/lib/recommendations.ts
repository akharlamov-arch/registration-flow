import type { Tutorial } from '@/content/schema';

/**
 * Рекомендации к туториалу — только из его категории:
 * 1. явно указанные в `related` (туториалы из других категорий отбрасываются);
 * 2. иначе — следующие по порядку туториалы той же категории (по кругу).
 * Если в категории больше никого нет, рекомендаций нет и блок не показывается.
 * Туториалы с `hideFromRecommendations` предлагаются только через `related`.
 */
export function getRecommendations(current: Tutorial, all: Tutorial[], limit = 2): Tutorial[] {
  const sameCategory = all.filter(
    (t) => t.slug !== current.slug && t.category === current.category,
  );

  if (current.related?.length) {
    return current.related
      .map((slug) => sameCategory.find((t) => t.slug === slug))
      .filter((t): t is Tutorial => t !== undefined)
      .slice(0, limit);
  }

  const candidates = sameCategory.filter((t) => !t.hideFromRecommendations);
  const after = candidates.filter((t) => t.order > current.order);
  const before = candidates.filter((t) => t.order <= current.order);
  return [...after, ...before].slice(0, limit);
}
