import type { Lang } from '@/content/schema';
import { typograph } from '@/lib/typography';

const ru = {
  siteTitle: 'Клиентский портал iTrucking | Client Portal iTrucking',
  /** {brand} заменяется на выделенное красным «iTrucking». */
  heroTitle: 'Клиентский портал {brand}',
  heroSubtitle: 'Найдите ответы на все ваши вопросы',
  categoriesTitle: 'Категории',
  categoryAll: 'Все',
  noResults: 'Здесь пока нет туториалов',
  noResultsText: 'Выберите другую категорию',

  readTime: 'мин чтения',
  stepsOne: 'шаг',
  stepsFew: 'шага',
  stepsMany: 'шагов',

  stepsTitle: 'Пошаговая инструкция',
  calloutSolution: 'Как это избежать:',
  calloutTip: 'Совет:',
  calloutNote: 'Примечание:',
  calloutConclusion: 'Заключение',
  downloadOn: 'Загрузить в',
  recommendationsTitle: 'Рекомендуемые материалы',

  close: 'Закрыть',
  zoomImage: 'Увеличить изображение',
  toggleTheme: 'Переключить тему',
  language: 'Язык',

  installApp: 'Установить приложение',
  iosInstallTitle: 'Установка на iPhone/iPad',
  iosInstallStep1: 'Нажмите на иконку меню',
  iosInstallStep1Desc: '(три горизонтальные точки)',
  iosInstallStep2: 'Выберите пункт меню',
  iosInstallStep2Desc: 'Share (иконка share)',
  iosInstallStep3: 'Нажмите',
  iosInstallStep3Desc: 'иконку "плюсик в квадрате" с названием "Add to Home Screen"',
  androidInstallTitle: 'Установка на Android',
  androidInstallStep1: 'Нажмите на иконку',
  androidInstallStep1Desc: '(три точки) в правом верхнем углу',
  androidInstallStep2: 'Нажмите на',
  androidInstallStep2Desc: 'Add to Home screen',

  footerContact: 'Контакты',
  footerMainPhone: 'iTrucking Services',
  footerAccountingPhone: 'Бухгалтерия',
  footerTirePhone: 'Отдел шин',
  footerDepartments: 'Отделы',
  footerGeneral: 'Общие вопросы',
  footerFuel: 'Топливный отдел',
  footerAccounting: 'Бухгалтерия',
  footerResources: 'Ресурсы',
  footerPrivacy: 'Политика конфиденциальности',
  footerTerms: 'Условия использования',
  footerAddress: 'Адрес',
  footerSocial: 'Социальные сети',
  footerCopyright: 'iTrucking Services. Все права защищены.',

  // Только в registration-flow: кнопка над категориями.
  backToPortal: 'Назад в портал',
};

export type Messages = Record<keyof typeof ru, string>;

const en: Messages = {
  siteTitle: 'Клиентский портал iTrucking | Client Portal iTrucking',
  heroTitle: '{brand} Client Hub',
  heroSubtitle: 'Find answers to all your questions',
  categoriesTitle: 'Categories',
  categoryAll: 'All',
  noResults: 'No tutorials here yet',
  noResultsText: 'Choose another category',

  readTime: 'min read',
  stepsOne: 'step',
  stepsFew: 'steps',
  stepsMany: 'steps',

  stepsTitle: 'Step-by-step guide',
  calloutSolution: 'How to avoid this:',
  calloutTip: 'Tip:',
  calloutNote: 'Note:',
  calloutConclusion: 'Conclusion',
  downloadOn: 'Download on',
  recommendationsTitle: 'Recommended resources',

  close: 'Close',
  zoomImage: 'Enlarge image',
  toggleTheme: 'Toggle theme',
  language: 'Language',

  installApp: 'Install App',
  iosInstallTitle: 'Install on iPhone/iPad',
  iosInstallStep1: 'Tap the menu icon',
  iosInstallStep1Desc: '(three horizontal dots)',
  iosInstallStep2: 'Select menu item',
  iosInstallStep2Desc: 'Share (share icon)',
  iosInstallStep3: 'Tap',
  iosInstallStep3Desc: 'the "plus in square" icon labeled "Add to Home Screen"',
  androidInstallTitle: 'Install on Android',
  androidInstallStep1: 'Tap the',
  androidInstallStep1Desc: '(three dots) icon in the top right corner',
  androidInstallStep2: 'Tap',
  androidInstallStep2Desc: 'Add to Home screen',

  footerContact: 'Contact',
  footerMainPhone: 'iTrucking Services',
  footerAccountingPhone: 'Accounting Team',
  footerTirePhone: 'Tire Department',
  footerDepartments: 'Departments',
  footerGeneral: 'General Inquiries',
  footerFuel: 'Fuel Department',
  footerAccounting: 'Accounting Team',
  footerResources: 'Resources',
  footerPrivacy: 'Privacy Policy',
  footerTerms: 'Terms of Service',
  footerAddress: 'Address',
  footerSocial: 'Social Media',
  footerCopyright: 'iTrucking Services. All rights reserved.',

  backToPortal: 'Back to portal',
};

function withTypography(texts: Messages): Messages {
  return Object.fromEntries(
    Object.entries(texts).map(([key, text]) => [key, typograph(text)]),
  ) as Messages;
}

export const messages: Record<Lang, Messages> = { ru: withTypography(ru), en: withTypography(en) };
