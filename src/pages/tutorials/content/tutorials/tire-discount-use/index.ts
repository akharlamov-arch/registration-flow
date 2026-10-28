import { defineTutorial } from '@/content/schema';
import coverEn from './cover-en.png';
import coverRu from './cover-ru.png';
import coverUk from './cover-uk.jpg';
import instructionHeader from './instruction-header.png';

export default defineTutorial({
  category: 'tire-discount',
  order: 9,
  title: {
    ru: 'Как воспользоваться скидками по дисконтной программе на шины?',
    en: 'How to use tire discount program benefits?',
    uk: 'Як скористатися знижками за дисконтною програмою на шини?',
  },
  description: {
    ru: "Пошаговая инструкция использования скидок на шины в сервисных центрах Love's и Speedco",
    en: "Step-by-step guide to using tire discounts at Love's and Speedco service centers",
    uk: 'Покрокова інструкція з використання знижок на шини в сервісних центрах Love\'s і Speedco',
  },
  cover: {
    ru: coverRu,
    en: coverEn,
    uk: coverUk,
  },
  readTime: 2,
  body: [
    {
      type: 'callout',
      variant: 'info',
      text: {
        ru: "Если вы уже прошли регистрацию на участие в дисконтной программе на шины, то Вы теперь имеете доступ к эксклюзивным ценам со скидкой на основные бренды шин в участвующих в программе сервисных центрах Love's и Speedco по всей территории США.",
        en: "If you have already registered to participate in the tire discount program, you now have access to exclusive discounted prices on major tire brands at participating Love's and Speedco service centers across the United States.",
        uk: 'Якщо ви вже пройшли реєстрацію для участі в дисконтній програмі на шини, то тепер маєте доступ до ексклюзивних цін зі знижкою на основні бренди шин у сервісних центрах Love\'s і Speedco, які беруть участь у програмі, по всій території США.',
      },
      image: instructionHeader,
    },
    {
      type: 'callout',
      variant: 'warning',
      text: {
        ru: 'Если Вы еще не зарегистрированы в дисконтной программе, перейдите на [эту страницу](tutorial:tire-discount-register) ➡️',
        en: 'If you are not yet registered in the discount program, go to [this page](tutorial:tire-discount-register) ➡️',
        uk: 'Якщо Ви ще не зареєстровані в дисконтній програмі, перейдіть на [цю сторінку](tutorial:tire-discount-register) ➡️',
      },
    },
    {
      type: 'steps',
      items: [
        {
          title: {
            ru: 'Идентификация участника',
            en: 'Member identification',
            uk: 'Ідентифікація учасника',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: "В любом сервисном центре Love's или Speedco сообщите персоналу, что у вас есть скидки по подписке (членству) по вашему номеру DOT.",
                en: "At any Love's or Speedco service center, inform the staff that you have subscription (membership) discounts using your DOT number.",
                uk: 'У будь-якому сервісному центрі Love\'s або Speedco повідомте персоналу, що у вас є знижки за підпискою (членством) за вашим номером DOT.',
              },
            },
          ],
        },
        {
          title: {
            ru: 'Начало заказа',
            en: 'Starting the order',
            uk: 'Початок замовлення',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Попросите их начать сервисный заказ, используя ваш номер DOT. Четко укажите, что это «наличный расчет (cash account)», и вы оплатите все услуги на месте.',
                en: 'Ask them to start a service order using your DOT number. Clearly specify that this is a "cash account" and you will pay for all services on site.',
                uk: 'Попросіть їх розпочати сервісне замовлення, використовуючи ваш номер DOT. Чітко вкажіть, що це «готівковий розрахунок (cash account)», і ви оплатите всі послуги на місці.',
              },
            },
          ],
        },
        {
          title: {
            ru: 'Уточнение типа аккаунта',
            en: 'Clarifying account type',
            uk: 'Уточнення типу акаунта',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Подчеркните, что это «членский аккаунт» по вашему DOT, а НЕ национальный аккаунт. Подтвердите, что для этой подписки нет конкретного номера счета, и что вашего номера DOT достаточно.',
                en: 'Emphasize that this is a "membership account" under your DOT, NOT a national account. Confirm that there is no specific account number for this subscription, and that your DOT number is sufficient.',
                uk: 'Наголосіть, що це «членський акаунт» за вашим DOT, а НЕ національний акаунт. Підтвердьте, що для цієї підписки немає конкретного номера рахунку і що вашого номера DOT достатньо.',
              },
            },
          ],
        },
        {
          title: {
            ru: 'Подтверждение скидки',
            en: 'Discount confirmation',
            uk: 'Підтвердження знижки',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Пожалуйста, имейте в виду, что кассир может изначально не видеть скидки в своей системе. При этом, цена со скидкой будет применена и четко видна в вашем окончательном заказе.',
                en: 'Please note that the cashier may not initially see the discounts in their system. However, the discounted price will be applied and clearly visible in your final order.',
                uk: 'Будь ласка, майте на увазі, що касир може спочатку не бачити знижки у своїй системі. Водночас ціна зі знижкою буде застосована й чітко видна у вашому остаточному замовленні.',
              },
            },
          ],
        },
      ],
    },
  ],
});
