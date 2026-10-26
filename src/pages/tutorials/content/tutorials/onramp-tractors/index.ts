import { defineTutorial } from '@/content/schema';
import coverEn from './cover-en.jpg';
import coverRu from './cover-ru.jpg';
import step1 from './step-1.jpg';
import step2 from './step-2.jpg';
import step2b from './step-2b.jpg';
import step3 from './step-3.jpg';
import step4 from './step-4.jpg';
import step5 from './step-5.jpg';
import step6 from './step-6.jpg';
import step7 from './step-7.jpg';
import step7b from './step-7b.jpg';
import step8 from './step-8.jpg';
import step9 from './step-9.jpg';

export default defineTutorial({
  category: 'onramp',
  order: 70,
  title: {
    ru: 'Как добавить трак и назначить водителей?',
    en: 'How to add a truck and assign drivers?',
  },
  description: {
    ru: 'Добавьте трак на странице «Tractors», назначьте водителей и при необходимости измените его данные',
    en: 'Add a truck on the Tractors page, assign its drivers and edit its details later',
  },
  cover: { ru: coverRu, en: coverEn },
  body: [
    {
      type: 'text',
      text: {
        ru: 'На странице «Tractors» хранится список ваших траков и водителей, которые на них ездят. Здесь показано, как добавить трак, назначить на него водителей и позже изменить его данные.',
        en: 'On the Tractors page you keep a list of your trucks and which drivers drive them. This guide shows how to add a truck, assign drivers to it and change its details later.',
      },
    },
    {
      type: 'steps',
      items: [
        {
          title: { ru: 'Откройте раздел «Tractors»', en: 'Open Tractors' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В меню слева нажмите **«Tractors»**. В таблице **«Tractors»** — ваши траки: их **Unit ID**, **VIN**, статус и назначенные водители. Пока вы не добавили первый трак, в ней написано **«No tractors found»**.',
                en: 'In the menu on the left, click **“Tractors”**. The **“Tractors”** table lists your trucks with their **Unit ID**, **VIN**, status and assigned drivers. Until you add your first truck, it shows **“No tractors found”**.',
              },
            },
            { type: 'image', src: step1 },
          ],
        },
        {
          title: { ru: 'Откройте форму «Add Tractor»', en: 'Open the Add Tractor form' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Чтобы добавить трак, нажмите **«Add Tractor»** в правом верхнем углу. Откроется форма **«Add Tractor»**.',
                en: 'To add a truck, click **“Add Tractor”** in the top right corner. The **“Add Tractor”** form opens.',
              },
            },
            { type: 'image', src: step2 },
            {
              type: 'text',
              text: {
                ru: 'В форме четыре поля: **«Unit ID»**, **«VIN»**, **«Start Date»** и **«Assigned Drivers (optional)»**. В следующих шагах заполним их по очереди.',
                en: 'The form has four fields: **“Unit ID”**, **“VIN”**, **“Start Date”** and **“Assigned Drivers (optional)”**. The next steps fill them in one by one.',
              },
            },
            { type: 'image', src: step2b },
          ],
        },
        {
          title: { ru: 'Введите Unit ID', en: 'Enter the Unit ID' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«Unit ID»** введите номер юнита — тот же номер, под которым этот трак числится в вашей компании.',
                en: 'In **“Unit ID”**, enter the truck’s unit number, the same number you use for it in your company.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'По Unit ID вы потом найдёте этот трак — например, в поле «Unit Number» при выгрузке отчёта.',
                en: 'The Unit ID is how you find this truck later, for example in “Unit Number” when you export a report.',
              },
            },
            { type: 'image', src: step3 },
          ],
        },
        {
          title: { ru: 'Введите VIN', en: 'Enter the VIN' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«VIN»** введите VIN трака — идентификационный номер из 17 символов.',
                en: 'In **“VIN”**, enter the truck’s 17-character vehicle identification number.',
              },
            },
            { type: 'image', src: step4 },
          ],
        },
        {
          title: { ru: 'Укажите дату начала', en: 'Enter the start date' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«Start Date»** укажите день, когда трак начинает работать в вашем автопарке. Дату можно ввести вручную или выбрать в календаре.',
                en: 'In **“Start Date”**, enter the day the truck starts working in your fleet. You can type the date or pick it from the calendar.',
              },
            },
            { type: 'image', src: step5 },
          ],
        },
        {
          title: { ru: 'Назначьте водителей', en: 'Assign drivers' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Чтобы назначить водителей, нажмите **«Assigned Drivers (optional)»** и отметьте тех, кто ездит на этом траке. Можно ввести имя для поиска и выбрать несколько водителей.',
                en: 'To assign drivers, click **“Assigned Drivers (optional)”** and tick the drivers who drive this truck. You can type a name to search, and you can choose more than one driver.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Это поле необязательное. Можно добавить трак сейчас, а водителей назначить позже.',
                en: 'This field is optional. You can add the truck now and assign drivers later.',
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
                ru: 'Проверьте данные и нажмите **«Submit»**.',
                en: 'Check the details and click **“Submit”**.',
              },
            },
            { type: 'image', src: step7 },
            {
              type: 'text',
              text: {
                ru: 'Трак появится в списке со статусом **«Active»** и назначенными водителями.',
                en: 'The truck now appears in the list with the status **“Active”** and its assigned drivers.',
              },
            },
            { type: 'image', src: step7b },
          ],
        },
        {
          title: { ru: 'Откройте страницу трака', en: 'Open the truck’s page' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Чтобы потом изменить данные трака, нажмите **значок карандаша** в конце его строки. Откроется страница трака.',
                en: 'To change a truck’s details later, click the **pencil icon** at the end of its row. The truck’s page opens.',
              },
            },
            { type: 'image', src: step8 },
          ],
        },
        {
          title: { ru: 'Измените или деактивируйте трак', en: 'Edit or deactivate the truck' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'На странице трака указаны его **VIN**, **Unit ID** и **назначенные водители**. Чтобы их изменить, нажмите **«EDIT»**, внесите изменения и сохраните их.',
                en: 'The truck’s page shows its **VIN**, **Unit ID** and **assigned drivers**. To change them, click **“EDIT”**, make your changes and save them.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Если трак уходит из вашего автопарка, нажмите «Deactivate Tractor» на этой же странице.',
                en: 'If a truck leaves your fleet, click “Deactivate Tractor” on the same page.',
              },
            },
            { type: 'image', src: step9 },
          ],
        },
      ],
    },
  ],
});
