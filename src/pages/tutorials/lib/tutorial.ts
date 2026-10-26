import type { Block, Localized, Tutorial, TutorialInput } from '@/content/schema';

const WORDS_PER_MINUTE = 180;

/** Количество основных шагов (дополнительные разделы variant: 'secondary' не считаются). */
export function countSteps(body: Block[]): number {
  return body
    .filter((block) => block.type === 'steps' && block.variant !== 'secondary')
    .reduce((sum, block) => sum + (block.type === 'steps' ? block.items.length : 0), 0);
}

/** Все локализованные тексты туториала — для оценки времени чтения и проверок контента. */
export function collectTexts(
  tutorial: Pick<TutorialInput, 'title' | 'description' | 'badges' | 'body'>,
) {
  const texts: Localized[] = [tutorial.title, tutorial.description, ...(tutorial.badges ?? [])];
  const visit = (blocks: Block[]) => {
    for (const block of blocks) {
      switch (block.type) {
        case 'text':
        case 'callout':
        case 'heading':
          texts.push(block.text);
          break;
        case 'list':
          if (block.title) texts.push(block.title);
          texts.push(...block.items);
          break;
        case 'checklist':
        case 'bullets':
          texts.push(...block.items);
          break;
        case 'steps':
          if (block.title) texts.push(block.title);
          if (block.description) texts.push(block.description);
          for (const step of block.items) {
            texts.push(step.title);
            visit(step.blocks);
          }
          break;
        case 'image':
          if (block.alt) texts.push(block.alt);
          break;
        case 'appDownload':
          break;
      }
    }
  };
  visit(tutorial.body);
  return texts;
}

/** Копия туториала, где каждый локализованный текст пропущен через `map` (картинки не трогаются). */
export function mapTexts(input: TutorialInput, map: (text: Localized) => Localized): TutorialInput {
  const mapBlock = <B extends Block>(block: B): B => {
    switch (block.type) {
      case 'text':
      case 'callout':
      case 'heading':
        return { ...block, text: map(block.text) };
      case 'list':
        return {
          ...block,
          title: block.title && map(block.title),
          items: block.items.map(map),
        };
      case 'checklist':
      case 'bullets':
        return { ...block, items: block.items.map(map) };
      case 'steps':
        return {
          ...block,
          title: block.title && map(block.title),
          description: block.description && map(block.description),
          items: block.items.map((step) => ({
            title: map(step.title),
            blocks: step.blocks.map(mapBlock),
          })),
        };
      case 'image':
        return { ...block, alt: block.alt && map(block.alt) };
      case 'appDownload':
        return block;
    }
  };
  return {
    ...input,
    title: map(input.title),
    description: map(input.description),
    badges: input.badges?.map(map),
    body: input.body.map(mapBlock),
  };
}

export function estimateReadTime(input: TutorialInput): number {
  const words = collectTexts(input)
    .map((text) => text.ru.split(/\s+/).filter(Boolean).length)
    .reduce((a, b) => a + b, 0);
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function buildTutorial(slug: string, input: TutorialInput): Tutorial {
  return {
    ...input,
    slug,
    stepsCount: countSteps(input.body),
    readTime: input.readTime ?? estimateReadTime(input),
  };
}
