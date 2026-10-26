import { defineTutorial } from '@/content/schema';
import coverEn from './cover-en.png';
import coverRu from './cover-ru.png';

export default defineTutorial({
  category: 'tire-discount',
  order: 8,
  title: {
    ru: 'Как зарегистрироваться в дисконтной программе на шины?',
    en: 'How to register for the tire discount program?',
  },
  description: {
    ru: 'Простая инструкция по регистрации в программе скидок на шины',
    en: 'Simple guide to register for the tire discount program',
  },
  cover: {
    ru: coverRu,
    en: coverEn,
  },
  readTime: 1,
  body: [
    {
      type: 'text',
      text: {
        ru: 'Перейдите по ссылке и заполните свои данные в форме ➡️: **[Нажмите на этот текст](https://forms.gle/pnMeq9d2FXWsAM3e9)**',
        en: 'Follow the link and fill in your details in the form ➡️: **[Click on this text](https://forms.gle/pnMeq9d2FXWsAM3e9)**',
      },
    },
    {
      type: 'list',
      title: {
        ru: 'Инструкция по заполнению формы:',
        en: 'Form filling instructions:',
      },
      items: [
        {
          ru: 'Введите ваше имя',
          en: 'Enter your name',
        },
        {
          ru: 'Введите ваш номер телефона',
          en: 'Enter your phone number',
        },
        {
          ru: 'Введите название вашей компании',
          en: 'Enter your company name',
        },
        {
          ru: 'Введите адрес электронной почты вашей компании',
          en: 'Enter your company email address',
        },
        {
          ru: 'Введите DOT-номер вашей компании (на данный момент это обязательное условие для участия в программе)',
          en: 'Enter your company DOT number (this is currently a mandatory requirement for program participation)',
        },
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      text: {
        ru: 'Если Вы уже зарегистрированы в дисконтной программе, перейдите на [эту страницу](tutorial:tire-discount-use), чтобы узнать как воспользоваться скидками: "Как воспользоваться скидками по дисконтной программе на шины?"',
        en: 'If you are already registered in the discount program, go to [this page](tutorial:tire-discount-use) to learn how to use the discounts: "How to Use Tire Discount Program Benefits?"',
      },
    },
  ],
});
