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

export default defineTutorial({
  category: 'onramp',
  order: 60,
  title: {
    ru: 'Как добавить флит-менеджера?',
    en: 'How to add a fleet manager?',
  },
  description: {
    ru: 'Посмотрите, кто может входить в аккаунт ONRAMP вашей компании, и добавьте нового флит-менеджера',
    en: 'See who can sign in to your company’s ONRAMP account and add a new fleet manager',
  },
  cover: { ru: coverRu, en: coverEn },
  body: [
    {
      type: 'text',
      text: {
        ru: 'Флит-менеджеры — это люди, которые могут входить в аккаунт ONRAMP вашей компании. В этой инструкции показано, где посмотреть ваших флит-менеджеров и как добавить нового.',
        en: 'Fleet managers are the people who can sign in to your company’s ONRAMP account. This guide shows where to see your fleet managers and how to add a new one.',
      },
    },
    {
      type: 'steps',
      items: [
        {
          title: { ru: 'Откройте раздел «Fleet Managers»', en: 'Open Fleet Managers' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В меню слева нажмите **«Fleet Managers»**. На этой странице перечислены все аккаунты с доступом флит-менеджера к вашей компании — с именем, email и статусом.',
                en: 'In the menu on the left, click **“Fleet Managers”**. This page lists every account with fleet manager access to your company, with its name, email and status.',
              },
            },
            { type: 'image', src: step1 },
          ],
        },
        {
          title: {
            ru: 'Откройте форму «Add Fleet Manager»',
            en: 'Open the Add Fleet Manager form',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Чтобы добавить флит-менеджера, нажмите **«+ Add Fleet Manager»** в правом верхнем углу. Откроется форма **«Add Fleet Manager»**. В следующих шагах мы пройдём её поле за полем.',
                en: 'To add a fleet manager, click **“+ Add Fleet Manager”** in the top right corner. The **“Add Fleet Manager”** form opens. The next steps go through it field by field.',
              },
            },
            { type: 'image', src: step2 },
          ],
        },
        {
          title: { ru: 'Введите имя', en: 'Enter the name' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Введите имя и фамилию флит-менеджера в поля **«First Name»** и **«Last Name»**.',
                en: 'Enter the fleet manager’s **“First Name”** and **“Last Name”**.',
              },
            },
            { type: 'image', src: step3 },
          ],
        },
        {
          title: { ru: 'Введите номер телефона', en: 'Enter the phone number' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«Phone Number»** введите номер мобильного телефона флит-менеджера. Его последние 4 цифры понадобятся для пароля в шаге 6.',
                en: 'In **“Phone Number”**, enter the fleet manager’s mobile number. You will need its last 4 digits for the password in Step 6.',
              },
            },
            { type: 'image', src: step4 },
          ],
        },
        {
          title: { ru: 'Введите email', en: 'Enter the email' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«Email»** введите email самого флит-менеджера. С ним он будет входить в ONRAMP.',
                en: 'In **“Email”**, enter the fleet manager’s own email address. They will use it to sign in to ONRAMP.',
              },
            },
            { type: 'image', src: step5 },
          ],
        },
        {
          title: { ru: 'Задайте временный пароль', en: 'Set a temporary password' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«Password»** введите временный пароль. Подойдёт любой, но, пожалуйста, используйте **последние 4 цифры номера телефона флит-менеджера** — так же, как для водителей. Менеджер сменит этот пароль при первом входе.',
                en: 'In **“Password”**, enter a temporary password. Any password will work, but please use the **last 4 digits of the fleet manager’s phone number**, the same as for drivers. The fleet manager changes this password the first time they sign in.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Пример: номер телефона — (916) 555-0147, значит, временный пароль — 0147.',
                en: 'Example: the phone number is (916) 555-0147, so the temporary password is 0147.',
              },
            },
            { type: 'image', src: step6 },
          ],
        },
        {
          title: { ru: 'Отправьте форму', en: 'Submit the form' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Проверьте данные и нажмите **«Submit»**. Новый флит-менеджер появится в списке **«Fleet Managers»**.',
                en: 'Check the details and click **“Submit”**. The new fleet manager appears in the **“Fleet Managers”** list.',
              },
            },
            { type: 'image', src: step7 },
          ],
        },
      ],
    },
  ],
});
