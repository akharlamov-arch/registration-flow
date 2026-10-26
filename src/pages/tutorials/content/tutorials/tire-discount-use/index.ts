import { defineTutorial } from '@/content/schema';
import coverEn from './cover-en.png';
import coverRu from './cover-ru.png';
import instructionHeader from './instruction-header.png';

export default defineTutorial({
  category: 'tire-discount',
  order: 9,
  title: {
    ru: 'Как воспользоваться скидками по дисконтной программе на шины?',
    en: 'How to use tire discount program benefits?',
  },
  description: {
    ru: "Пошаговая инструкция использования скидок на шины в сервисных центрах Love's и Speedco",
    en: "Step-by-step guide to using tire discounts at Love's and Speedco service centers",
  },
  cover: {
    ru: coverRu,
    en: coverEn,
  },
  readTime: 2,
  body: [
    {
      type: 'callout',
      variant: 'info',
      text: {
        ru: "Если вы уже прошли регистрацию на участие в дисконтной программе на шины, то Вы теперь имеете доступ к эксклюзивным ценам со скидкой на основные бренды шин в участвующих в программе сервисных центрах Love's и Speedco по всей территории США.",
        en: "If you have already registered to participate in the tire discount program, you now have access to exclusive discounted prices on major tire brands at participating Love's and Speedco service centers across the United States.",
      },
      image: instructionHeader,
    },
    {
      type: 'callout',
      variant: 'warning',
      text: {
        ru: 'Если Вы еще не зарегистрированы в дисконтной программе, перейдите на [эту страницу](tutorial:tire-discount-register) ➡️',
        en: 'If you are not yet registered in the discount program, go to [this page](tutorial:tire-discount-register) ➡️',
      },
    },
    {
      type: 'steps',
      items: [
        {
          title: {
            ru: 'Идентификация участника',
            en: 'Member identification',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: "В любом сервисном центре Love's или Speedco сообщите персоналу, что у вас есть скидки по подписке (членству) по вашему номеру DOT.",
                en: "At any Love's or Speedco service center, inform the staff that you have subscription (membership) discounts using your DOT number.",
              },
            },
          ],
        },
        {
          title: {
            ru: 'Начало заказа',
            en: 'Starting the order',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Попросите их начать сервисный заказ, используя ваш номер DOT. Четко укажите, что это «наличный расчет (cash account)», и вы оплатите все услуги на месте.',
                en: 'Ask them to start a service order using your DOT number. Clearly specify that this is a "cash account" and you will pay for all services on site.',
              },
            },
          ],
        },
        {
          title: {
            ru: 'Уточнение типа аккаунта',
            en: 'Clarifying account type',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Подчеркните, что это «членский аккаунт» по вашему DOT, а НЕ национальный аккаунт. Подтвердите, что для этой подписки нет конкретного номера счета, и что вашего номера DOT достаточно.',
                en: 'Emphasize that this is a "membership account" under your DOT, NOT a national account. Confirm that there is no specific account number for this subscription, and that your DOT number is sufficient.',
              },
            },
          ],
        },
        {
          title: {
            ru: 'Подтверждение скидки',
            en: 'Discount confirmation',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Пожалуйста, имейте в виду, что кассир может изначально не видеть скидки в своей системе. При этом, цена со скидкой будет применена и четко видна в вашем окончательном заказе.',
                en: 'Please note that the cashier may not initially see the discounts in their system. However, the discounted price will be applied and clearly visible in your final order.',
              },
            },
          ],
        },
      ],
    },
  ],
});
