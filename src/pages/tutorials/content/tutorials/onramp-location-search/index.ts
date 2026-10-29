import { defineTutorial } from '@/content/schema';
import coverEn from './cover-en.jpg';
import coverRu from './cover-ru.jpg';
import coverUk from './cover-uk.jpg';
import step1 from './step-1.jpg';
import step2 from './step-2.jpg';
import step3 from './step-3.jpg';
import step4 from './step-4.jpg';

export default defineTutorial({
  category: 'onramp',
  order: 40,
  title: {
    ru: 'Как найти трак-стопы на карте?',
    en: 'How to find truck stops on the map?',
    uk: 'Як знайти тракстопи на карті?',
  },
  description: {
    ru: 'Найдите в «Location Search» трак-стопы рядом с водителем или по маршруту',
    en: 'Use Location Search to find truck stops near your driver or along a route',
    uk: 'Знайдіть у «Location Search» тракстопи поруч із водієм або за маршрутом',
  },
  cover: { ru: coverRu, en: coverEn, uk: coverUk },
  body: [
    {
      type: 'text',
      text: {
        ru: 'Раздел «Location Search» показывает трак-стопы вашей сети на карте. С его помощью можно найти трак-стоп рядом с водителем или спланировать заправки по маршруту.',
        en: 'Location Search shows the truck stops in your network on a map. Use it to find a truck stop near your driver or to plan fuel stops along a route.',
        uk: 'Розділ «Location Search» показує тракстопи вашої мережі на карті. За його допомогою можна знайти тракстоп поруч із водієм або спланувати заправки за маршрутом.',
      },
    },
    {
      type: 'steps',
      items: [
        {
          title: {
            ru: 'Откройте раздел «Location Search»',
            en: 'Open Location Search',
            uk: 'Відкрийте розділ «Location Search»',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В меню слева нажмите **«Location Search»**. На карте показаны трак-стопы вашей сети, каждый отмечен логотипом своего мерчанта. Рядом со строкой поиска видно, сколько трак-стопов показано: здесь **«40 locations shown»**.',
                en: 'In the menu on the left, click **“Location Search”**. The map shows the truck stops in your network, each marked with its merchant’s logo. Next to the search bar you can see how many truck stops are shown, here **“40 locations shown”**.',
                uk: 'У меню ліворуч натисніть **«Location Search»**. На карті показано тракстопи вашої мережі, кожен позначено логотипом свого мерчанта. Поруч із рядком пошуку видно, скільки тракстопів показано: тут **«40 locations shown»**.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'На карте отображаются только те мерчанты и трак-стопы, которые активны в разделе «Merchant Network».',
                en: 'Only the merchants and truck stops that are active in “Merchant Network” appear on the map.',
                uk: 'На карті відображаються лише ті мерчанти й тракстопи, які активні в розділі «Merchant Network».',
              },
            },
            { type: 'image', src: step1 },
          ],
        },
        {
          title: {
            ru: 'Найдите нужное место',
            en: 'Search for a place',
            uk: 'Знайдіть потрібне місце',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Чтобы найти трак-стопы рядом с нужным местом, введите город, адрес или название места в поле **«Place or address»**, затем выберите его из списка. В этом примере мы вводим **«salt lake»** и выбираем **«Salt Lake City, UT»**.',
                en: 'To find truck stops near a place, type a city, address or place name in **“Place or address”**, then choose it from the list. In this example, we type **“salt lake”** and choose **“Salt Lake City, UT”**.',
                uk: 'Щоб знайти тракстопи поруч із потрібним місцем, введіть місто, адресу або назву місця в поле **«Place or address»**, потім оберіть його зі списку. У цьому прикладі ми вводимо **«salt lake»** і обираємо **«Salt Lake City, UT»**.',
              },
            },
            { type: 'image', src: step2 },
          ],
        },
        {
          title: {
            ru: 'Посмотрите трак-стопы поблизости',
            en: 'See the truck stops nearby',
            uk: 'Перегляньте тракстопи поблизу',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Карта переместится к этому месту и покажет трак-стопы вокруг него. Число рядом со строкой поиска обновится — здесь **«47 locations shown»**.',
                en: 'The map moves to that place and shows the truck stops around it. The number next to the search bar updates, here to **“47 locations shown”**.',
                uk: 'Карта переміститься до цього місця й покаже тракстопи навколо нього. Число поруч із рядком пошуку оновиться — тут **«47 locations shown»**.',
              },
            },
            { type: 'image', src: step3 },
          ],
        },
        {
          title: {
            ru: 'Ищите в нужной области карты',
            en: 'Search an area on the map',
            uk: 'Шукайте в потрібній області карти',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Карту можно просматривать и самостоятельно. Перетащите её и приблизьте или отдалите до нужной области, затем нажмите **«Search this area»**. Карта покажет трак-стопы в этой области.',
                en: 'You can also look around the map yourself. Drag the map and zoom in or out to the area you need, then click **“Search this area”**. The map shows the truck stops in that area.',
                uk: 'Карту можна переглядати й самостійно. Перетягніть її та наблизьте або віддаліть до потрібної області, потім натисніть **«Search this area»**. Карта покаже тракстопи в цій області.',
              },
            },
            { type: 'image', src: step4 },
          ],
        },
      ],
    },
  ],
});
