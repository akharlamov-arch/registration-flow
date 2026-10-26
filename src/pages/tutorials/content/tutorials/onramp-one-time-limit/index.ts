import { defineTutorial } from '@/content/schema';
import coverEn from './cover-en.jpg';
import coverRu from './cover-ru.jpg';
import step1 from './step-1.jpg';
import step2 from './step-2.jpg';
import step3 from './step-3.jpg';
import step3b from './step-3b.jpg';
import step4 from './step-4.jpg';
import step5 from './step-5.jpg';
import step6 from './step-6.jpg';
import step6b from './step-6b.jpg';
import step7 from './step-7.jpg';
import step8 from './step-8.jpg';
import step8b from './step-8b.jpg';
import step9 from './step-9.jpg';
import step10 from './step-10.jpg';
import step11 from './step-11.jpg';
import step11b from './step-11b.jpg';

export default defineTutorial({
  category: 'onramp',
  order: 90,
  title: {
    ru: 'Как установить разовый лимит на заправку?',
    en: 'How to set up a one time fuel limit?',
  },
  description: {
    ru: 'Водитель заправится один раз — на трак-стопе и колонке, которые вы выберете, в пределах лимита',
    en: 'Let a driver fuel up once at a chosen truck stop and pump, within a set limit',
  },
  cover: { ru: coverRu, en: coverEn },
  body: [
    {
      type: 'text',
      text: {
        ru: 'Разовый лимит позволяет водителю заправиться один раз — на трак-стопе и колонке, которые выберете вы, и с ограничением на то, сколько топлива он может купить. После отправки формы ONRAMP выдаст вам стартовый код и номер PO для водителя.',
        en: 'A one time limit lets a driver fuel up once, at the truck stop and pump you choose, with a limit on how much fuel they can buy. When you submit it, ONRAMP gives you a start code and a PO number for the driver.',
      },
    },
    {
      type: 'steps',
      items: [
        {
          title: { ru: 'Откройте раздел «One Time Limit»', en: 'Open One Time Limit' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В меню слева нажмите **«One Time Limit»**. Откроется форма. В следующих шагах мы пройдём её поле за полем.',
                en: 'In the menu on the left, click **“One Time Limit”**. The form opens. The next steps go through it field by field.',
              },
            },
            { type: 'image', src: step1 },
          ],
        },
        {
          title: { ru: 'Выберите водителя', en: 'Choose the driver' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Нажмите **«Driver»** и выберите водителя, который будет заправляться.',
                en: 'Click **“Driver”** and choose the driver who will fuel up.',
              },
            },
            { type: 'image', src: step2 },
          ],
        },
        {
          title: { ru: 'Выберите трак-стоп', en: 'Choose the truck stop' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Нажмите **«Location»** и выберите трак-стоп, где водитель будет заправляться. У каждого трак-стопа в списке указаны номер станции и город.',
                en: 'Click **“Location”** and choose the truck stop where the driver will fuel up. Each truck stop is listed with its store number and city.',
              },
            },
            { type: 'image', src: step3 },
            {
              type: 'text',
              text: {
                ru: 'Когда вы выберете трак-стоп, появятся два новых поля: **«Pump #»** и **«Truck #»**.',
                en: 'Once you choose a truck stop, two new fields appear: **“Pump #”** and **“Truck #”**.',
              },
            },
            { type: 'image', src: step3b },
          ],
        },
        {
          title: { ru: 'Выберите колонку', en: 'Choose the pump' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«Pump #»** выберите номер колонки, на которой будет заправляться водитель.',
                en: 'In **“Pump #”**, choose the number of the pump the driver will use.',
              },
            },
            { type: 'image', src: step4 },
          ],
        },
        {
          title: { ru: 'Введите номер трака', en: 'Enter the truck number' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«Truck #»** введите номер юнита этого трака.',
                en: 'In **“Truck #”**, enter the unit number of the truck.',
              },
            },
            { type: 'image', src: step5 },
          ],
        },
        {
          title: { ru: 'Добавьте лимиты на топливо', en: 'Add fuel limits' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Чтобы задать, сколько топлива может купить водитель, нажмите **«Add Fuel Limits»**.',
                en: 'To set how much fuel the driver can buy, click **“Add Fuel Limits”**.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Мы предоставляем только топливо, поэтому «Add Non Fuel Limits» пропустите.',
                en: 'We provide fuel only, so skip “Add Non Fuel Limits”.',
              },
            },
            { type: 'image', src: step6 },
            {
              type: 'text',
              text: {
                ru: 'Под кнопкой откроется раздел **«Fuel Limits»**.',
                en: 'The **“Fuel Limits”** section opens under the button.',
              },
            },
            { type: 'image', src: step6b },
          ],
        },
        {
          title: { ru: 'Галлоны или доллары', en: 'Gallons or dollars' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«Product Type»** выберите, в чём задать лимит:',
                en: 'In **“Product Type”**, choose how to set the limit:',
              },
            },
            {
              type: 'bullets',
              items: [
                {
                  ru: '**«Gallons»**: лимит задаётся в галлонах.',
                  en: '**Gallons**: the limit is a number of gallons.',
                },
                {
                  ru: '**«Dollar Amount»**: лимит задаётся суммой в долларах.',
                  en: '**Dollar Amount**: the limit is an amount in dollars.',
                },
              ],
            },
            { type: 'image', src: step7 },
          ],
        },
        {
          title: { ru: 'Выберите топливо и лимит', en: 'Choose the fuel and the limit' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«Product»** выберите топливо:',
                en: 'In **“Product”**, choose the fuel:',
              },
            },
            {
              type: 'bullets',
              items: [
                {
                  ru: '**«Tractor Diesel»**: дизель для трака.',
                  en: '**Tractor Diesel**: diesel for the truck.',
                },
                {
                  ru: '**«Reefer Diesel»**: дизель для рефрижераторной установки.',
                  en: '**Reefer Diesel**: diesel for the reefer unit.',
                },
                {
                  ru: '**«DEF»**: жидкость для выхлопной системы дизеля.',
                  en: '**DEF**: diesel exhaust fluid.',
                },
              ],
            },
            { type: 'image', src: step8 },
            {
              type: 'text',
              text: {
                ru: 'Затем введите лимит рядом: количество галлонов или сумму в долларах — как вы выбрали в шаге 7.',
                en: 'Then enter the limit next to it: the number of gallons or the dollar amount, as you chose in Step 7.',
              },
            },
            { type: 'image', src: step8b },
          ],
        },
        {
          title: { ru: 'Добавьте ещё одно топливо', en: 'Add another fuel' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Чтобы добавить ещё одно топливо, например DEF, нажмите **значок плюса**. Появится новая строка. Выберите в ней продукт и введите для него лимит.',
                en: 'To add another fuel, for example DEF, click the **plus icon**. A new row appears. Choose the product and enter its limit.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Чтобы удалить строку, нажмите значок минуса рядом с ней.',
                en: 'To remove a row, click the minus icon next to it.',
              },
            },
            { type: 'image', src: step9 },
          ],
        },
        {
          title: {
            ru: 'Укажите дату окончания (необязательно)',
            en: 'Set an end date (optional)',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Чтобы выбрать, когда лимит перестанет действовать, нажмите **«Add Expiration Date»** и укажите **«End Date»** и **«End Time»**.',
                en: 'To choose when the limit stops working, click **“Add Expiration Date”** and set the **“End Date”** and **“End Time”**.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Если пропустить этот шаг, коды всё равно будут действовать только короткое время.',
                en: 'If you skip this, the codes still work only for a short period of time.',
              },
            },
            { type: 'image', src: step10 },
          ],
        },
        {
          title: { ru: 'Отправьте форму и передайте коды', en: 'Submit and send the codes' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Проверьте данные и нажмите **«Submit»**.',
                en: 'Check the details and click **“Submit”**.',
              },
            },
            { type: 'image', src: step11 },
            {
              type: 'text',
              text: {
                ru: 'Появится зелёное окно **«Success!»** со **стартовым кодом** и **PO #**. Отправьте оба водителю. На трак-стопе водитель называет их кассиру или вводит на колонке, чтобы начать заправку.',
                en: 'A green **“Success!”** box shows the **start code** and the **PO #**. Send both to the driver. At the truck stop, the driver gives them to the cashier or enters them at the pump to start fueling.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Отправьте коды сразу: они действуют только короткое время.',
                en: 'Send the codes right away: they work only for a short period of time.',
              },
            },
            { type: 'image', src: step11b },
          ],
        },
      ],
    },
  ],
});
