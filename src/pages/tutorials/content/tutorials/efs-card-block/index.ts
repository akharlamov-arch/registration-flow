import { defineTutorial } from '@/content/schema';
import coverEn from './cover-en.png';
import coverRu from './cover-ru.png';
import step1 from './step-1.png';
import step2 from './step-2.png';
import step3 from './step-3.png';
import step4 from './step-4.png';

export default defineTutorial({
  category: 'efs-cards',
  order: 1,
  title: {
    ru: 'Как избежать временной блокировки карты?',
    en: 'How to avoid temporary card blocks?',
  },
  description: {
    ru: 'Руководство пользователей. Почему ваша топливная карта EFS может быть временно заблокирована?',
    en: 'User Guide. Why your EFS fuel card may be temporarily blocked?',
  },
  cover: {
    ru: coverRu,
    en: coverEn,
  },
  readTime: 5,
  body: [
    {
      type: 'text',
      text: {
        ru: 'Иногда карта EFS может быть временно приостановлена из-за необычных шаблонов использования. Эти автоматические блокировки предназначены для обеспечения безопасного и стабильного использования карты. Ниже описаны четыре наиболее распространённые ситуации и способы их избежать.',
        en: 'Sometimes an EFS card may be temporarily suspended due to unusual usage patterns. These automatic blocks are designed to ensure safe and stable card usage. Below are the four most common situations and how to avoid them.',
      },
    },
    {
      type: 'steps',
      items: [
        {
          title: {
            ru: 'Использование одной карты в разных штатах одновременно',
            en: 'Using one card in different states simultaneously',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Если один водитель использует физическую карту в одном штате, а другой — через мобильное приложение в другом, система EFS воспринимает это как невозможную активность и может заблокировать карту.',
                en: 'If one driver uses the physical card in one state and another uses it through the mobile app in another state, the EFS system perceives this as impossible activity and may block the card.',
              },
            },
            {
              type: 'image',
              src: step1,
            },
            {
              type: 'callout',
              variant: 'solution',
              text: {
                ru: 'Назначайте отдельные топливные карты каждому водителю. Никогда не используйте одну и ту же карту одновременно в разных местах.',
                en: 'Assign separate fuel cards to each driver. Never use the same card simultaneously in different locations.',
              },
            },
          ],
        },
        {
          title: {
            ru: 'Повторная заправка на одной и той же станции (Local Drivers)',
            en: 'Repeated refueling at the same station (local drivers)',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Если водитель всегда заправляется на одной и той же заправке или в пределах очень ограниченной территории, система может расценить это как необычную активность, особенно если поведение не совпадает с типичными междугородними маршрутами. Хотя само по себе это редко приводит к блокировке, несколько заправок на одной станции за короткое время (например, три и более за день) могут вызвать тревогу системы и привести к временной приостановке.',
                en: "If a driver always refuels at the same station or within a very limited area, the system may consider this unusual activity, especially if the behavior doesn't match typical long-haul routes. While this alone rarely leads to a block, multiple refuelings at one station in a short time (e.g., three or more per day) can trigger system alerts and lead to temporary suspension.",
              },
            },
            {
              type: 'image',
              src: step2,
            },
            {
              type: 'callout',
              variant: 'solution',
              text: {
                ru: 'Даже если вы работаете по местным маршрутам, старайтесь заправляться на разных станциях в вашем районе. Разнообразие точек заправки помогает системе распознавать ваше поведение как стабильное и избежать ненужных тревог.',
                en: 'Even if you work local routes, try to refuel at different stations in your area. Variety in refueling locations helps the system recognize your behavior as stable and avoid unnecessary alerts.',
              },
            },
          ],
        },
        {
          title: {
            ru: 'Большое расстояние между заправками',
            en: 'Large distance between refuelings',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Мы понимаем, что некоторые владельцы-операторы используют несколько топливных карт в длительных поездках. Однако если карта iTrucking (EFS) используется для заправки в Калифорнии, а затем не используется до следующей остановки в Иллинойсе через 2–3 дня, система фиксирует большой пробег без заправок. Это может показаться ей подозрительным и привести к временной блокировке до проверки активности.',
                en: 'We understand that some owner-operators use multiple fuel cards on long trips. However, if the iTrucking (EFS) card is used to refuel in California and then not used until the next stop in Illinois 2-3 days later, the system records a large mileage without refueling. This may seem suspicious and lead to temporary blocking until activity is verified.',
              },
            },
            {
              type: 'image',
              src: step3,
            },
            {
              type: 'callout',
              variant: 'solution',
              text: {
                ru: 'По возможности используйте вашу карту EFS регулярно на протяжении всей поездки. Избегайте частой смены топливных карт — это помогает системе точно отслеживать использование и предотвращает ненужные сбои.',
                en: 'Whenever possible, use your EFS card regularly throughout your trip. Avoid frequently switching fuel cards—this helps the system accurately track usage and prevents unnecessary disruptions.',
              },
            },
          ],
        },
        {
          title: {
            ru: 'Долгий период бездействия между заправками',
            en: 'Long period of inactivity between refuelings',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Если вы меняете водителей, оборудование или временно выводите грузовик из эксплуатации — и не планируете использовать топливную карту — разумно временно перевести её в неактивный статус. Если карта остаётся активной, но не используется в течение длительного времени, следующая попытка заправки может быть расценена системой как неожиданная и привести к временной блокировке до подтверждения.',
                en: "If you're changing drivers, equipment, or temporarily taking a truck out of service—and don't plan to use the fuel card—it's wise to temporarily set it to inactive status. If the card remains active but unused for a long time, the next refueling attempt may be perceived by the system as unexpected and lead to temporary blocking until confirmation.",
              },
            },
            {
              type: 'image',
              src: step4,
            },
            {
              type: 'callout',
              variant: 'solution',
              text: {
                ru: 'Если вы долго не пользовались картой, будьте готовы, что следующая транзакция может показаться системе необычной. Чтобы избежать задержек, убедитесь, что человек, использующий карту, готов оперативно подтвердить её использование.',
                en: "If you haven't used the card for a long time, be prepared that the next transaction may seem unusual to the system. To avoid delays, make sure the person using the card is ready to promptly confirm its use.",
              },
            },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'conclusion',
      text: {
        ru: 'Если вам не удалось предотвратить блокировку — не переживайте. Команда iTrucking всегда готова помочь вам как можно быстрее восстановить работу вашей EFS-карты, чтобы вы смогли вернуться в путь без значительных задержек.',
        en: "If you couldn't prevent a block—don't worry. The iTrucking team is always ready to help you restore your EFS card as quickly as possible so you can get back on the road without significant delays.",
      },
    },
  ],
});
