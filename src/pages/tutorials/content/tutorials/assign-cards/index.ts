import { defineTutorial } from '@/content/schema';
import coverEn from './cover-en.png';
import coverRu from './cover-ru.png';
import step1 from './step-1.jpg';
import step2 from './step-2.png';
import step3 from './step-3.png';
import step4 from './step-4.png';

export default defineTutorial({
  category: 'pumpprice',
  order: 6,
  title: {
    ru: 'Как привязывать созданных пользователей к конкретным картам и назначать им названия?',
    en: 'How to assign created users to specific cards and name them?',
  },
  description: {
    ru: 'Следуйте этой простой инструкции, чтобы привязать пользователя/юзера к конкретной карте.',
    en: 'Follow this simple guide to assign a user to a specific card.',
  },
  cover: {
    ru: coverRu,
    en: coverEn,
  },
  readTime: 2,
  body: [
    {
      type: 'steps',
      items: [
        {
          title: {
            ru: 'Войдите в систему',
            en: 'Log in to the system',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Войдите в систему на портале **PumpPrice** по ссылке: [pumpprice.co](https://www.pumpprice.co/users/sign_in) и введите свой логин и пароль, которые были высланы вам на email при регистрации профиля',
                en: 'Log in to the **PumpPrice** Portal at: [pumpprice.co](https://www.pumpprice.co/users/sign_in) and enter your login and password that were sent to your email when your profile was registered',
              },
            },
            {
              type: 'image',
              src: step1,
            },
            {
              type: 'callout',
              variant: 'hint',
              text: {
                ru: 'Письмо с логином и паролем было выслано вам с адреса **support@pumpprice.co**',
                en: 'The email with your login and password was sent from **support@pumpprice.co**',
              },
            },
          ],
        },
        {
          title: {
            ru: 'Перейдите в раздел Fuel Cards',
            en: 'Go to the Fuel Cards section',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'На главной странице "Dashboard" вашего аккаунта перейдите в раздел "Fuel Cards".',
                en: 'On your account Dashboard page, go to the "Fuel Cards" section.',
              },
            },
            {
              type: 'image',
              src: step2,
            },
          ],
        },
        {
          title: {
            ru: 'Откройте настройки необходимой карты',
            en: 'Open card details',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В появившемся окне напротив необходимой карты нажмите на иконку "view"',
                en: 'In the window that appears, click the "view" icon next to the desired card',
              },
            },
            {
              type: 'image',
              src: step3,
            },
          ],
        },
        {
          title: {
            ru: 'Привяжите пользователя и назначьте имя карте',
            en: 'Assign user and set card name',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В первом пункте "Assign to Driver" выберите пользователя, которому передали данную карту, и во втором пункте "Set a Card Nickname" установите имя карты. Например: "TR 01 Company Name". После этого нажмите кнопку "сохранить".',
                en: 'In the first field "Assign to Driver" select the user who was given this card, and in the second field "Set a Card Nickname" set the card name. For example: "TR 01 Company Name". Then click the "save" button.',
              },
            },
            {
              type: 'image',
              src: step4,
            },
            {
              type: 'callout',
              variant: 'hint',
              text: {
                ru: 'Пользователь сможет видеть свои транзакции по данной карте через приложение PumpPrice',
                en: 'The user will be able to see their transactions for this card through the PumpPrice app',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'conclusion',
      text: {
        ru: 'Готово! Вы успешно привязали карту к пользователю в вашем аккаунте PumpPrice.',
        en: 'Done! You have successfully assigned the card to a user in your PumpPrice account.',
      },
    },
  ],
});
