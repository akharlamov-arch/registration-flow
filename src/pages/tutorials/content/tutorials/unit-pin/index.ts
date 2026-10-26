import { defineTutorial } from '@/content/schema';
import coverEn from './cover-en.png';
import coverRu from './cover-ru.png';
import step1 from './step-1.jpg';
import step2 from './step-2.png';
import step3 from './step-3.png';
import step4 from './step-4.png';
import step5 from './step-5.png';
import step6 from './step-6.png';
import step7 from './step-7.png';
import step8 from './step-8.png';
import step9 from './step-9.png';

export default defineTutorial({
  category: 'pumpprice',
  order: 7,
  title: {
    ru: 'Как установить номер Юнита и PIN вашим топливным картам в приложении PumpPrice? ‼️',
    en: 'How to set unit number and PIN for your fuel cards in PumpPrice app? ‼️',
  },
  description: {
    ru: 'Следуйте этой простой инструкции, для установки номера Юнита и PIN для ваших топливных карт. (функционал доступен для компаний с 10+ траками)',
    en: 'Follow this simple guide to set Unit number and PIN for your fuel cards. (available for companies with 10+ trucks)',
  },
  cover: {
    ru: coverRu,
    en: coverEn,
  },
  readTime: 7,
  hideFromRecommendations: true,
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
                ru: 'Войдите в систему на портале PumpPrice по ссылке: [pumpprice.co](https://www.pumpprice.co/users/sign_in) и введите свой логин и пароль, которые были высланы вам на email при регистрации профиля. Войдите со своего аккаунта "Fleet Administrator"',
                en: 'Log in to the PumpPrice Portal at: [pumpprice.co](https://www.pumpprice.co/users/sign_in) and enter your login and password that were sent to your email when your profile was registered. Use your "Fleet Administrator" account',
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
                ru: 'Найдите раздел "Fuel Cards" и нажмите на него',
                en: 'Find the "Fuel Cards" section and click on it',
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
            ru: 'Выберите карту',
            en: 'Select a card',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Выберите карту, которую вы хотите настроить/изменить и нажмите напротив неё на иконку "View"',
                en: 'Select the card you want to configure/modify and click the "View" icon next to it',
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
            ru: 'Откройте управление EFS картой',
            en: 'Open EFS card management',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В появившемся окне нажмите кнопку "Manage EFS Card"',
                en: 'In the window that appears, click the "Manage EFS Card" button',
              },
            },
            {
              type: 'image',
              src: step4,
            },
          ],
        },
        {
          title: {
            ru: 'Перейдите к настройке контролей',
            en: 'Proceed to controls settings',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'На данном этапе вы в любой момент можете активировать карту, деактивировать, или приостановить. В разделе "EFS Card Controls" вы можете установить номер юнита и пинкод карты. Для этого нажмите на кнопку "Add New"',
                en: 'At this stage, you can activate, deactivate, or suspend the card at any time. In the "EFS Card Controls" section, you can set the unit number and card PIN. To do this, click the "Add New" button',
              },
            },
            {
              type: 'image',
              src: step5,
            },
          ],
        },
        {
          title: {
            ru: 'Выберите тип контроля Driver ID',
            en: 'Select Driver ID control type',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Появится окно где нужно выбрать необходимый "Control Type". Для этого нажмите на выпадающий список "Select a Control Type" и выберите пункт "Driver ID" (DRID)',
                en: 'A window will appear where you need to select the required "Control Type". Click the "Select a Control Type" dropdown and select "Driver ID" (DRID)',
              },
            },
            {
              type: 'image',
              src: step6,
            },
          ],
        },
        {
          title: {
            ru: 'Установите PIN-код',
            en: 'Set PIN code',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Введите цифры, которые будут паролем (PIN) на данной карте. После этого нажмите "Save"',
                en: 'Enter the digits that will be the password (PIN) for this card. Then click "Save"',
              },
            },
            {
              type: 'image',
              src: step7,
            },
          ],
        },
        {
          title: {
            ru: 'Добавьте номер юнита',
            en: 'Add unit number',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Далее нажмите кнопку "Add New" и выберите следующий "Control Type" - Unit #. И введите номер вашего юнита/трака',
                en: 'Then click the "Add New" button and select the next "Control Type" - Unit #. And enter your unit/truck number',
              },
            },
            {
              type: 'image',
              src: step8,
            },
          ],
        },
        {
          title: {
            ru: 'Проверьте и сохраните',
            en: 'Verify and save',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Убедитесь, что вы правильно выбрали два вида Control Type и ввели правильные данные. После этого нажмите кнопку "Save".',
                en: 'Make sure you have correctly selected both Control Types and entered the correct data. Then click the "Save" button.',
              },
            },
            {
              type: 'image',
              src: step9,
            },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'conclusion',
      text: {
        ru: 'Готово! Вы успешно установили номер юнита и PIN выбранной карты.',
        en: 'Done! You have successfully set the unit number and PIN for the selected card.',
      },
    },
  ],
});
