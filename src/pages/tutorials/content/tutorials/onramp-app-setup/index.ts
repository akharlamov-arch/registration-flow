import { defineTutorial } from '@/content/schema';
import coverEn from './cover-en.jpg';
import coverRu from './cover-ru.jpg';
import step1 from './step-1.jpg';
import step2 from './step-2.jpg';
import step3 from './step-3.jpg';
import step4 from './step-4.jpg';
import step5 from './step-5.jpg';
import step6 from './step-6.jpg';
import step7 from './step-7.jpg';
import step8 from './step-8.jpg';
import step9 from './step-9.jpg';

export default defineTutorial({
  category: 'onramp-app',
  order: 100,
  title: {
    ru: 'Как скачать и настроить приложение ONRAMP?',
    en: 'How to set up the ONRAMP app?',
  },
  description: {
    ru: 'Для водителей: скачайте приложение ONRAMP FuelPay, войдите и создайте свой пароль',
    en: 'For drivers: download the ONRAMP FuelPay app, sign in and create your own password',
  },
  cover: { ru: coverRu, en: coverEn },
  related: ['onramp-app-fueling', 'onramp-app-troubleshooting'],
  body: [
    {
      type: 'text',
      text: {
        ru: 'Когда флит-менеджер [добавит вас в аккаунт ONRAMP](tutorial:onramp-manage-drivers), вам придёт письмо со ссылками на приложение **ONRAMP FuelPay**. Эти шаги проведут вас от письма до главного экрана приложения.',
        en: 'Once your fleet manager [adds you to the ONRAMP account](tutorial:onramp-manage-drivers), you’ll get an email with links to the **ONRAMP FuelPay** app. These steps take you from that email to the app’s home screen.',
      },
    },
    {
      type: 'steps',
      items: [
        {
          title: { ru: 'Найдите приветственное письмо', en: 'Find the welcome email' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Найдите во входящих письмо **«ONRAMP App ready to install!»** от **mail-admin@onrampcard.com** и откройте его.',
                en: 'Look in your inbox for **“ONRAMP App ready to install!”** from **mail-admin@onrampcard.com**, and open it.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Не видите письма? Проверьте папку «Спам». Его всё равно нет? Попросите флит-менеджера проверить email в вашем профиле водителя.',
                en: 'Don’t see it? Check your Junk or Spam folder. Still nothing? Ask your fleet manager to check the email address on your driver profile.',
              },
            },
            { type: 'image', src: step1 },
          ],
        },
        {
          title: {
            ru: 'Скачайте приложение и узнайте временный пароль',
            en: 'Get the app and your temporary password',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В письме написано, как войти:',
                en: 'The email tells you how to sign in:',
              },
            },
            {
              type: 'bullets',
              items: [
                {
                  ru: '**Логин:** email, на который пришло это письмо',
                  en: '**Username:** the email address this message was sent to',
                },
                {
                  ru: '**Временный пароль:** указан в этом же письме',
                  en: '**Temporary password:** it’s in the same email',
                },
              ],
            },
            {
              type: 'text',
              text: {
                ru: 'Затем нажмите ссылку для своего телефона: **«Android download»** или **«iOS download»**. Откроется Google Play или App Store — там установите **ONRAMP FuelPay**.',
                en: 'Then tap the link for your phone, **“Android download”** or **“iOS download”**. It opens Google Play or the App Store, where you install **ONRAMP FuelPay**.',
              },
            },
            { type: 'image', src: step2 },
          ],
        },
        {
          title: {
            ru: 'Откройте приложение и нажмите «Sign In»',
            en: 'Open the app and tap “Sign In”',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Откройте **ONRAMP FuelPay**. На приветственном экране нажмите **«Sign In»**. Откроется страница входа.',
                en: 'Open **ONRAMP FuelPay**. On the welcome screen, tap **“Sign In”**. The sign-in page opens.',
              },
            },
            { type: 'image', src: step3, size: 'small' },
          ],
        },
        {
          title: { ru: 'Введите email', en: 'Enter your email address' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«Username or email»** введите email, на который пришло приветственное письмо.',
                en: 'In **“Username or email”**, type the email address the welcome email was sent to.',
              },
            },
            { type: 'image', src: step4, size: 'small' },
          ],
        },
        {
          title: { ru: 'Введите временный пароль', en: 'Enter your temporary password' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«Password»** введите временный пароль из письма. Затем нажмите **«Sign In»**.\n\nДальше приложение попросит придумать свой пароль. Так и должно быть.',
                en: 'In **“Password”**, type the temporary password from the email. Then tap **“Sign In”**.\n\nNext, the app asks you to choose your own password. That’s expected.',
              },
            },
            { type: 'image', src: step5, size: 'small' },
          ],
        },
        {
          title: { ru: 'Придумайте свой пароль', en: 'Choose your own password' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Каждый новый водитель видит сообщение **«You need to change your password to activate your account.»** Придумайте здесь свой пароль — и приложение откроется.\n\nВведите новый пароль в поле **«New Password»**, затем ещё раз в **«Confirm password»**. Требования к паролю:',
                en: 'Every new driver sees **“You need to change your password to activate your account.”** Choose your own password here and the app opens.\n\nType a new password in **“New Password”**, then again in **“Confirm password”**. It needs:',
              },
            },
            {
              type: 'checklist',
              items: [
                { ru: 'Не менее 8 символов', en: 'At least 8 characters' },
                {
                  ru: 'Только буквы и цифры, без символов',
                  en: 'Letters and numbers only, no symbols',
                },
                { ru: 'Хотя бы 1 заглавная буква', en: 'At least 1 capital letter' },
              ],
            },
            {
              type: 'text',
              text: {
                ru: 'Затем нажмите **«Submit»**.',
                en: 'Then tap **“Submit”**.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Сохраните новый пароль в надёжном месте — он понадобится при каждом входе.',
                en: 'Save your new password somewhere safe. You’ll use it every time you sign in.',
              },
            },
            { type: 'image', src: step6, size: 'small' },
          ],
        },
        {
          title: { ru: 'Включите вход по биометрии', en: 'Turn on biometrics' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Приложение спросит, хотите ли вы входить по отпечатку пальца или лицу. Рекомендуем нажать **«YES»**.\n\nПриложение время от времени выходит из аккаунта. С биометрией вы снова войдёте по отпечатку пальца или лицу, и вводить пароль каждый раз не придётся.',
                en: 'The app asks if you want to sign in with your fingerprint or face. We recommend tapping **“YES”**.\n\nThe app signs you out from time to time. With biometrics you sign back in with your fingerprint or face, so you don’t have to type your password every time.',
              },
            },
            { type: 'image', src: step7, size: 'small' },
          ],
        },
        {
          title: { ru: 'Готово, вы в приложении', en: 'You’re in' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Это главный экран — **«Home»**. Нажмите **«Find a fuel station»**, чтобы увидеть трак-стопы, где можно заправиться. Два блока ниже показывают, сколько заправок у вас было за последние 7 и 30 дней.',
                en: 'This is the **Home** screen. Tap **“Find a fuel station”** to see the truck stops where you can fuel. The two boxes count your fuel purchases for the last 7 and 30 days.',
              },
            },
            { type: 'image', src: step8, size: 'small' },
          ],
        },
        {
          title: { ru: 'Познакомьтесь с четырьмя вкладками', en: 'Get to know the four tabs' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Панель внизу экрана — это меню приложения:',
                en: 'The bar at the bottom takes you around the app:',
              },
            },
            {
              type: 'bullets',
              items: [
                { ru: '**«Home»** — главный экран со сводкой.', en: '**Home:** your summary.' },
                {
                  ru: '**«FuelPay»** — карта трак-стопов рядом с вами. Отсюда начинается оплата заправки.',
                  en: '**FuelPay:** the map of stations near you. You start paying for fuel here.',
                },
                {
                  ru: '**«Receipts»** — все ваши заправки.',
                  en: '**Receipts:** every fuel purchase you make.',
                },
                {
                  ru: '**«Profile»** — данные вашего аккаунта.',
                  en: '**Profile:** your account details.',
                },
              ],
            },
            { type: 'image', src: step9, size: 'medium' },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'conclusion',
      text: {
        ru: 'Приложение настроено. Дальше — [как заправляться через приложение ONRAMP](tutorial:onramp-app-fueling).',
        en: 'The app is set up. Next, see [how to fuel with the ONRAMP app](tutorial:onramp-app-fueling).',
      },
    },
  ],
});
