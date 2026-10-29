import { defineTutorial } from '@/content/schema';
import coverEn from './cover-en.jpg';
import coverRu from './cover-ru.jpg';
import coverUk from './cover-uk.jpg';
import ohNoError from './step-1.jpg';

export default defineTutorial({
  category: 'onramp-app',
  order: 120,
  title: {
    ru: 'Есть проблемы с приложением ONRAMP?',
    en: 'Got issues with the ONRAMP app?',
    uk: 'Є проблеми з додатком OnRamp?',
  },
  description: {
    ru: 'Решения проблем в приложении ONRAMP, сгруппированные по тому, что пошло не так',
    en: 'Fixes for problems in the ONRAMP app, grouped by what went wrong',
    uk: 'Рішення проблем у додатку ONRAMP, згруповані за тим, що пішло не так',
  },
  cover: { ru: coverRu, en: coverEn, uk: coverUk },
  related: ['onramp-app-fueling', 'onramp-app-setup'],
  body: [
    {
      type: 'text',
      text: {
        ru: 'Здесь собраны решения проблем в приложении ONRAMP, сгруппированные по тому, что пошло не так. Мы добавляем новые, когда водители о них сообщают.',
        en: 'Fixes for problems in the ONRAMP app, grouped by what went wrong. We add new ones as drivers report them.',
        uk: 'Тут зібрано рішення проблем у додатку ONRAMP, згруповані за тим, що пішло не так. Ми додаємо нові, коли водії про них повідомляють.',
      },
    },
    {
      type: 'heading',
      text: {
        ru: 'Получение кодов для заправки',
        en: 'Getting your fuel codes',
        uk: 'Отримання кодів для заправки',
      },
    },
    {
      type: 'heading',
      level: 3,
      text: {
        ru: '«Oh no! There was an error processing transaction»',
        en: '“Oh no! There was an error processing transaction”',
        uk: '«Oh no! There was an error processing transaction»',
      },
    },
    {
      type: 'text',
      text: {
        ru: 'Приложение показывает это сообщение после нажатия **«Next»** на экране **«Confirm your information»** — ещё до того, как выдаст коды. Обычно это значит, что память приложения на телефоне переполнена.\n\nПосле шага 5 · [Открыть «Как заправляться» →](tutorial:onramp-app-fueling)',
        en: 'The app shows this after you tap **“Next”** on **“Confirm your information”**, before it gives you your codes. It usually means the app’s memory on your phone is full.\n\nAfter Step 5 · [Open How to fuel →](tutorial:onramp-app-fueling)',
        uk: 'Додаток показує це повідомлення після натискання **«Next»** на екрані **«Confirm your information»** — ще до того, як видасть коди. Зазвичай це означає, що пам’ять додатка на телефоні переповнена.\n\nПісля кроку 5 · [Відкрити «Як заправлятися» →](tutorial:onramp-app-fueling)',
      },
    },
    { type: 'image', src: ohNoError, size: 'small' },
    {
      type: 'list',
      title: {
        ru: 'Перезапустите приложение, чтобы очистить его память',
        en: 'Restart the app to clear its memory',
        uk: 'Перезапустіть додаток, щоб очистити його пам’ять',
      },
      items: [
        { ru: 'Нажмите **«Dismiss»**.', en: 'Tap **“Dismiss”**.', uk: 'Натисніть **«Dismiss»**.' },
        {
          ru: 'Полностью закройте приложение. На iPhone проведите вверх от нижнего края экрана и остановитесь посередине, затем смахните приложение ONRAMP вверх. На Android откройте список недавних приложений и смахните ONRAMP.',
          en: 'Close the app completely. On iPhone, swipe up from the bottom of the screen and stop in the middle, then swipe the ONRAMP app up. On Android, open your recent apps and swipe ONRAMP away.',
          uk: 'Повністю закрийте додаток. На iPhone проведіть угору від нижнього краю екрана й зупиніться посередині, потім змахніть додаток ONRAMP угору. На Android відкрийте список нещодавніх додатків і змахніть ONRAMP.',
        },
        {
          ru: 'Снова откройте приложение и начните заново с шага 1.',
          en: 'Open the app again and start over from Step 1.',
          uk: 'Знову відкрийте додаток і почніть спочатку з кроку 1.',
        },
      ],
    },
    {
      type: 'callout',
      variant: 'hint',
      text: {
        ru: 'После перезапуска всё равно видите «Oh no!»? Позвоните нам: [(916) 269-4606](tel:+19162694606) — мы поможем.',
        en: 'Still see “Oh no!” after a restart? Call us at [(916) 269-4606](tel:+19162694606) and we’ll help.',
        uk: 'Після перезапуску все одно бачите «Oh no!»? Зателефонуйте нам: [(916) 269-4606](tel:+19162694606) — ми допоможемо.',
      },
    },
  ],
});
