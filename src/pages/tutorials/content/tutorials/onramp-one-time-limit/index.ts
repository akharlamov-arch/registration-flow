import { defineTutorial } from '@/content/schema';
import coverEn from './cover-en.jpg';
import coverRu from './cover-ru.jpg';
import coverUk from './cover-uk.jpg';
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
    uk: 'Як встановити одноразовий ліміт на заправку?',
  },
  description: {
    ru: 'Водитель заправится один раз — на трак-стопе и колонке, которые вы выберете, в пределах лимита',
    en: 'Let a driver fuel up once at a chosen truck stop and pump, within a set limit',
    uk: 'Водій заправиться один раз — на тракстопі та колонці, які ви оберете, у межах ліміту',
  },
  cover: { ru: coverRu, en: coverEn, uk: coverUk },
  body: [
    {
      type: 'text',
      text: {
        ru: 'Разовый лимит позволяет водителю заправиться один раз — на трак-стопе и колонке, которые выберете вы, и с ограничением на то, сколько топлива он может купить. После отправки формы ONRAMP выдаст вам стартовый код и номер PO для водителя.',
        en: 'A one time limit lets a driver fuel up once, at the truck stop and pump you choose, with a limit on how much fuel they can buy. When you submit it, ONRAMP gives you a start code and a PO number for the driver.',
        uk: 'Одноразовий ліміт дає змогу водієві заправитися один раз — на тракстопі та колонці, які оберете ви, і з обмеженням на те, скільки пального він може купити. Після надсилання форми ONRAMP видасть вам стартовий код і номер PO для водія.',
      },
    },
    {
      type: 'steps',
      items: [
        {
          title: {
            ru: 'Откройте раздел «One Time Limit»',
            en: 'Open One Time Limit',
            uk: 'Відкрийте розділ «One Time Limit»',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В меню слева нажмите **«One Time Limit»**. Откроется форма. В следующих шагах мы пройдём её поле за полем.',
                en: 'In the menu on the left, click **“One Time Limit”**. The form opens. The next steps go through it field by field.',
                uk: 'У меню ліворуч натисніть **«One Time Limit»**. Відкриється форма. У наступних кроках ми пройдемо її поле за полем.',
              },
            },
            { type: 'image', src: step1 },
          ],
        },
        {
          title: { ru: 'Выберите водителя', en: 'Choose the driver', uk: 'Оберіть водія' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Нажмите **«Driver»** и выберите водителя, который будет заправляться.',
                en: 'Click **“Driver”** and choose the driver who will fuel up.',
                uk: 'Натисніть **«Driver»** і оберіть водія, який заправлятиметься.',
              },
            },
            { type: 'image', src: step2 },
          ],
        },
        {
          title: { ru: 'Выберите трак-стоп', en: 'Choose the truck stop', uk: 'Оберіть тракстоп' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Нажмите **«Location»** и выберите трак-стоп, где водитель будет заправляться. У каждого трак-стопа в списке указаны номер станции и город.',
                en: 'Click **“Location”** and choose the truck stop where the driver will fuel up. Each truck stop is listed with its store number and city.',
                uk: 'Натисніть **«Location»** і оберіть тракстоп, де водій заправлятиметься. У кожного тракстопу в списку вказано номер станції та місто.',
              },
            },
            { type: 'image', src: step3 },
            {
              type: 'text',
              text: {
                ru: 'Когда вы выберете трак-стоп, появятся два новых поля: **«Pump #»** и **«Truck #»**.',
                en: 'Once you choose a truck stop, two new fields appear: **“Pump #”** and **“Truck #”**.',
                uk: 'Коли ви оберете тракстоп, з’являться два нові поля: **«Pump #»** і **«Truck #»**.',
              },
            },
            { type: 'image', src: step3b },
          ],
        },
        {
          title: { ru: 'Выберите колонку', en: 'Choose the pump', uk: 'Оберіть колонку' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«Pump #»** выберите номер колонки, на которой будет заправляться водитель.',
                en: 'In **“Pump #”**, choose the number of the pump the driver will use.',
                uk: 'У полі **«Pump #»** оберіть номер колонки, на якій заправлятиметься водій.',
              },
            },
            { type: 'image', src: step4 },
          ],
        },
        {
          title: {
            ru: 'Введите номер трака',
            en: 'Enter the truck number',
            uk: 'Введіть номер трака',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«Truck #»** введите номер юнита этого трака.',
                en: 'In **“Truck #”**, enter the unit number of the truck.',
                uk: 'У полі **«Truck #»** введіть номер юніта цього трака.',
              },
            },
            { type: 'image', src: step5 },
          ],
        },
        {
          title: {
            ru: 'Добавьте лимиты на топливо',
            en: 'Add fuel limits',
            uk: 'Додайте ліміти на пальне',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Чтобы задать, сколько топлива может купить водитель, нажмите **«Add Fuel Limits»**.',
                en: 'To set how much fuel the driver can buy, click **“Add Fuel Limits”**.',
                uk: 'Щоб задати, скільки пального може купити водій, натисніть **«Add Fuel Limits»**.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Мы предоставляем только топливо, поэтому «Add Non Fuel Limits» пропустите.',
                en: 'We provide fuel only, so skip “Add Non Fuel Limits”.',
                uk: 'Ми надаємо лише пальне, тому «Add Non Fuel Limits» пропустіть.',
              },
            },
            { type: 'image', src: step6 },
            {
              type: 'text',
              text: {
                ru: 'Под кнопкой откроется раздел **«Fuel Limits»**.',
                en: 'The **“Fuel Limits”** section opens under the button.',
                uk: 'Під кнопкою відкриється розділ **«Fuel Limits»**.',
              },
            },
            { type: 'image', src: step6b },
          ],
        },
        {
          title: { ru: 'Галлоны или доллары', en: 'Gallons or dollars', uk: 'Галони або долари' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«Product Type»** выберите, в чём задать лимит:',
                en: 'In **“Product Type”**, choose how to set the limit:',
                uk: 'У полі **«Product Type»** оберіть, у чому задати ліміт:',
              },
            },
            {
              type: 'bullets',
              items: [
                {
                  ru: '**«Gallons»**: лимит задаётся в галлонах.',
                  en: '**Gallons**: the limit is a number of gallons.',
                  uk: '**«Gallons»**: ліміт задається в галонах.',
                },
                {
                  ru: '**«Dollar Amount»**: лимит задаётся суммой в долларах.',
                  en: '**Dollar Amount**: the limit is an amount in dollars.',
                  uk: '**«Dollar Amount»**: ліміт задається сумою в доларах.',
                },
              ],
            },
            { type: 'image', src: step7 },
          ],
        },
        {
          title: {
            ru: 'Выберите топливо и лимит',
            en: 'Choose the fuel and the limit',
            uk: 'Оберіть пальне та ліміт',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«Product»** выберите топливо:',
                en: 'In **“Product”**, choose the fuel:',
                uk: 'У полі **«Product»** оберіть пальне:',
              },
            },
            {
              type: 'bullets',
              items: [
                {
                  ru: '**«Tractor Diesel»**: дизель для трака.',
                  en: '**Tractor Diesel**: diesel for the truck.',
                  uk: '**«Tractor Diesel»**: дизель для трака.',
                },
                {
                  ru: '**«Reefer Diesel»**: дизель для рефрижераторной установки.',
                  en: '**Reefer Diesel**: diesel for the reefer unit.',
                  uk: '**«Reefer Diesel»**: дизель для рефрижераторної установки.',
                },
                {
                  ru: '**«DEF»**: жидкость для выхлопной системы дизеля.',
                  en: '**DEF**: diesel exhaust fluid.',
                  uk: '**«DEF»**: рідина для вихлопної системи дизеля.',
                },
              ],
            },
            { type: 'image', src: step8 },
            {
              type: 'text',
              text: {
                ru: 'Затем введите лимит рядом: количество галлонов или сумму в долларах — как вы выбрали в шаге 7.',
                en: 'Then enter the limit next to it: the number of gallons or the dollar amount, as you chose in Step 7.',
                uk: 'Потім введіть ліміт поруч: кількість галонів або суму в доларах — як ви обрали на кроці 7.',
              },
            },
            { type: 'image', src: step8b },
          ],
        },
        {
          title: {
            ru: 'Добавьте ещё одно топливо',
            en: 'Add another fuel',
            uk: 'Додайте ще один вид пального',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Чтобы добавить ещё одно топливо, например DEF, нажмите **значок плюса**. Появится новая строка. Выберите в ней продукт и введите для него лимит.',
                en: 'To add another fuel, for example DEF, click the **plus icon**. A new row appears. Choose the product and enter its limit.',
                uk: 'Щоб додати ще один вид пального, наприклад DEF, натисніть **значок плюса**. З’явиться новий рядок. Оберіть у ньому продукт і введіть для нього ліміт.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Чтобы удалить строку, нажмите значок минуса рядом с ней.',
                en: 'To remove a row, click the minus icon next to it.',
                uk: 'Щоб видалити рядок, натисніть значок мінуса поруч із ним.',
              },
            },
            { type: 'image', src: step9 },
          ],
        },
        {
          title: {
            ru: 'Укажите дату окончания (необязательно)',
            en: 'Set an end date (optional)',
            uk: 'Вкажіть дату закінчення (необов’язково)',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Чтобы выбрать, когда лимит перестанет действовать, нажмите **«Add Expiration Date»** и укажите **«End Date»** и **«End Time»**.',
                en: 'To choose when the limit stops working, click **“Add Expiration Date”** and set the **“End Date”** and **“End Time”**.',
                uk: 'Щоб обрати, коли ліміт перестане діяти, натисніть **«Add Expiration Date»** і вкажіть **«End Date»** та **«End Time»**.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Если пропустить этот шаг, коды всё равно будут действовать только короткое время.',
                en: 'If you skip this, the codes still work only for a short period of time.',
                uk: 'Якщо пропустити цей крок, коди однаково діятимуть лише короткий час.',
              },
            },
            { type: 'image', src: step10 },
          ],
        },
        {
          title: {
            ru: 'Отправьте форму и передайте коды',
            en: 'Submit and send the codes',
            uk: 'Надішліть форму та передайте коди',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Проверьте данные и нажмите **«Submit»**.',
                en: 'Check the details and click **“Submit”**.',
                uk: 'Перевірте дані й натисніть **«Submit»**.',
              },
            },
            { type: 'image', src: step11 },
            {
              type: 'text',
              text: {
                ru: 'Появится зелёное окно **«Success!»** со **стартовым кодом** и **PO #**. Отправьте оба водителю. На трак-стопе водитель называет их кассиру или вводит на колонке, чтобы начать заправку.',
                en: 'A green **“Success!”** box shows the **start code** and the **PO #**. Send both to the driver. At the truck stop, the driver gives them to the cashier or enters them at the pump to start fueling.',
                uk: 'З’явиться зелене вікно **«Success!»** зі **стартовим кодом** і **PO #**. Надішліть обидва водієві. На тракстопі водій називає їх касирові або вводить на колонці, щоб почати заправку.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Отправьте коды сразу: они действуют только короткое время.',
                en: 'Send the codes right away: they work only for a short period of time.',
                uk: 'Надішліть коди одразу: вони діють лише короткий час.',
              },
            },
            { type: 'image', src: step11b },
          ],
        },
      ],
    },
  ],
});
