import { defineTutorial } from '@/content/schema';
import coverEn from './cover-en.jpg';
import coverRu from './cover-ru.jpg';
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
  },
  description: {
    ru: 'От приветственного письма до панели FleetApp: вход с временным паролем и создание своего пароля',
    en: 'From the welcome email to your FleetApp dashboard: log in with the temporary password and set your own',
  },
  cover: { ru: coverRu, en: coverEn },
  body: [
    {
      type: 'text',
      text: {
        ru: 'Мы открыли для вас аккаунт ONRAMP. Эти шаги проведут вас от приветственного письма до панели FleetApp с вашим собственным паролем.',
        en: 'We’ve opened an ONRAMP account for you. These steps take you from the welcome email to your FleetApp dashboard, with your own password.',
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
                ru: 'Найдите письмо от **mail-admin@onrampcard.com** с темой **«Welcome to ONRAMP»**. Оно приходит на email, на который мы зарегистрировали ваш аккаунт.',
                en: 'Find the email from **mail-admin@onrampcard.com** with the subject **“Welcome to ONRAMP”**. It goes to the email address we set your account up with.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Нет во входящих? Проверьте папку «Спам».',
                en: 'Not in your inbox? Check your spam or junk folder.',
              },
            },
            { type: 'image', src: step1 },
          ],
        },
        {
          title: { ru: 'Найдите временный пароль', en: 'Find your temporary password' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Откройте письмо. В нём есть всё, что нужно: **временный пароль** и **ссылка на FleetApp**.',
                en: 'Open the email. It has the two things you need: your **temporary password** and the **link to the FleetApp**.',
              },
            },
            { type: 'image', src: step2 },
          ],
        },
        {
          title: { ru: 'Откройте FleetApp', en: 'Open the FleetApp' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Нажмите на ссылку в письме или откройте в браузере [fleetapp.prod.onrampcard.com](https://fleetapp.prod.onrampcard.com/). Откроется страница **«Fleet App Login»**.',
                en: 'Click the link in the email, or go to [fleetapp.prod.onrampcard.com](https://fleetapp.prod.onrampcard.com/) in your browser. You’ll land on the **“Fleet App Login”** page.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Добавьте эту страницу в закладки — теперь вы будете входить через неё.',
                en: 'Bookmark this page. It’s where you’ll log in from now on.',
              },
            },
            { type: 'image', src: step3 },
          ],
        },
        {
          title: { ru: 'Введите email', en: 'Enter your email' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«Email»** введите адрес, на который пришло приветственное письмо.',
                en: 'In the **“Email”** field, type the address the welcome email was sent to.',
              },
            },
            { type: 'image', src: step4 },
          ],
        },
        {
          title: { ru: 'Войдите с временным паролем', en: 'Log in with the temporary password' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«Password»** введите временный пароль из письма. Затем нажмите **«Login»**.',
                en: 'In the **“Password”** field, type the temporary password from the email. Then click **“Login”**.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Нажмите на значок глаза, чтобы проверить, что вы ввели.',
                en: 'Click the eye icon to check what you typed.',
              },
            },
            { type: 'image', src: step5 },
          ],
        },
        {
          title: { ru: 'Начните смену пароля', en: 'Start your password reset' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'При первом входе откроется окно **«Reset Password»**. Его нужно заполнить, прежде чем пользоваться приложением.\n\nВ поле **«Current Password»** ещё раз введите временный пароль.',
                en: 'The first time you log in, a **“Reset Password”** window opens. You need to finish it before you can use the app.\n\nIn **“Current Password”**, type the temporary password again.',
              },
            },
            { type: 'image', src: step6 },
          ],
        },
        {
          title: { ru: 'Придумайте свой пароль', en: 'Choose your own password' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Введите новый пароль в поле **«New Password»**, затем ещё раз в **«Confirm New Password»**. Требования к паролю:',
                en: 'Type your new password in **“New Password”**, then again in **“Confirm New Password”**. It needs:',
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
                ru: 'Затем нажмите **«Reset Password»**.',
                en: 'Then click **“Reset Password”**.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Сохраните новый пароль в надёжном месте — он понадобится при каждом входе.',
                en: 'Save your new password somewhere safe. You’ll use it every time you log in.',
              },
            },
            { type: 'image', src: step7Filled },
            {
              type: 'callout',
              variant: 'hint',
              text: {
                ru: 'Видите красную рамку? Значит, поле «Confirm New Password» осталось пустым. Введите новый пароль ещё раз — точно так же.',
                en: 'Seeing a red box? “Confirm New Password” is still empty. Type your new password there a second time, exactly the same.',
              },
            },
            { type: 'image', src: step7ConfirmMissing },
          ],
        },
        {
          title: { ru: 'Готово, вы в системе', en: 'You’re in' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Это ваша панель FleetApp. Вверху — **кредитный лимит**, **баланс** и **доступные средства**.\n\nЧерез меню слева можно добавлять водителей, устанавливать лимиты и смотреть транзакции.',
                en: 'This is your FleetApp dashboard. Your **credit limit**, **balance** and **available funds** are along the top.\n\nUse the menu on the left to add drivers, set limits and check transactions.',
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
      },
    },
  ],
});
