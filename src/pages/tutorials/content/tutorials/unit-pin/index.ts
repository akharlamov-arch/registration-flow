import { defineTutorial } from '@/content/schema';
import coverEn from './cover-en.jpg';
import coverRu from './cover-ru.jpg';
import coverUk from './cover-uk.jpg';
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
    uk: 'Як встановити номер Юніта та PIN для ваших паливних карток у додатку PumpPrice? ‼️',
  },
  description: {
    ru: 'Следуйте этой простой инструкции, для установки номера Юнита и PIN для ваших топливных карт. (функционал доступен для компаний с 10+ траками)',
    en: 'Follow this simple guide to set Unit number and PIN for your fuel cards. (available for companies with 10+ trucks)',
    uk: 'Виконайте цю просту інструкцію, щоб встановити номер Юніта та PIN для ваших паливних карток. (функціонал доступний для компаній з 10+ траками)',
  },
  cover: {
    ru: coverRu,
    en: coverEn,
    uk: coverUk,
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
            uk: 'Увійдіть у систему',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Войдите в систему на портале PumpPrice по ссылке: [pumpprice.co](https://www.pumpprice.co/users/sign_in) и введите свой логин и пароль, которые были высланы вам на email при регистрации профиля. Войдите со своего аккаунта "Fleet Administrator"',
                en: 'Log in to the PumpPrice Portal at: [pumpprice.co](https://www.pumpprice.co/users/sign_in) and enter your login and password that were sent to your email when your profile was registered. Use your "Fleet Administrator" account',
                uk: 'Увійдіть у систему на порталі PumpPrice за посиланням: [pumpprice.co](https://www.pumpprice.co/users/sign_in) і введіть свій логін і пароль, які були надіслані вам на email під час реєстрації профілю. Увійдіть зі свого акаунта "Fleet Administrator"',
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
                uk: 'Лист із логіном і паролем було надіслано вам з адреси **support@pumpprice.co**',
              },
            },
          ],
        },
        {
          title: {
            ru: 'Перейдите в раздел Fuel Cards',
            en: 'Go to the Fuel Cards section',
            uk: 'Перейдіть до розділу Fuel Cards',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Найдите раздел "Fuel Cards" и нажмите на него',
                en: 'Find the "Fuel Cards" section and click on it',
                uk: 'Знайдіть розділ "Fuel Cards" і натисніть на нього',
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
            uk: 'Оберіть картку',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Выберите карту, которую вы хотите настроить/изменить и нажмите напротив неё на иконку "View"',
                en: 'Select the card you want to configure/modify and click the "View" icon next to it',
                uk: 'Оберіть картку, яку ви хочете налаштувати/змінити, і натисніть навпроти неї на іконку "View"',
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
            uk: 'Відкрийте керування карткою EFS',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В появившемся окне нажмите кнопку "Manage EFS Card"',
                en: 'In the window that appears, click the "Manage EFS Card" button',
                uk: 'У вікні, що з’явиться, натисніть кнопку "Manage EFS Card"',
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
            uk: 'Перейдіть до налаштування контролів',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'На данном этапе вы в любой момент можете активировать карту, деактивировать, или приостановить. В разделе "EFS Card Controls" вы можете установить номер юнита и пинкод карты. Для этого нажмите на кнопку "Add New"',
                en: 'At this stage, you can activate, deactivate, or suspend the card at any time. In the "EFS Card Controls" section, you can set the unit number and card PIN. To do this, click the "Add New" button',
                uk: 'На цьому етапі ви будь-коли можете активувати картку, деактивувати або призупинити її. У розділі "EFS Card Controls" ви можете встановити номер юніта та PIN-код картки. Для цього натисніть кнопку "Add New"',
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
            uk: 'Оберіть тип контролю Driver ID',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Появится окно где нужно выбрать необходимый "Control Type". Для этого нажмите на выпадающий список "Select a Control Type" и выберите пункт "Driver ID" (DRID)',
                en: 'A window will appear where you need to select the required "Control Type". Click the "Select a Control Type" dropdown and select "Driver ID" (DRID)',
                uk: 'З’явиться вікно, де потрібно обрати необхідний "Control Type". Для цього натисніть на випадний список "Select a Control Type" і оберіть пункт "Driver ID" (DRID)',
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
            uk: 'Встановіть PIN-код',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Введите цифры, которые будут паролем (PIN) на данной карте. После этого нажмите "Save"',
                en: 'Enter the digits that will be the password (PIN) for this card. Then click "Save"',
                uk: 'Введіть цифри, які будуть паролем (PIN) на цій картці. Після цього натисніть "Save"',
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
            uk: 'Додайте номер юніта',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Далее нажмите кнопку "Add New" и выберите следующий "Control Type" - Unit #. И введите номер вашего юнита/трака',
                en: 'Then click the "Add New" button and select the next "Control Type" - Unit #. And enter your unit/truck number',
                uk: 'Далі натисніть кнопку "Add New" і оберіть наступний "Control Type" - Unit #. І введіть номер вашого юніта/трака',
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
            uk: 'Перевірте та збережіть',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Убедитесь, что вы правильно выбрали два вида Control Type и ввели правильные данные. После этого нажмите кнопку "Save".',
                en: 'Make sure you have correctly selected both Control Types and entered the correct data. Then click the "Save" button.',
                uk: 'Переконайтеся, що ви правильно обрали два види Control Type і ввели правильні дані. Після цього натисніть кнопку "Save".',
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
        uk: 'Готово! Ви успішно встановили номер юніта та PIN обраної картки.',
      },
    },
  ],
});
