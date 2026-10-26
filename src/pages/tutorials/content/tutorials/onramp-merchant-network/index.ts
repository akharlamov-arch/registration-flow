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
import step7b from './step-7b.jpg';

export default defineTutorial({
  category: 'onramp',
  order: 30,
  title: {
    ru: 'Как выбрать трак-стопы, где могут заправляться ваши водители?',
    en: 'How to choose where your drivers can fuel?',
  },
  description: {
    ru: 'Решите, где заправляются водители: отключите мерчанта целиком или только один трак-стоп',
    en: 'Decide where your drivers fuel: turn off a whole merchant or just one truck stop',
  },
  cover: { ru: coverRu, en: coverEn },
  body: [
    {
      type: 'text',
      text: {
        ru: 'На странице «Merchant Network» собраны все топливные мерчанты, с которыми мы работаем, и все их трак-стопы. Ваши водители могут заправляться только у тех мерчантов и на тех трак-стопах, которые здесь активны. Можно отключить мерчанта целиком или только один трак-стоп.',
        en: 'The Merchant Network page lists every fuel merchant we work with and all of their truck stops. Your drivers can fuel only at the merchants and truck stops that are active here. You can turn off a whole merchant, or just one truck stop.',
      },
    },
    {
      type: 'steps',
      items: [
        {
          title: { ru: 'Откройте раздел «Merchant Network»', en: 'Open Merchant Network' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В меню слева нажмите **«Merchant Network»**. Вверху страницы у каждого мерчанта есть карточка с количеством локаций и переключателем вкл/выкл. Под карточками в таблице **«Merchant Network»** перечислены все трак-стопы с адресом и статусом.',
                en: 'In the menu on the left, click **“Merchant Network”**. At the top of the page, each merchant has a card with its number of locations and an on/off switch. Below the cards, the **“Merchant Network”** table lists every truck stop with its address and status.',
              },
            },
            { type: 'image', src: step1 },
          ],
        },
        {
          title: { ru: 'Отключите мерчанта', en: 'Turn off a merchant' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Чтобы водители больше не заправлялись у мерчанта, нажмите на переключатель на его карточке. Карточка станет серой, и на ней появится надпись **«Merchant deactivated»**. Теперь ваши водители не смогут заправляться ни на одном трак-стопе этого мерчанта.',
                en: 'To stop your drivers from fueling at a merchant, click the switch on its card. The card turns grey and shows **“Merchant deactivated”**. Your drivers can no longer fuel at any of this merchant’s truck stops.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Чтобы снова включить мерчанта, ещё раз нажмите на переключатель.',
                en: 'To turn the merchant back on, click the switch again.',
              },
            },
            { type: 'image', src: step2 },
          ],
        },
        {
          title: {
            ru: 'Оставьте включёнными пять основных мерчантов',
            en: 'Keep the five main merchants on',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Наши пять основных мерчантов дают вам лучшие цены на топливо:',
                en: 'Our five main merchants give you the best fuel prices:',
              },
            },
            {
              type: 'bullets',
              items: [
                { ru: 'TA-Petro', en: 'TA-Petro' },
                { ru: 'Love’s', en: 'Love’s' },
                { ru: 'Maverik', en: 'Maverik' },
                { ru: 'RaceTrac', en: 'RaceTrac' },
                { ru: 'Sapp Bros', en: 'Sapp Bros' },
              ],
            },
            {
              type: 'text',
              text: {
                ru: 'Рекомендуем оставить эти пять мерчантов активными — так у ваших водителей на маршруте всегда будет трак-стоп с хорошей ценой.',
                en: 'We recommend keeping these five merchants active, so your drivers always have a good-priced stop on their route.',
              },
            },
            { type: 'image', src: step3 },
          ],
        },
        {
          title: { ru: 'Что означает «Merchant off»', en: 'What “Merchant off” means' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Когда вы отключаете мерчанта, у всех его трак-стопов в таблице появляется статус **«Merchant off»**.',
                en: 'When you deactivate a merchant, all of its truck stops show the status **“Merchant off”** in the table.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Трак-стопы со статусом «Merchant off» нельзя включить по одному. Чтобы вернуть один из них, снова включите мерчанта целиком.',
                en: 'Truck stops with “Merchant off” can’t be turned on one by one. To use one of them again, turn the whole merchant back on.',
              },
            },
            { type: 'image', src: step4 },
          ],
        },
        {
          title: { ru: 'Найдите нужный трак-стоп', en: 'Find one truck stop' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Можно также отключить только один трак-стоп, а остальные трак-стопы мерчанта оставить активными. Чтобы найти трак-стоп, нажмите на **значок поиска** в правом верхнем углу таблицы.',
                en: 'You can also turn off one truck stop and keep the rest of the merchant active. To find the truck stop, click the **search icon** in the top right corner of the table.',
              },
            },
            { type: 'image', src: step5 },
          ],
        },
        {
          title: { ru: 'Введите название или город', en: 'Search by name or city' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Введите в строку поиска название трак-стопа или город. В таблице останутся только подходящие трак-стопы. В этом примере по запросу **«lodi»** нашлись Love’s Travel Stops 538 в Lodi, CA и T/A - Lodi в Seville, OH.',
                en: 'Type the truck stop’s name or city in the search bar. The table now shows only the matching truck stops. In this example, **“lodi”** finds Love’s Travel Stops 538 in Lodi, CA and T/A - Lodi in Seville, OH.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Чтобы очистить поиск, нажмите на ✕ рядом со строкой поиска.',
                en: 'To clear the search, click the ✕ next to the search bar.',
              },
            },
            { type: 'image', src: step6 },
          ],
        },
        {
          title: { ru: 'Отключите трак-стоп', en: 'Turn off the truck stop' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В столбце **«Status»** нажмите **«Active»** напротив трак-стопа, который хотите отключить.',
                en: 'In the **“Status”** column, click **“Active”** next to the truck stop you want to turn off.',
              },
            },
            { type: 'image', src: step7 },
            {
              type: 'text',
              text: {
                ru: 'Статус изменится на **«Inactive»**, и ваши водители больше не смогут заправляться на этом трак-стопе. Остальные трак-стопы мерчанта останутся активными, а на его карточке будет видно, сколько трак-стопов отключено, — здесь **«1 off»**.',
                en: 'The status changes to **“Inactive”**, and your drivers can no longer fuel at this truck stop. The rest of the merchant stays active, and its card shows how many of its truck stops are off, here **“1 off”**.',
              },
            },
            { type: 'image', src: step7b },
          ],
        },
      ],
    },
  ],
});
