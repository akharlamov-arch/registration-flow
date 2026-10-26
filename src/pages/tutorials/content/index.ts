import { buildTutorial, mapTexts } from '@/lib/tutorial';
import { typographLocalized } from '@/lib/typography';
import type { Tutorial, TutorialInput } from './schema';

// Каждая папка в tutorials/ (кроме _template) — один туториал. Регистрировать вручную не нужно.
const modules = import.meta.glob<TutorialInput>(
  ['./tutorials/*/index.ts', '!./tutorials/_template/index.ts'],
  { eager: true, import: 'default' },
);

function slugFromPath(path: string): string {
  const match = /\.\/tutorials\/([^/]+)\/index\.ts$/.exec(path);
  if (!match?.[1]) throw new Error(`Unexpected tutorial path: ${path}`);
  return match[1];
}

export const tutorials: Tutorial[] = Object.entries(modules)
  .map(([path, input]) => buildTutorial(slugFromPath(path), mapTexts(input, typographLocalized)))
  .sort((a, b) => a.order - b.order);

export function getTutorial(slug: string | undefined): Tutorial | undefined {
  return tutorials.find((t) => t.slug === slug);
}
