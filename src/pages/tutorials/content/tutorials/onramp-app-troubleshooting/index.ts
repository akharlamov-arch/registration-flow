import { defineTutorial } from '@/content/schema';
import coverEn from './cover-en.jpg';
import coverRu from './cover-ru.jpg';
import ohNoError from './step-1.jpg';

export default defineTutorial({
  category: 'onramp-app',
  order: 120,
  title: {
    ru: 'Есть проблемы с приложением ONRAMP?',
    en: 'Got issues with the ONRAMP app?',
  },
  description: {
    ru: 'Решения проблем в приложении ONRAMP, сгруппированные по тому, что пошло не так',
    en: 'Fixes for problems in the ONRAMP app, grouped by what went wrong',
  },
  cover: { ru: coverRu, en: coverEn },
  related: ['onramp-app-fueling', 'onramp-app-setup'],
  body: [
    {
      type: 'text',
      text: {
        ru: 'Здесь собраны решения проблем в приложении ONRAMP, сгруппированные по тому, что пошло не так. Мы добавляем новые, когда водители о них сообщают.',
        en: 'Fixes for problems in the ONRAMP app, grouped by what went wrong. We add new ones as drivers report them.',
      },
    },
    {
      type: 'heading',
      text: { ru: 'Получение кодов для заправки', en: 'Getting your fuel codes' },
    },
    {
      type: 'heading',
      level: 3,
      text: {
        ru: '«Oh no! There was an error processing transaction»',
        en: '“Oh no! There was an error processing transaction”',
      },
    },
    {
      type: 'text',
      text: {
        ru: 'Приложение показывает это сообщение после нажатия **«Next»** на экране **«Confirm your information»** — ещё до того, как выдаст коды. Обычно это значит, что память приложения на телефоне переполнена.\n\nПосле шага 5 · [Открыть «Как заправляться» →](tutorial:onramp-app-fueling)',
        en: 'The app shows this after you tap **“Next”** on **“Confirm your information”**, before it gives you your codes. It usually means the app’s memory on your phone is full.\n\nAfter Step 5 · [Open How to fuel →](tutorial:onramp-app-fueling)',
      },
    },
    { type: 'image', src: ohNoError, size: 'small' },
    {
      type: 'list',
      title: {
        ru: 'Перезапустите приложение, чтобы очистить его память',
        en: 'Restart the app to clear its memory',
      },
      items: [
        { ru: 'Нажмите **«Dismiss»**.', en: 'Tap **“Dismiss”**.' },
        {
          ru: 'Полностью закройте приложение. На iPhone проведите вверх от нижнего края экрана и остановитесь посередине, затем смахните приложение ONRAMP вверх. На Android откройте список недавних приложений и смахните ONRAMP.',
          en: 'Close the app completely. On iPhone, swipe up from the bottom of the screen and stop in the middle, then swipe the ONRAMP app up. On Android, open your recent apps and swipe ONRAMP away.',
        },
        {
          ru: 'Снова откройте приложение и начните заново с шага 1.',
          en: 'Open the app again and start over from Step 1.',
        },
      ],
    },
    {
      type: 'callout',
      variant: 'hint',
      text: {
        ru: 'После перезапуска всё равно видите «Oh no!»? Позвоните нам: [(916) 269-4606](tel:+19162694606) — мы поможем.',
        en: 'Still see “Oh no!” after a restart? Call us at [(916) 269-4606](tel:+19162694606) and we’ll help.',
      },
    },
  ],
});
