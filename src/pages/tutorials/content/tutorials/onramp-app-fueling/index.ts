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
import step8 from './step-8.jpg';
import step9 from './step-9.jpg';
import step10 from './step-10.jpg';
import step11 from './step-11.jpg';
import step12 from './step-12.jpg';
import step13 from './step-13.jpg';

export default defineTutorial({
  category: 'onramp-app',
  order: 110,
  title: {
    ru: 'Как заправляться через приложение ONRAMP?',
    en: 'How to fuel with the ONRAMP app?',
  },
  description: {
    ru: 'Получите два кода в приложении ONRAMP на трак-стопе и введите их на колонке',
    en: 'Get two codes in the ONRAMP app at the truck stop, then type them into the pump',
  },
  cover: { ru: coverRu, en: coverEn },
  related: ['onramp-app-troubleshooting', 'onramp-app-setup'],
  body: [
    {
      type: 'text',
      text: {
        ru: 'Получите два кода в приложении ONRAMP на трак-стопе, а затем введите их на колонке. Держите телефон при себе, когда подходите к колонке.',
        en: 'Get two codes in the ONRAMP app at the truck stop, then type them into the pump. Keep your phone with you at the pump.',
      },
    },
    {
      type: 'steps',
      title: { ru: 'В приложении', en: 'In the app' },
      items: [
        {
          title: { ru: 'Нажмите «Find a fuel station»', en: 'Tap “Find a fuel station”' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'На главном экране нажмите **«Find a fuel station»**. Откроется карта с трак-стопами рядом с вами.',
                en: 'On the Home screen, tap **“Find a fuel station”**. A map opens with the truck stops near you.',
              },
            },
            { type: 'image', src: step1, size: 'small' },
          ],
        },
        {
          title: {
            ru: 'Выберите трак-стоп и нажмите «Start Transaction»',
            en: 'Choose your truck stop and tap “Start Transaction”',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Нажмите на свой трак-стоп на карте. Внизу откроется его карточка. Проверьте название и адрес и нажмите **«Start Transaction»**.',
                en: 'Tap your truck stop on the map. Its card opens at the bottom. Check the name and address, then tap **“Start Transaction”**.',
              },
            },
            {
              type: 'callout',
              variant: 'hint',
              text: {
                ru: 'Вы ещё не на трак-стопе? Коды выдаются только на самом трак-стопе. Если вы далеко, приложение предложит маршрут до выбранного трак-стопа и откроет его в навигаторе — например, в Google Maps или Waze.',
                en: 'Not at the truck stop yet? The codes are made only at the truck stop. Away from it, the app offers a route to the truck stop you chose and opens it in your map app, for example Google Maps or Waze.',
              },
            },
            { type: 'image', src: step2, size: 'small' },
          ],
        },
        {
          title: { ru: 'Выберите колонку', en: 'Choose your pump' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Нажмите номер колонки, у которой вы стоите. Это большая цифра на самой колонке.',
                en: 'Tap the number of the pump you’re parked at. It’s the big number on the pump.',
              },
            },
            {
              type: 'callout',
              variant: 'hint',
              text: {
                ru: 'Номер колонки больше 9? Сначала приложение показывает колонки с 1 по 9. Прокрутите список вниз, чтобы найти свою.',
                en: 'Pump number higher than 9? The screen shows pumps 1 to 9 first. Scroll down the list to find your pump.',
              },
            },
            { type: 'image', src: step3, size: 'small' },
          ],
        },
        {
          title: { ru: 'Подтвердите колонку', en: 'Confirm the pump' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Приложение спросит **«Are you at Pump 3?»** — с номером вашей колонки. Если номер верный, нажмите **«Confirm Pump 3»**. Если нет, нажмите **«Back»** и выберите колонку заново.',
                en: 'The app asks **“Are you at Pump 3?”** with your pump number. If it’s right, tap **“Confirm Pump 3”**. If not, tap **“Back”** and choose again.',
              },
            },
            { type: 'image', src: step4, size: 'small' },
          ],
        },
        {
          title: {
            ru: 'Введите номер трака как номер прицепа',
            en: 'Type your truck number as the trailer number',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Номер вашего трака уже заполнил флит-менеджер, изменить его нельзя.\n\nВ поле **«Trailer Number»** введите тот же номер, что у трака. Лучше всего, когда они совпадают. Затем нажмите **«Next»**.',
                en: 'Your truck number is already filled in by your fleet manager, and you can’t change it.\n\nIn **“Trailer Number”**, type the same number as your truck. It’s best when the two match. Then tap **“Next”**.',
              },
            },
            {
              type: 'callout',
              variant: 'hint',
              text: {
                ru: 'После нажатия «Next» приложение пишет «Oh no!»? Перезапустите приложение. Подробнее — в туториале [«Есть проблемы с приложением ONRAMP?»](tutorial:onramp-app-troubleshooting).',
                en: 'The app says “Oh no!” after you tap Next? Restart the app. See [Troubleshooting](tutorial:onramp-app-troubleshooting).',
              },
            },
            { type: 'image', src: step5, size: 'small' },
          ],
        },
        {
          title: { ru: 'Ваши два кода', en: 'Your two codes' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Приложение покажет два кода:',
                en: 'The app shows two codes:',
              },
            },
            {
              type: 'bullets',
              items: [
                {
                  ru: '**Стартовый код:** его вы вводите первым, на приветственном экране колонки.',
                  en: '**Start code:** you type it first, on the pump’s welcome screen.',
                },
                {
                  ru: '**Номер PO:** колонка попросит его позже.',
                  en: '**PO number:** the pump asks for it later.',
                },
              ],
            },
            {
              type: 'text',
              text: {
                ru: 'На то, чтобы их использовать, есть около 30 минут. Не закрывайте этот экран и идите к колонке.',
                en: 'You have about 30 minutes to use them. Keep this screen open and walk to the pump.',
              },
            },
            {
              type: 'callout',
              variant: 'warning',
              text: {
                ru: 'Не нажимайте **×** на этом экране, если не хотите отменить заправку. Транзакция закроется, и всё придётся начинать заново.',
                en: 'Don’t tap **×** on this screen unless you want to cancel. It closes the transaction, and you’d have to start again.',
              },
            },
            { type: 'image', src: step6, size: 'small' },
          ],
        },
      ],
    },
    {
      type: 'steps',
      title: { ru: 'На колонке', en: 'At the pump' },
      description: {
        ru: 'Экран колонки не сенсорный. Нажимайте кнопки рядом с экраном (на них указывают стрелки на экране) и клавишу **Enter** на клавиатуре. Когда колонка пишет «One Moment Please», подождите.',
        en: 'The pump screen has no touch. Press the buttons beside the screen (the arrows on the screen point to them) and the **Enter** key on the keypad. When the pump says “One Moment Please”, wait.',
      },
      items: [
        {
          title: { ru: 'Введите стартовый код', en: 'Type the start code' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'На приветственном экране наберите на клавиатуре стартовый код из приложения. Он появится на экране колонки. Проверьте его и нажмите **Enter**.',
                en: 'On the welcome screen, type the start code from the app on the keypad. It appears on the pump screen. Check it, then press **Enter**.',
              },
            },
            { type: 'image', src: step7 },
          ],
        },
        {
          title: {
            ru: 'Введите номер телефона для бонусов или пропустите',
            en: 'Type your phone number for rewards, or skip',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Колонка попросит номер мобильного телефона, чтобы начислять бонусы. Введите номер и нажмите **Enter** или нажмите кнопку рядом с **«Skip»**.',
                en: 'The pump asks for a mobile phone number to earn rewards. Type your number and press **Enter**, or press the button next to **Skip**.',
              },
            },
            { type: 'image', src: step8 },
          ],
        },
        {
          title: { ru: 'Выберите топливо и DEF', en: 'Choose your fuel and DEF' },
          blocks: [
            {
              type: 'bullets',
              items: [
                {
                  ru: 'Трак с рефрижератором: нажмите **«Both»**.',
                  en: 'Tractor with a reefer trailer: press **Both**.',
                },
                {
                  ru: 'Любой другой трак: нажмите **«Tractor»**.',
                  en: 'Any other truck: press **Tractor**.',
                },
              ],
            },
            {
              type: 'text',
              text: {
                ru: 'На следующем экране нажмите **«DEF»**, если вам нужен DEF. Если нет, нажмите **«Skip»**.',
                en: 'On the next screen, press **DEF** if you need DEF. If you don’t, press **Skip**.',
              },
            },
            { type: 'image', src: step9 },
          ],
        },
        {
          title: { ru: 'Дважды нажмите «No»', en: 'Press “No” twice' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Колонка спросит **«CASH ADVANCE?»**, а затем **«ADDITIONAL PRODUCTS?»**. Оба раза нажмите **«No»**.',
                en: 'The pump asks **“CASH ADVANCE?”** and then **“ADDITIONAL PRODUCTS?”**. Press **No** both times.',
              },
            },
            { type: 'image', src: step10 },
          ],
        },
        {
          title: { ru: 'Введите номер PO', en: 'Type the PO number' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Колонка попросит **«PO NUMBER»**. Наберите номер PO из приложения и нажмите **Enter**.',
                en: 'The pump asks for the **PO NUMBER**. Type the PO number from the app and press **Enter**.',
              },
            },
            { type: 'image', src: step11 },
          ],
        },
        {
          title: { ru: 'Снимите пистолет и заправляйтесь', en: 'Lift the nozzle and fuel' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Колонка напишет **«Authorizing Diesel»**. Когда появится **«Please Remove Nozzle»**, снимите пистолет и начинайте заправку.',
                en: 'The pump says **“Authorizing Diesel”**. When it says **“Please Remove Nozzle”**, lift the nozzle and start fueling.',
              },
            },
            { type: 'image', src: step12 },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      text: {
        ru: '**Только в Орегоне: номер топливного разрешения.** На трак-стопах в Орегоне после номера PO колонка спрашивает **«FUEL PERMIT #»**. Введите номер вашего орегонского топливного разрешения и нажмите **Enter**.',
        en: '**Only in Oregon: fuel permit number.** At Oregon truck stops, the pump asks for your **FUEL PERMIT #** after the PO number. Type your Oregon fuel permit number and press **Enter**.',
      },
      image: step13,
    },
    {
      type: 'callout',
      variant: 'conclusion',
      text: {
        ru: 'Готово. Чек заправки появится в приложении во вкладке **«Receipts»**.',
        en: 'All done. The receipt for your fuel purchase will appear in the app under **“Receipts”**.',
      },
    },
  ],
});
