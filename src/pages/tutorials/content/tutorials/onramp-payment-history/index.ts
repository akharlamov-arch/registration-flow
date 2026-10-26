import { defineTutorial } from '@/content/schema';
import coverEn from './cover-en.jpg';
import coverRu from './cover-ru.jpg';
import step1 from './step-1.jpg';
import step2 from './step-2.jpg';
import step3 from './step-3.jpg';
import step4 from './step-4.jpg';

export default defineTutorial({
  category: 'onramp',
  order: 80,
  title: {
    ru: 'Как проверить платежи по предоплате?',
    en: 'How to check your prepay payments?',
  },
  description: {
    ru: 'Для клиентов с предоплатой: как посмотреть все платежи на аккаунте ONRAMP и найти нужный',
    en: 'For prepay customers: see every payment applied to your ONRAMP account and find a specific one',
  },
  badges: [{ ru: 'Только предоплата', en: 'Prepay only' }],
  cover: { ru: coverRu, en: coverEn },
  body: [
    {
      type: 'text',
      text: {
        ru: '**Эта инструкция только для клиентов с предоплатой.** Если вы пользуетесь нашей программой предоплаты топлива, каждый ваш платёж зачисляется на аккаунт ONRAMP. На странице «Payment History» собраны все эти платежи — по ней можно проверить, что каждый из них зачислен.',
        en: '**This guide is for prepay customers only.** If you use our prepay fuel program, every payment you make is added to your ONRAMP account. The Payment History page lists all of those payments, so you can check that each one was applied.',
      },
    },
    {
      type: 'steps',
      items: [
        {
          title: { ru: 'Откройте раздел «Payment History»', en: 'Open Payment History' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В меню слева нажмите **«Payment History»**. Эта страница нужна только **клиентам с предоплатой**. Если вы не пользуетесь нашей программой предоплаты топлива, она остаётся пустой и показывает **«No payments found»**.',
                en: 'In the menu on the left, click **“Payment History”**. This page is used only by **prepay customers**. If you are not on our prepay fuel program, it stays empty and shows **“No payments found”**.',
              },
            },
            { type: 'image', src: step1 },
          ],
        },
        {
          title: { ru: 'Посмотрите свои платежи', en: 'See your payments' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Для клиентов с предоплатой в таблице показаны все платежи, зачисленные на ваш аккаунт, — сначала самые новые.',
                en: 'For prepay customers, the table lists every payment applied to your account, newest first.',
              },
            },
            { type: 'image', src: step2 },
          ],
        },
        {
          title: { ru: 'Что показывает каждая строка', en: 'What each row shows' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Каждая строка — это один платёж:',
                en: 'Each row is one payment:',
              },
            },
            {
              type: 'bullets',
              items: [
                {
                  ru: '**«Date»**: день, когда платёж был зачислен на ваш аккаунт.',
                  en: '**Date**: the day the payment was applied to your account.',
                },
                {
                  ru: '**«Payment Amount»**: сколько было зачислено.',
                  en: '**Payment Amount**: how much was added.',
                },
                {
                  ru: '**«Payer Email»**: email человека, который внёс платёж.',
                  en: '**Payer Email**: the email of the person who made the payment.',
                },
              ],
            },
            { type: 'image', src: step3 },
          ],
        },
        {
          title: { ru: 'Найдите платёж', en: 'Find a payment' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Чтобы найти конкретный платёж, используйте значки в правом верхнем углу таблицы: **значок поиска** — для поиска платежа, **значок фильтра** — чтобы сузить список.',
                en: 'To find a specific payment, use the icons in the top right corner of the table: the **search icon** to look up a payment, and the **filter icon** to narrow down the list.',
              },
            },
            { type: 'image', src: step4 },
          ],
        },
      ],
    },
  ],
});
