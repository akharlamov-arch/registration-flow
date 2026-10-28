import { defineTutorial } from '@/content/schema';
import coverEn from './cover-en.jpg';
import coverRu from './cover-ru.jpg';
import coverUk from './cover-uk.jpg';
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
    uk: 'Як згенерувати та завантажити звіт по транзакціях?',
  },
  description: {
    ru: 'Следуйте этим простым шагам, чтобы скачать отчет по транзакциям.',
    en: 'Follow these simple steps to download your Transaction report.',
    uk: 'Виконайте ці прості кроки, щоб завантажити звіт по транзакціях.',
  },
  cover: {
    ru: coverRu,
    en: coverEn,
    uk: coverUk,
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
            uk: 'Увійдіть у систему',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Войдите в систему на портале PumpPrice по ссылке: [pumpprice.co](https://www.pumpprice.co/users/sign_in) и введите свой логин и пароль, которые были высланы вам на email при регистрации профиля',
                en: 'Log in to the PumpPrice Portal at: [pumpprice.co](https://www.pumpprice.co/users/sign_in) and enter your login and password that were sent to your email when your profile was registered',
                uk: 'Увійдіть у систему на порталі PumpPrice за посиланням: [pumpprice.co](https://www.pumpprice.co/users/sign_in) і введіть свій логін і пароль, які були надіслані вам на email під час реєстрації профілю',
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
                uk: 'Лист із логіном і паролем було надіслано вам з адреси **support@pumpprice.co**',
              },
            },
          ],
        },
        {
          title: {
            ru: 'Найдите раздел Reports',
            en: 'Find the Reports section',
            uk: 'Знайдіть розділ Reports',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Найдите и нажмите "Reports"',
                en: 'Find and click "Reports"',
                uk: 'Знайдіть і натисніть "Reports"',
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
            uk: 'Оберіть тип звіту',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Найдите и нажмите "Transaction Report"',
                en: 'Find and click "Transaction Report"',
                uk: 'Знайдіть і натисніть "Transaction Report"',
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
            uk: 'Вкажіть період звіту',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Выберите дату начала отчета в поле "Start Date" и дату окончания отчета в поле "End Date"',
                en: 'Select the report start date in the "Start Date" field and the end date in the "End Date" field',
                uk: 'Оберіть дату початку звіту в полі "Start Date" і дату закінчення звіту в полі "End Date"',
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
            uk: 'Згенеруйте PDF',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Нажмите на кнопку "Generate PDF"',
                en: 'Click the "Generate PDF" button',
                uk: 'Натисніть кнопку "Generate PDF"',
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
        uk: 'Готово! Ви успішно завантажили звіт на свій комп’ютер.',
      },
    },
  ],
});
