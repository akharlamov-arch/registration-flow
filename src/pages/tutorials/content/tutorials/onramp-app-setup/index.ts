import { defineTutorial } from '@/content/schema';
import coverEn from './cover-en.jpg';
import coverRu from './cover-ru.jpg';
import coverUk from './cover-uk.jpg';
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
    uk: 'Як завантажити та налаштувати додаток OnRamp?',
  },
  description: {
    ru: 'Для водителей: скачайте приложение ONRAMP FuelPay, войдите и создайте свой пароль',
    en: 'For drivers: download the ONRAMP FuelPay app, sign in and create your own password',
    uk: 'Для водіїв: завантажте додаток ONRAMP FuelPay, увійдіть і створіть свій пароль',
  },
  cover: { ru: coverRu, en: coverEn, uk: coverUk },
  related: ['onramp-app-fueling', 'onramp-app-troubleshooting'],
  body: [
    {
      type: 'text',
      text: {
        ru: 'Когда флит-менеджер [добавит вас в аккаунт ONRAMP](tutorial:onramp-manage-drivers), вам придёт письмо со ссылками на приложение **ONRAMP FuelPay**. Эти шаги проведут вас от письма до главного экрана приложения.',
        en: 'Once your fleet manager [adds you to the ONRAMP account](tutorial:onramp-manage-drivers), you’ll get an email with links to the **ONRAMP FuelPay** app. These steps take you from that email to the app’s home screen.',
        uk: 'Коли фліт-менеджер [додасть вас до акаунта ONRAMP](tutorial:onramp-manage-drivers), вам прийде лист із посиланнями на додаток **ONRAMP FuelPay**. Ці кроки проведуть вас від листа до головного екрана додатка.',
      },
    },
    {
      type: 'steps',
      items: [
        {
          title: {
            ru: 'Найдите приветственное письмо',
            en: 'Find the welcome email',
            uk: 'Знайдіть вітальний лист',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Найдите во входящих письмо **«ONRAMP App ready to install!»** от **mail-admin@onrampcard.com** и откройте его.',
                en: 'Look in your inbox for **“ONRAMP App ready to install!”** from **mail-admin@onrampcard.com**, and open it.',
                uk: 'Знайдіть у вхідних лист **«ONRAMP App ready to install!»** від **mail-admin@onrampcard.com** і відкрийте його.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Не видите письма? Проверьте папку «Спам». Его всё равно нет? Попросите флит-менеджера проверить email в вашем профиле водителя.',
                en: 'Don’t see it? Check your Junk or Spam folder. Still nothing? Ask your fleet manager to check the email address on your driver profile.',
                uk: 'Не бачите листа? Перевірте папку «Спам». Його все одно немає? Попросіть фліт-менеджера перевірити email у вашому профілі водія.',
              },
            },
            { type: 'image', src: step1 },
          ],
        },
        {
          title: {
            ru: 'Скачайте приложение и узнайте временный пароль',
            en: 'Get the app and your temporary password',
            uk: 'Завантажте додаток і дізнайтеся тимчасовий пароль',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В письме написано, как войти:',
                en: 'The email tells you how to sign in:',
                uk: 'У листі написано, як увійти:',
              },
            },
            {
              type: 'bullets',
              items: [
                {
                  ru: '**Логин:** email, на который пришло это письмо',
                  en: '**Username:** the email address this message was sent to',
                  uk: '**Логін:** email, на який прийшов цей лист',
                },
                {
                  ru: '**Временный пароль:** указан в этом же письме',
                  en: '**Temporary password:** it’s in the same email',
                  uk: '**Тимчасовий пароль:** вказаний у цьому ж листі',
                },
              ],
            },
            {
              type: 'text',
              text: {
                ru: 'Затем нажмите ссылку для своего телефона: **«Android download»** или **«iOS download»**. Откроется Google Play или App Store — там установите **ONRAMP FuelPay**.',
                en: 'Then tap the link for your phone, **“Android download”** or **“iOS download”**. It opens Google Play or the App Store, where you install **ONRAMP FuelPay**.',
                uk: 'Потім натисніть посилання для свого телефона: **«Android download»** або **«iOS download»**. Відкриється Google Play або App Store — там встановіть **ONRAMP FuelPay**.',
              },
            },
            { type: 'image', src: step2 },
          ],
        },
        {
          title: {
            ru: 'Откройте приложение и нажмите «Sign In»',
            en: 'Open the app and tap “Sign In”',
            uk: 'Відкрийте додаток і натисніть «Sign In»',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Откройте **ONRAMP FuelPay**. На приветственном экране нажмите **«Sign In»**. Откроется страница входа.',
                en: 'Open **ONRAMP FuelPay**. On the welcome screen, tap **“Sign In”**. The sign-in page opens.',
                uk: 'Відкрийте **ONRAMP FuelPay**. На вітальному екрані натисніть **«Sign In»**. Відкриється сторінка входу.',
              },
            },
            { type: 'image', src: step3, size: 'small' },
          ],
        },
        {
          title: { ru: 'Введите email', en: 'Enter your email address', uk: 'Введіть email' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«Username or email»** введите email, на который пришло приветственное письмо.',
                en: 'In **“Username or email”**, type the email address the welcome email was sent to.',
                uk: 'У полі **«Username or email»** введіть email, на який прийшов вітальний лист.',
              },
            },
            { type: 'image', src: step4, size: 'small' },
          ],
        },
        {
          title: {
            ru: 'Введите временный пароль',
            en: 'Enter your temporary password',
            uk: 'Введіть тимчасовий пароль',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«Password»** введите временный пароль из письма. Затем нажмите **«Sign In»**.\n\nДальше приложение попросит придумать свой пароль. Так и должно быть.',
                en: 'In **“Password”**, type the temporary password from the email. Then tap **“Sign In”**.\n\nNext, the app asks you to choose your own password. That’s expected.',
                uk: 'У полі **«Password»** введіть тимчасовий пароль із листа. Потім натисніть **«Sign In»**.\n\nДалі додаток попросить придумати свій пароль. Так і має бути.',
              },
            },
            { type: 'image', src: step5, size: 'small' },
          ],
        },
        {
          title: {
            ru: 'Придумайте свой пароль',
            en: 'Choose your own password',
            uk: 'Придумайте свій пароль',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Каждый новый водитель видит сообщение **«You need to change your password to activate your account.»** Придумайте здесь свой пароль — и приложение откроется.\n\nВведите новый пароль в поле **«New Password»**, затем ещё раз в **«Confirm password»**. Требования к паролю:',
                en: 'Every new driver sees **“You need to change your password to activate your account.”** Choose your own password here and the app opens.\n\nType a new password in **“New Password”**, then again in **“Confirm password”**. It needs:',
                uk: 'Кожен новий водій бачить повідомлення **«You need to change your password to activate your account.»** Придумайте тут свій пароль — і додаток відкриється.\n\nВведіть новий пароль у поле **«New Password»**, потім ще раз у **«Confirm password»**. Вимоги до пароля:',
              },
            },
            {
              type: 'checklist',
              items: [
                {
                  ru: 'Не менее 8 символов',
                  en: 'At least 8 characters',
                  uk: 'Не менше 8 символів',
                },
                {
                  ru: 'Только буквы и цифры, без символов',
                  en: 'Letters and numbers only, no symbols',
                  uk: 'Лише літери та цифри, без символів',
                },
                {
                  ru: 'Хотя бы 1 заглавная буква',
                  en: 'At least 1 capital letter',
                  uk: 'Щонайменше 1 велика літера',
                },
              ],
            },
            {
              type: 'text',
              text: {
                ru: 'Затем нажмите **«Submit»**.',
                en: 'Then tap **“Submit”**.',
                uk: 'Потім натисніть **«Submit»**.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Сохраните новый пароль в надёжном месте — он понадобится при каждом входе.',
                en: 'Save your new password somewhere safe. You’ll use it every time you sign in.',
                uk: 'Збережіть новий пароль у надійному місці — він знадобиться під час кожного входу.',
              },
            },
            { type: 'image', src: step6, size: 'small' },
          ],
        },
        {
          title: {
            ru: 'Включите вход по биометрии',
            en: 'Turn on biometrics',
            uk: 'Увімкніть вхід за біометрією',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Приложение спросит, хотите ли вы входить по отпечатку пальца или лицу. Рекомендуем нажать **«YES»**.\n\nПриложение время от времени выходит из аккаунта. С биометрией вы снова войдёте по отпечатку пальца или лицу, и вводить пароль каждый раз не придётся.',
                en: 'The app asks if you want to sign in with your fingerprint or face. We recommend tapping **“YES”**.\n\nThe app signs you out from time to time. With biometrics you sign back in with your fingerprint or face, so you don’t have to type your password every time.',
                uk: 'Додаток запитає, чи хочете ви входити за відбитком пальця або обличчям. Рекомендуємо натиснути **«YES»**.\n\nДодаток час від часу виходить з акаунта. З біометрією ви знову увійдете за відбитком пальця або обличчям, і вводити пароль щоразу не доведеться.',
              },
            },
            { type: 'image', src: step7, size: 'small' },
          ],
        },
        {
          title: { ru: 'Готово, вы в приложении', en: 'You’re in', uk: 'Готово, ви в додатку' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Это главный экран — **«Home»**. Нажмите **«Find a fuel station»**, чтобы увидеть трак-стопы, где можно заправиться. Два блока ниже показывают, сколько заправок у вас было за последние 7 и 30 дней.',
                en: 'This is the **Home** screen. Tap **“Find a fuel station”** to see the truck stops where you can fuel. The two boxes count your fuel purchases for the last 7 and 30 days.',
                uk: 'Це головний екран — **«Home»**. Натисніть **«Find a fuel station»**, щоб побачити тракстопи, де можна заправитися. Два блоки нижче показують, скільки заправок у вас було за останні 7 і 30 днів.',
              },
            },
            { type: 'image', src: step8, size: 'small' },
          ],
        },
        {
          title: {
            ru: 'Познакомьтесь с четырьмя вкладками',
            en: 'Get to know the four tabs',
            uk: 'Ознайомтеся з чотирма вкладками',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Панель внизу экрана — это меню приложения:',
                en: 'The bar at the bottom takes you around the app:',
                uk: 'Панель унизу екрана — це меню додатка:',
              },
            },
            {
              type: 'bullets',
              items: [
                {
                  ru: '**«Home»** — главный экран со сводкой.',
                  en: '**Home:** your summary.',
                  uk: '**«Home»** — головний екран зі зведенням.',
                },
                {
                  ru: '**«FuelPay»** — карта трак-стопов рядом с вами. Отсюда начинается оплата заправки.',
                  en: '**FuelPay:** the map of stations near you. You start paying for fuel here.',
                  uk: '**«FuelPay»** — карта тракстопів поруч із вами. Звідси починається оплата заправки.',
                },
                {
                  ru: '**«Receipts»** — все ваши заправки.',
                  en: '**Receipts:** every fuel purchase you make.',
                  uk: '**«Receipts»** — усі ваші заправки.',
                },
                {
                  ru: '**«Profile»** — данные вашего аккаунта.',
                  en: '**Profile:** your account details.',
                  uk: '**«Profile»** — дані вашого акаунта.',
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
        uk: 'Додаток налаштовано. Далі — [як заправлятися через додаток ONRAMP](tutorial:onramp-app-fueling).',
      },
    },
  ],
});
