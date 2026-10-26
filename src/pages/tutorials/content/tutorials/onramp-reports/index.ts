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

export default defineTutorial({
  category: 'onramp',
  order: 50,
  title: {
    ru: 'Как сгенерировать и скачать любые отчёты?',
    en: 'How to export any reports?',
  },
  description: {
    ru: 'Просмотр топливных транзакций и выгрузка двух главных отчётов: по транзакциям и IFTA',
    en: 'See your fuel transactions and export the two key reports: Transactions and IFTA',
  },
  cover: { ru: coverRu, en: coverEn },
  body: [
    {
      type: 'text',
      text: {
        ru: 'На странице «Reports» можно смотреть топливные транзакции и выгружать отчёты. В ONRAMP есть несколько типов отчётов. Здесь мы разберём два, которые нужны чаще всего: отчёт по транзакциям и отчёт IFTA — в ONRAMP он называется «Fuel Tax Total».',
        en: 'On the Reports page you can see your fuel transactions and export reports. ONRAMP offers several report types. This guide covers the two you will use most: the Transaction report and the IFTA report, called Fuel Tax Total in ONRAMP.',
      },
    },
    {
      type: 'steps',
      items: [
        {
          title: { ru: 'Откройте раздел «Reports»', en: 'Open Reports' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В меню слева нажмите **«Reports»**. На вкладке **«Transactions»** показаны топливные транзакции за даты из полей **«Start date»** и **«End date»**. Измените даты, чтобы посмотреть другой период.',
                en: 'In the menu on the left, click **“Reports”**. The **“Transactions”** tab lists your fuel transactions for the dates in **“Start date”** and **“End date”**. Change the dates to see a different period.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Эти даты меняют только то, что показано в таблице. Отчёт они не создают.',
                en: 'These dates only change what the table shows. They don’t create a report.',
              },
            },
            { type: 'image', src: step1 },
          ],
        },
        {
          title: { ru: 'Скачайте чек', en: 'Download a receipt' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Чтобы скачать чек по транзакции, нажмите **«Email Receipt»** в конце её строки.',
                en: 'To download the receipt for a transaction, click **“Email Receipt”** at the end of its row.',
              },
            },
            { type: 'image', src: step2 },
          ],
        },
        {
          title: { ru: 'Откройте окно «Export Report»', en: 'Open Export Report' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Чтобы создать отчёт, нажмите **«Export»**. Откроется окно **«Export Report»**.',
                en: 'To create a report, click **“Export”**. The **“Export Report”** window opens.',
              },
            },
            { type: 'image', src: step3 },
          ],
        },
        {
          title: { ru: 'Выберите тип отчёта', en: 'Choose the report type' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Нажмите **«Report Type»** и выберите нужный отчёт. В ONRAMP несколько типов отчётов. Два самых важных — **«Transactions»** и **«Fuel Tax Total»** (IFTA), о них расскажем в следующих шагах.',
                en: 'Click **“Report Type”** and choose the report you need. ONRAMP offers several report types. The two most important are **“Transactions”** and **“Fuel Tax Total”** (IFTA), explained in the next steps.',
              },
            },
            { type: 'image', src: step4 },
          ],
        },
        {
          title: {
            ru: 'Отчёт по транзакциям: тип и даты',
            en: 'Transaction report: type and dates',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«Report Type»** выберите **«Transactions»**. Затем укажите период в полях **«Start Date»** и **«End Date»**.',
                en: 'In **“Report Type”**, choose **“Transactions”**. Then set the period in **“Start Date”** and **“End Date”**.',
              },
            },
            { type: 'image', src: step5 },
          ],
        },
        {
          title: { ru: 'Выберите формат файла', en: 'Choose the file type' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«File Type»** выберите формат отчёта:',
                en: 'In **“File Type”**, choose the format of the report:',
              },
            },
            {
              type: 'bullets',
              items: [
                {
                  ru: '**CSV** — простой табличный файл, который открывается в Excel, Google Sheets и большинстве бухгалтерских программ.',
                  en: '**CSV**: a simple table file that opens in Excel, Google Sheets and most accounting programs.',
                },
                { ru: '**XLS** — таблица Excel.', en: '**XLS**: an Excel spreadsheet.' },
                {
                  ru: '**PDF** — документ, готовый к печати.',
                  en: '**PDF**: a ready-to-print document.',
                },
              ],
            },
            { type: 'image', src: step6 },
          ],
        },
        {
          title: {
            ru: 'Выберите водителя или трак, затем выгрузите отчёт',
            en: 'Pick a driver or truck, then export',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'По умолчанию отчёт строится по всей компании. Чтобы получить отчёт по одному водителю, выберите его в поле **«Driver (optional)»**. Чтобы получить отчёт по одному траку, выберите его номер в поле **«Unit Number (optional)»**. Затем нажмите **«Export»**, чтобы скачать отчёт.',
                en: 'By default, the report covers your whole company. To get a report for one driver, choose them in **“Driver (optional)”**. To get a report for one truck, choose its number in **“Unit Number (optional)”**. Then click **“Export”** to download the report.',
              },
            },
            { type: 'image', src: step7 },
          ],
        },
        {
          title: { ru: 'Отчёт IFTA: тип и даты', en: 'IFTA report: type and dates' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«Report Type»** выберите **«Fuel Tax Total»**. В полях **«Start Date»** и **«End Date»** укажите отчётный период, например квартал.',
                en: 'In **“Report Type”**, choose **“Fuel Tax Total”**. Set the period you are reporting, for example the quarter, in **“Start Date”** and **“End Date”**.',
              },
            },
            { type: 'image', src: step8 },
          ],
        },
        {
          title: {
            ru: 'Итоги по каждому траку, затем выгрузка',
            en: 'Totals per truck, then export',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Чтобы увидеть итоги по каждому траку, отметьте **«Show Totals Per Truck»**. Если оставить галочку пустой, итоги будут по всей компании. Затем нажмите **«Export»**, чтобы скачать отчёт.',
                en: 'To see the totals for each truck, tick **“Show Totals Per Truck”**. Leave it unticked to get the totals for your whole company. Then click **“Export”** to download the report.',
              },
            },
            { type: 'image', src: step9 },
          ],
        },
      ],
    },
  ],
});
