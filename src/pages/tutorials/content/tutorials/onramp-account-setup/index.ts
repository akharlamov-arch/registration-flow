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
import step7ConfirmMissing from './step-7-confirm-missing.jpg';
import step7Filled from './step-7-filled.jpg';
import step8 from './step-8.jpg';

export default defineTutorial({
  category: 'onramp',
  order: 10,
  title: {
    ru: 'Как настроить аккаунт флит-менеджера на портале ONRAMP?',
    en: 'How to set up your ONRAMP fleet manager account?',
    uk: 'Як налаштувати акаунт фліт-менеджера на порталі OnRamp?',
  },
  description: {
    ru: 'От приветственного письма до панели FleetApp: вход с временным паролем и создание своего пароля',
    en: 'From the welcome email to your FleetApp dashboard: log in with the temporary password and set your own',
    uk: 'Від вітального листа до панелі FleetApp: вхід із тимчасовим паролем і створення власного пароля',
  },
  cover: { ru: coverRu, en: coverEn, uk: coverUk },
  body: [
    {
      type: 'text',
      text: {
        ru: 'Мы открыли для вас аккаунт ONRAMP. Эти шаги проведут вас от приветственного письма до панели FleetApp с вашим собственным паролем.',
        en: 'We’ve opened an ONRAMP account for you. These steps take you from the welcome email to your FleetApp dashboard, with your own password.',
        uk: 'Ми відкрили для вас акаунт ONRAMP. Ці кроки проведуть вас від вітального листа до панелі FleetApp із вашим власним паролем.',
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
                ru: 'Найдите письмо от **mail-admin@onrampcard.com** с темой **«Welcome to ONRAMP»**. Оно приходит на email, на который мы зарегистрировали ваш аккаунт.',
                en: 'Find the email from **mail-admin@onrampcard.com** with the subject **“Welcome to ONRAMP”**. It goes to the email address we set your account up with.',
                uk: 'Знайдіть лист від **mail-admin@onrampcard.com** з темою **«Welcome to ONRAMP»**. Він приходить на email, на який ми зареєстрували ваш акаунт.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Нет во входящих? Проверьте папку «Спам».',
                en: 'Not in your inbox? Check your spam or junk folder.',
                uk: 'Немає у вхідних? Перевірте папку «Спам».',
              },
            },
            { type: 'image', src: step1 },
          ],
        },
        {
          title: {
            ru: 'Найдите временный пароль',
            en: 'Find your temporary password',
            uk: 'Знайдіть тимчасовий пароль',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Откройте письмо. В нём есть всё, что нужно: **временный пароль** и **ссылка на FleetApp**.',
                en: 'Open the email. It has the two things you need: your **temporary password** and the **link to the FleetApp**.',
                uk: 'Відкрийте лист. У ньому є все, що потрібно: **тимчасовий пароль** і **посилання на FleetApp**.',
              },
            },
            { type: 'image', src: step2 },
          ],
        },
        {
          title: { ru: 'Откройте FleetApp', en: 'Open the FleetApp', uk: 'Відкрийте FleetApp' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Нажмите на ссылку в письме или откройте в браузере [fleetapp.prod.onrampcard.com](https://fleetapp.prod.onrampcard.com/). Откроется страница **«Fleet App Login»**.',
                en: 'Click the link in the email, or go to [fleetapp.prod.onrampcard.com](https://fleetapp.prod.onrampcard.com/) in your browser. You’ll land on the **“Fleet App Login”** page.',
                uk: 'Натисніть на посилання в листі або відкрийте в браузері [fleetapp.prod.onrampcard.com](https://fleetapp.prod.onrampcard.com/). Відкриється сторінка **«Fleet App Login»**.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Добавьте эту страницу в закладки — теперь вы будете входить через неё.',
                en: 'Bookmark this page. It’s where you’ll log in from now on.',
                uk: 'Додайте цю сторінку в закладки — тепер ви входитимете через неї.',
              },
            },
            { type: 'image', src: step3 },
          ],
        },
        {
          title: { ru: 'Введите email', en: 'Enter your email', uk: 'Введіть email' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«Email»** введите адрес, на который пришло приветственное письмо.',
                en: 'In the **“Email”** field, type the address the welcome email was sent to.',
                uk: 'У полі **«Email»** введіть адресу, на яку прийшов вітальний лист.',
              },
            },
            { type: 'image', src: step4 },
          ],
        },
        {
          title: {
            ru: 'Войдите с временным паролем',
            en: 'Log in with the temporary password',
            uk: 'Увійдіть із тимчасовим паролем',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«Password»** введите временный пароль из письма. Затем нажмите **«Login»**.',
                en: 'In the **“Password”** field, type the temporary password from the email. Then click **“Login”**.',
                uk: 'У полі **«Password»** введіть тимчасовий пароль із листа. Потім натисніть **«Login»**.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Нажмите на значок глаза, чтобы проверить, что вы ввели.',
                en: 'Click the eye icon to check what you typed.',
                uk: 'Натисніть на значок ока, щоб перевірити, що ви ввели.',
              },
            },
            { type: 'image', src: step5 },
          ],
        },
        {
          title: {
            ru: 'Начните смену пароля',
            en: 'Start your password reset',
            uk: 'Почніть зміну пароля',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'При первом входе откроется окно **«Reset Password»**. Его нужно заполнить, прежде чем пользоваться приложением.\n\nВ поле **«Current Password»** ещё раз введите временный пароль.',
                en: 'The first time you log in, a **“Reset Password”** window opens. You need to finish it before you can use the app.\n\nIn **“Current Password”**, type the temporary password again.',
                uk: 'Під час першого входу відкриється вікно **«Reset Password»**. Його потрібно заповнити, перш ніж користуватися додатком.\n\nУ полі **«Current Password»** ще раз введіть тимчасовий пароль.',
              },
            },
            { type: 'image', src: step6 },
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
                ru: 'Введите новый пароль в поле **«New Password»**, затем ещё раз в **«Confirm New Password»**. Требования к паролю:',
                en: 'Type your new password in **“New Password”**, then again in **“Confirm New Password”**. It needs:',
                uk: 'Введіть новий пароль у поле **«New Password»**, потім ще раз у **«Confirm New Password»**. Вимоги до пароля:',
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
                ru: 'Затем нажмите **«Reset Password»**.',
                en: 'Then click **“Reset Password”**.',
                uk: 'Потім натисніть **«Reset Password»**.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Сохраните новый пароль в надёжном месте — он понадобится при каждом входе.',
                en: 'Save your new password somewhere safe. You’ll use it every time you log in.',
                uk: 'Збережіть новий пароль у надійному місці — він знадобиться під час кожного входу.',
              },
            },
            { type: 'image', src: step7Filled },
            {
              type: 'callout',
              variant: 'hint',
              text: {
                ru: 'Видите красную рамку? Значит, поле «Confirm New Password» осталось пустым. Введите новый пароль ещё раз — точно так же.',
                en: 'Seeing a red box? “Confirm New Password” is still empty. Type your new password there a second time, exactly the same.',
                uk: 'Бачите червону рамку? Отже, поле «Confirm New Password» залишилося порожнім. Введіть новий пароль ще раз — точно так само.',
              },
            },
            { type: 'image', src: step7ConfirmMissing },
          ],
        },
        {
          title: { ru: 'Готово, вы в системе', en: 'You’re in', uk: 'Готово, ви в системі' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Это ваша панель FleetApp. Вверху — **кредитный лимит**, **баланс** и **доступные средства**.\n\nЧерез меню слева можно добавлять водителей, устанавливать лимиты и смотреть транзакции.',
                en: 'This is your FleetApp dashboard. Your **credit limit**, **balance** and **available funds** are along the top.\n\nUse the menu on the left to add drivers, set limits and check transactions.',
                uk: 'Це ваша панель FleetApp. Угорі — **кредитний ліміт**, **баланс** і **доступні кошти**.\n\nЧерез меню ліворуч можна додавати водіїв, встановлювати ліміти та переглядати транзакції.',
              },
            },
            { type: 'image', src: step8 },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'conclusion',
      text: {
        ru: 'Ваш аккаунт готов. Дальше добавьте водителей, чтобы они могли пользоваться топливной картой.',
        en: 'Your account is ready. Next, add your drivers so they can use the fuel card.',
        uk: 'Ваш акаунт готовий. Далі додайте водіїв, щоб вони могли користуватися паливною карткою.',
      },
    },
  ],
});
