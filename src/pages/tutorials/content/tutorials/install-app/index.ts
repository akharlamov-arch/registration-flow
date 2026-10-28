import { defineTutorial } from '@/content/schema';
import coverEn from './cover-en.jpg';
import coverRu from './cover-ru.jpg';
import coverUk from './cover-uk.jpg';
import step2 from './step-2.png';
import step3 from './step-3.png';

export default defineTutorial({
  category: 'pumpprice',
  order: 2,
  title: {
    ru: 'Как скачать и установить приложение PumpPrice?',
    en: 'How to download and install PumpPrice app?',
    uk: 'Як завантажити та встановити додаток PumpPrice?',
  },
  description: {
    ru: 'Для поиска лучших цен на топливо скачивайте и устанавливайте наше приложение PumpPrice',
    en: 'To find the best fuel prices, download and install our PumpPrice app',
    uk: 'Щоб знаходити найкращі ціни на пальне, завантажте та встановіть наш додаток PumpPrice',
  },
  cover: {
    ru: coverRu,
    en: coverEn,
    uk: coverUk,
  },
  readTime: 1,
  body: [
    {
      type: 'steps',
      items: [
        {
          title: {
            ru: 'Скачайте приложение',
            en: 'Download the app',
            uk: 'Завантажте додаток',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Скачайте и установите приложение PumpPrice на ваше устройство',
                en: 'Download and install the PumpPrice app on your device',
                uk: 'Завантажте та встановіть додаток PumpPrice на ваш пристрій',
              },
            },
            {
              type: 'appDownload',
            },
          ],
        },
        {
          title: {
            ru: 'Войдите в приложение',
            en: 'Log in to the app',
            uk: 'Увійдіть у додаток',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Войдите в приложение под своим логином и паролем.',
                en: 'Log in to the app with your username and password.',
                uk: 'Увійдіть у додаток під своїм логіном і паролем.',
              },
            },
            {
              type: 'image',
              src: step2,
            },
            {
              type: 'callout',
              variant: 'hint',
              text: {
                ru: 'Письмо с логином и паролем было выслано вам с адреса **support@pumpprice.co**',
                en: 'The email with your login and password was sent from **support@pumpprice.co**',
                uk: 'Лист із логіном і паролем було надіслано вам з адреси **support@pumpprice.co**',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Найдите в вашей электронной почте самый первый email от "PumpPrice", в нем будут ваши логин и пароль.',
                en: 'Find the first email from "PumpPrice" in your inbox—it contains your username and password.',
                uk: 'Знайдіть у вашій електронній пошті найперший email від "PumpPrice", у ньому будуть ваші логін і пароль.',
              },
            },
          ],
        },
        {
          title: {
            ru: 'Предоставьте доступ к геолокации',
            en: 'Allow location access',
            uk: 'Надайте доступ до геолокації',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Предоставьте доступ к геолокации. Это необходимо для просмотра цен на топливо на вашей карте.',
                en: 'Grant location access. This is necessary to view fuel prices on your map.',
                uk: 'Надайте доступ до геолокації. Це необхідно для перегляду цін на пальне на вашій карті.',
              },
            },
            {
              type: 'image',
              src: step3,
            },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'conclusion',
      text: {
        ru: 'Готово! Теперь вам доступны цены на топливо на всех трак стопах США, доступных в нашей сети.',
        en: 'Done! Now you have access to fuel prices at all US truck stops available in our network.',
        uk: 'Готово! Тепер вам доступні ціни на пальне на всіх тракстопах США, доступних у нашій мережі.',
      },
    },
  ],
});
