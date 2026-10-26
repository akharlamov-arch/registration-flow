/*
 * Шаблон туториала.
 * 1. Скопируйте папку _template и назовите её адресом туториала: например, fuel-limits
 *    (страница будет /tutorials/fuel-limits).
 * 2. Положите картинки в эту же папку и подключите их через import (см. закомментированные строки).
 * 3. Заполните поля ниже. TypeScript подскажет, если что-то пропущено или написано с ошибкой.
 * 4. Запустите `npm test` — тесты проверят переводы, категории и ссылки на другие туториалы.
 */
import { defineTutorial } from '@/content/schema';
// import coverRu from './cover-ru.png';
// import coverEn from './cover-en.png';
// import step1 from './step-1.png';

export default defineTutorial({
  category: 'pumpprice', // pumpprice | onramp | onramp-app | efs-cards | tire-discount (см. src/content/categories.ts)
  order: 100, // место в списке: меньше — выше
  title: { ru: 'Название туториала', en: 'Tutorial title' },
  description: { ru: 'Короткое описание для карточки', en: 'Short description for the card' },
  // cover: { ru: coverRu, en: coverEn }, // или одна картинка: cover: coverRu
  icon: '📘', // показывается на карточке, если нет обложки
  // badges: [{ ru: 'Только предоплата', en: 'Prepay only' }], // дополнительный оранжевый бейдж рядом с категорией
  body: [
    {
      type: 'text',
      text: {
        ru: 'Вступление. Можно **выделить жирным**, вставить [ссылку](https://itrucking.pro/) или сослаться на [другой туториал](tutorial:ifta-report).',
        en: 'Intro. You can use **bold**, add a [link](https://itrucking.pro/) or point to [another tutorial](tutorial:ifta-report).',
      },
    },
    {
      type: 'steps',
      items: [
        {
          title: { ru: 'Первый шаг', en: 'First step' },
          blocks: [
            { type: 'text', text: { ru: 'Что сделать.', en: 'What to do.' } },
            // { type: 'image', src: step1 },
            { type: 'callout', variant: 'hint', text: { ru: 'Подсказка.', en: 'Hint.' } },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'conclusion',
      text: { ru: 'Итог.', en: 'Summary.' },
    },
  ],
});
