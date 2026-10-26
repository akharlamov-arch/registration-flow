import { defineTutorial } from '@/content/schema';
import coverEn from './cover-en.png';
import coverRu from './cover-ru.png';
import step1 from './step-1.jpg';
import step2 from './step-2.png';
import step3 from './step-3.png';
import step4 from './step-4.png';
import step5 from './step-5.png';

export default defineTutorial({
  category: 'pumpprice',
  order: 4,
  title: {
    ru: 'Как сгенерировать и скачать отчет по транзакциям?',
    en: 'How to generate and download transaction report?',
  },
  description: {
    ru: 'Следуйте этим простым шагам, чтобы скачать отчет по транзакциям.',
    en: 'Follow these simple steps to download your Transaction report.',
  },
  cover: {
    ru: coverRu,
    en: coverEn,
  },
  readTime: 3,
  body: [
    {
      type: 'steps',
      items: [
        {
          title: {
            ru: 'Войдите в систему',
            en: 'Log in to the system',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Войдите в систему на портале PumpPrice по ссылке: [pumpprice.co](https://www.pumpprice.co/users/sign_in) и введите свой логин и пароль, которые были высланы вам на email при регистрации профиля',
                en: 'Log in to the PumpPrice Portal at: [pumpprice.co](https://www.pumpprice.co/users/sign_in) and enter your login and password that were sent to your email when your profile was registered',
              },
            },
            {
              type: 'image',
              src: step1,
            },
            {
              type: 'callout',
              variant: 'hint',
              text: {
                ru: 'Письмо с логином и паролем было выслано вам с адреса **support@pumpprice.co**',
                en: 'The email with your login and password was sent from **support@pumpprice.co**',
              },
            },
          ],
        },
        {
          title: {
            ru: 'Найдите раздел Reports',
            en: 'Find the Reports section',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Найдите и нажмите "Reports"',
                en: 'Find and click "Reports"',
              },
            },
            {
              type: 'image',
              src: step2,
            },
          ],
        },
        {
          title: {
            ru: 'Выберите тип отчета',
            en: 'Select report type',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Найдите и нажмите "Transaction Report"',
                en: 'Find and click "Transaction Report"',
              },
            },
            {
              type: 'image',
              src: step3,
            },
          ],
        },
        {
          title: {
            ru: 'Укажите период отчета',
            en: 'Specify report period',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Выберите дату начала отчета в поле "Start Date" и дату окончания отчета в поле "End Date"',
                en: 'Select the report start date in the "Start Date" field and the end date in the "End Date" field',
              },
            },
            {
              type: 'image',
              src: step4,
            },
          ],
        },
        {
          title: {
            ru: 'Сгенерируйте PDF',
            en: 'Generate PDF',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Нажмите на кнопку "Generate PDF"',
                en: 'Click the "Generate PDF" button',
              },
            },
            {
              type: 'image',
              src: step5,
            },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'conclusion',
      text: {
        ru: 'Готово! Вы успешно скачали отчет на свой компьютер.',
        en: 'Done! You have successfully downloaded the report to your computer.',
      },
    },
  ],
});
