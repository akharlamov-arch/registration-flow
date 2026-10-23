// Tutorials (knowledge base) content, ported verbatim from the static site
// akharlamov-arch/tutorial.itrucking.pro (index.html). Texts are RU/EN only;
// strings may hold trusted inline HTML (links, <strong>, <br>).

// Every image under src/assets/tutorials, keyed by its path below that folder,
// so the data can keep the original relative paths while Vite hashes the files.
const ASSET_URLS = import.meta.glob('../../assets/tutorials/**/*.{png,ico}', {
  eager: true,
  import: 'default',
})

export function asset(path) {
  const url = ASSET_URLS[`../../assets/tutorials/${path}`]
  if (!url) throw new Error(`Missing tutorial asset: ${path}`)
  return url
}

export const STRINGS = {
  ru: {
    'site-title': 'iTrucking Services',
    'main-title': 'Клиентский портал <span style="color: #e53935">iTrucking Pro</span>',
    'main-subtitle': 'Найдите ответы на все ваши вопросы',
    'search-placeholder': 'Поиск туториалов...',
    'categories-title': 'Категории',
    'category-all': 'Все',
    'category-pump-price': 'iTrucking Pro',
    'category-efs-cards': 'Использование карт EFS',
    'category-tire-discount': 'Программа скидок на шины',
    'category-onramp': 'OnRamp',
    'no-results': 'Ничего не найдено',
    'no-results-text': 'Попробуйте изменить параметры поиска',
    'steps-title': 'Пошаговая инструкция',
    'how-to-avoid': 'Как это избежать:',
    'tip': 'Совет:',
    'note': 'Примечание:',
    'form-instructions': 'Инструкция по заполнению формы:',
    'editing-users': 'Редактирование пользователей',
    'download-on': 'Загрузить в',
    'conclusion': 'Заключение',
    'recommendations-title': 'Рекомендуемые материалы',
    'footer-contact': 'Контакты',
    'footer-main-phone': 'iTrucking Services',
    'footer-accounting-phone': 'Бухгалтерия',
    'footer-tire-phone': 'Отдел шин',
    'footer-departments': 'Отделы',
    'footer-general': 'Общие вопросы',
    'footer-fuel': 'Топливный отдел',
    'footer-accounting': 'Бухгалтерия',
    'footer-resources': 'Ресурсы',
    'footer-privacy': 'Политика конфиденциальности',
    'footer-terms': 'Условия использования',
    'footer-address': 'Адрес',
    'footer-social': 'Социальные сети',
    'footer-copyright': 'iTrucking Services. Все права защищены.',
    'install-app': 'Установить приложение',
    'ios-install-title': 'Установка на iPhone/iPad',
    'ios-install-step1': 'Нажмите на иконку меню',
    'ios-install-step1-desc': '(три горизонтальные точки)',
    'ios-install-step2': 'Выберите пункт меню',
    'ios-install-step2-desc': 'Share (иконка share)',
    'ios-install-step3': 'Нажмите',
    'ios-install-step3-desc': 'иконку "плюсик в квадрате" с названием "Add to Home Screen"',
    'android-install-step1': 'Нажмите на иконку',
    'android-install-step1-desc': '(три точки) в правом верхнем углу',
    'android-install-step2': 'Нажмите на',
    'android-install-step2-desc': 'Add to Home screen',
    'android-install-title': 'Установка на Android',
    'android-install-prompt': 'Установить приложение на домашний экран?',
    'read-time': 'мин чтения',
    'steps': 'шагов',
    'back-to-portal': 'Назад в портал'
  },
  en: {
    'site-title': 'iTrucking Services',
    'main-title': '<span style="color: #e53935">iTrucking Pro</span> Client Hub',
    'main-subtitle': 'Find answers to all your questions',
    'search-placeholder': 'Search tutorials...',
    'categories-title': 'Categories',
    'category-all': 'All',
    'category-pump-price': 'iTrucking Pro',
    'category-efs-cards': 'Using EFS Cards Tutorial',
    'category-tire-discount': 'Tire Discount Program',
    'category-onramp': 'OnRamp',
    'no-results': 'No results found',
    'no-results-text': 'Try adjusting your search parameters',
    'steps-title': 'Step-by-Step Guide',
    'how-to-avoid': 'How to avoid this:',
    'tip': 'Tip:',
    'note': 'Note:',
    'form-instructions': 'Form Filling Instructions:',
    'editing-users': 'Editing Users',
    'download-on': 'Download on',
    'conclusion': 'Conclusion',
    'recommendations-title': 'Recommended Resources',
    'footer-contact': 'Contact',
    'footer-main-phone': 'iTrucking Services',
    'footer-accounting-phone': 'Accounting Team',
    'footer-tire-phone': 'Tire Department',
    'footer-departments': 'Departments',
    'footer-general': 'General Inquiries',
    'footer-fuel': 'Fuel Department',
    'footer-accounting': 'Accounting Team',
    'footer-resources': 'Resources',
    'footer-privacy': 'Privacy Policy',
    'footer-terms': 'Terms of Service',
    'footer-address': 'Address',
    'footer-social': 'Social Media',
    'footer-copyright': 'iTrucking Services. All rights reserved.',
    'install-app': 'Install App',
    'ios-install-title': 'Install on iPhone/iPad',
    'ios-install-step1': 'Tap the menu icon',
    'ios-install-step1-desc': '(three horizontal dots)',
    'ios-install-step2': 'Select menu item',
    'ios-install-step2-desc': 'Share (share icon)',
    'ios-install-step3': 'Tap',
    'ios-install-step3-desc': 'the "plus in square" icon labeled "Add to Home Screen"',
    'android-install-step1': 'Tap the',
    'android-install-step1-desc': '(three dots) icon in the top right corner',
    'android-install-step2': 'Tap',
    'android-install-step2-desc': 'Add to Home screen',
    'android-install-title': 'Install on Android',
    'android-install-prompt': 'Install app on home screen?',
    'read-time': 'min read',
    'steps': 'steps',
    'back-to-portal': 'Back to portal'
  }
}

export const TUTORIALS = [
  {
    id: 1,
    title: {
      ru: 'Как избежать временной блокировки карты?',
      en: 'How to Avoid Temporary Card Blocks?'
    },
    description: {
      ru: 'Руководство пользователей. Почему ваша топливная карта EFS может быть временно заблокирована?',
      en: 'User Guide. Why your EFS fuel card may be temporarily blocked?'
    },
    category: 'efs-cards',
    readTime: 5,
    stepsCount: 4,
    mainImage: {
      ru: asset('images/EFS-Cards/card-block/efs-tutorial-main.png'),
      en: asset('images/EFS-Cards/card-block/efs-tutorial-main-en.png')
    },
    intro: {
      ru: 'Иногда карта EFS может быть временно приостановлена из-за необычных шаблонов использования. Эти автоматические блокировки предназначены для обеспечения безопасного и стабильного использования карты. Ниже описаны четыре наиболее распространённые ситуации и способы их избежать.',
      en: 'Sometimes an EFS card may be temporarily suspended due to unusual usage patterns. These automatic blocks are designed to ensure safe and stable card usage. Below are the four most common situations and how to avoid them.'
    },
    steps: [
      {
        title: {
          ru: 'Использование одной карты в разных штатах одновременно',
          en: 'Using One Card in Different States Simultaneously'
        },
        content: {
          ru: 'Если один водитель использует физическую карту в одном штате, а другой — через мобильное приложение в другом, система EFS воспринимает это как невозможную активность и может заблокировать карту.',
          en: 'If one driver uses the physical card in one state and another uses it through the mobile app in another state, the EFS system perceives this as impossible activity and may block the card.'
        },
        solution: {
          ru: 'Назначайте отдельные топливные карты каждому водителю. Никогда не используйте одну и ту же карту одновременно в разных местах.',
          en: 'Assign separate fuel cards to each driver. Never use the same card simultaneously in different locations.'
        },
        image: asset('images/EFS-Cards/card-block/efs-step1.png')
      },
      {
        title: {
          ru: 'Повторная заправка на одной и той же станции (Local Drivers)',
          en: 'Repeated Refueling at the Same Station (Local Drivers)'
        },
        content: {
          ru: 'Если водитель всегда заправляется на одной и той же заправке или в пределах очень ограниченной территории, система может расценить это как необычную активность, особенно если поведение не совпадает с типичными междугородними маршрутами. Хотя само по себе это редко приводит к блокировке, несколько заправок на одной станции за короткое время (например, три и более за день) могут вызвать тревогу системы и привести к временной приостановке.',
          en: 'If a driver always refuels at the same station or within a very limited area, the system may consider this unusual activity, especially if the behavior doesn\'t match typical long-haul routes. While this alone rarely leads to a block, multiple refuelings at one station in a short time (e.g., three or more per day) can trigger system alerts and lead to temporary suspension.'
        },
        solution: {
          ru: 'Даже если вы работаете по местным маршрутам, старайтесь заправляться на разных станциях в вашем районе. Разнообразие точек заправки помогает системе распознавать ваше поведение как стабильное и избежать ненужных тревог.',
          en: 'Even if you work local routes, try to refuel at different stations in your area. Variety in refueling locations helps the system recognize your behavior as stable and avoid unnecessary alerts.'
        },
        image: asset('images/EFS-Cards/card-block/efs-step2.png')
      },
      {
        title: {
          ru: 'Большое расстояние между заправками',
          en: 'Large Distance Between Refuelings'
        },
        content: {
          ru: 'Мы понимаем, что некоторые владельцы-операторы используют несколько топливных карт в длительных поездках. Однако если карта iTrucking (EFS) используется для заправки в Калифорнии, а затем не используется до следующей остановки в Иллинойсе через 2–3 дня, система фиксирует большой пробег без заправок. Это может показаться ей подозрительным и привести к временной блокировке до проверки активности.',
          en: 'We understand that some owner-operators use multiple fuel cards on long trips. However, if the iTrucking (EFS) card is used to refuel in California and then not used until the next stop in Illinois 2-3 days later, the system records a large mileage without refueling. This may seem suspicious and lead to temporary blocking until activity is verified.'
        },
        solution: {
          ru: 'По возможности используйте вашу карту EFS регулярно на протяжении всей поездки. Избегайте частой смены топливных карт — это помогает системе точно отслеживать использование и предотвращает ненужные сбои.',
          en: 'Whenever possible, use your EFS card regularly throughout your trip. Avoid frequently switching fuel cards—this helps the system accurately track usage and prevents unnecessary disruptions.'
        },
        image: asset('images/EFS-Cards/card-block/efs-step3.png')
      },
      {
        title: {
          ru: 'Долгий период бездействия между заправками',
          en: 'Long Period of Inactivity Between Refuelings'
        },
        content: {
          ru: 'Если вы меняете водителей, оборудование или временно выводите грузовик из эксплуатации — и не планируете использовать топливную карту — разумно временно перевести её в неактивный статус. Если карта остаётся активной, но не используется в течение длительного времени, следующая попытка заправки может быть расценена системой как неожиданная и привести к временной блокировке до подтверждения.',
          en: 'If you\'re changing drivers, equipment, or temporarily taking a truck out of service—and don\'t plan to use the fuel card—it\'s wise to temporarily set it to inactive status. If the card remains active but unused for a long time, the next refueling attempt may be perceived by the system as unexpected and lead to temporary blocking until confirmation.'
        },
        solution: {
          ru: 'Если вы долго не пользовались картой, будьте готовы, что следующая транзакция может показаться системе необычной. Чтобы избежать задержек, убедитесь, что человек, использующий карту, готов оперативно подтвердить её использование.',
          en: 'If you haven\'t used the card for a long time, be prepared that the next transaction may seem unusual to the system. To avoid delays, make sure the person using the card is ready to promptly confirm its use.'
        },
        image: asset('images/EFS-Cards/card-block/efs-step4.png')
      }
    ],
    conclusion: {
      ru: 'Если вам не удалось предотвратить блокировку — не переживайте. Команда iTrucking всегда готова помочь вам как можно быстрее восстановить работу вашей EFS-карты, чтобы вы смогли вернуться в путь без значительных задержек.',
      en: 'If you couldn\'t prevent a block—don\'t worry. The iTrucking team is always ready to help you restore your EFS card as quickly as possible so you can get back on the road without significant delays.'
    }
  },
  {
    id: 2,
    title: {
      ru: 'Как скачать и установить приложение iTrucking Pro?',
      en: 'How to Download and Install iTrucking Pro App?'
    },
    description: {
      ru: 'Для поиска лучших цен на топливо скачивайте и устанавливайте наше приложение iTrucking Pro',
      en: 'To find the best fuel prices, download and install our iTrucking Pro app'
    },
    category: 'pump-price',
    readTime: 1,
    stepsCount: 3,
    mainImage: {
      ru: asset('images/iTrucking-Pro/install-app/pump-price-main.png'),
      en: asset('images/iTrucking-Pro/install-app/pump-price-main-en.png')
    },
    steps: [
      {
        title: {
          ru: 'Скачайте приложение',
          en: 'Download the App'
        },
        content: {
          ru: 'Скачайте и установите приложение iTrucking Pro на ваше устройство',
          en: 'Download and install the iTrucking Pro app on your device'
        },
        hasDownloadButtons: true
      },
      {
        title: {
          ru: 'Войдите в приложение',
          en: 'Log In to the App'
        },
        content: {
          ru: 'Войдите в приложение под своим логином и паролем.',
          en: 'Log in to the app with your username and password.'
        },
        note: {
          ru: 'Письмо с логином и паролем было выслано вам с адреса <strong>fuel@itrucking.pro</strong>',
          en: 'The email with your login and password was sent from <strong>fuel@itrucking.pro</strong>'
        },
        tip: {
          ru: 'Найдите в вашей электронной почте самый первый email от компании "iTrucking Pro", в нем будут ваши логин и пароль.',
          en: 'Find the first email from "iTrucking Pro" in your inbox—it contains your username and password.'
        },
        image: asset('images/iTrucking-Pro/install-app/pump-price-step2.png')
      },
      {
        title: {
          ru: 'Предоставьте доступ к геолокации',
          en: 'Allow Location Access'
        },
        content: {
          ru: 'Предоставьте доступ к геолокации. Это необходимо для просмотра цен на топливо на вашей карте.',
          en: 'Grant location access. This is necessary to view fuel prices on your map.'
        },
        image: asset('images/iTrucking-Pro/install-app/pump-price-step3.png')
      }
    ],
    conclusion: {
      ru: 'Готово! Теперь вам доступны цены на топливо на всех трак стопах США, доступных в нашей сети.',
      en: 'Done! Now you have access to fuel prices at all US truck stops available in our network.'
    }
  },
  {
    id: 3,
    title: {
      ru: 'Как сгенерировать и скачать IFTA отчет?',
      en: 'How to Generate and Download IFTA Report?'
    },
    description: {
      ru: 'Следуйте этим простым шагам, чтобы скачать отчет IFTA.',
      en: 'Follow these simple steps to download your IFTA report.'
    },
    category: 'pump-price',
    readTime: 3,
    stepsCount: 5,
    mainImage: {
      ru: asset('images/iTrucking-Pro/ifta-report/ifta-report-main.png'),
      en: asset('images/iTrucking-Pro/ifta-report/ifta-report-main-en.png')
    },
    steps: [
      {
        title: {
          ru: 'Войдите в систему',
          en: 'Log In to the System'
        },
        content: {
          ru: 'Войдите в систему на портале iTrucking Pro по ссылке: <a href="https://itrucking.pro/" target="_blank" style="color: var(--accent); text-decoration: underline;">itrucking.pro</a>. Нажмите кнопку "Log in to Portal" и введите свой логин и пароль, которые были высланы вам на email при регистрации профиля',
          en: 'Log in to the iTrucking Pro Portal at: <a href="https://itrucking.pro/" target="_blank" style="color: var(--accent); text-decoration: underline;">itrucking.pro</a>. Click the "Log in to Portal" button and enter your login and password that were sent to your email when your profile was registered'
        },
        image: asset('images/iTrucking-Pro/ifta-report/ifta-step1.png'),
        note: {
          ru: 'Письмо с логином и паролем было выслано вам с адреса <strong>fuel@itrucking.pro</strong>',
          en: 'The email with your login and password was sent from <strong>fuel@itrucking.pro</strong>'
        }
      },
      {
        title: {
          ru: 'Найдите раздел Reports',
          en: 'Find the Reports Section'
        },
        content: {
          ru: 'Найдите и нажмите "Reports"',
          en: 'Find and click "Reports"'
        },
        image: asset('images/iTrucking-Pro/ifta-report/ifta-step2.png')
      },
      {
        title: {
          ru: 'Выберите тип отчета',
          en: 'Select Report Type'
        },
        content: {
          ru: 'Найдите и нажмите "IFTA Jurisdict. Report"',
          en: 'Find and click "IFTA Jurisdict. Report"'
        },
        image: asset('images/iTrucking-Pro/ifta-report/ifta-step3.png')
      },
      {
        title: {
          ru: 'Укажите период отчета',
          en: 'Specify Report Period'
        },
        content: {
          ru: 'Выберите дату начала отчета в поле "Start Date" и дату окончания отчета в поле "End Date"',
          en: 'Select the report start date in the "Start Date" field and the end date in the "End Date" field'
        },
        image: asset('images/iTrucking-Pro/ifta-report/ifta-step4.png')
      },
      {
        title: {
          ru: 'Сгенерируйте PDF',
          en: 'Generate PDF'
        },
        content: {
          ru: 'Нажмите на кнопку "Generate PDF"',
          en: 'Click the "Generate PDF" button'
        },
        image: asset('images/iTrucking-Pro/ifta-report/ifta-step5.png')
      }
    ],
    conclusion: {
      ru: 'Готово! Вы успешно скачали отчет на свой компьютер.',
      en: 'Done! You have successfully downloaded the report to your computer.'
    }
  },
  {
    id: 4,
    title: {
      ru: 'Как сгенерировать и скачать отчет по транзакциям?',
      en: 'How to Generate and Download Transaction Report?'
    },
    description: {
      ru: 'Следуйте этим простым шагам, чтобы скачать отчет по транзакциям.',
      en: 'Follow these simple steps to download your Transaction report.'
    },
    category: 'pump-price',
    readTime: 3,
    stepsCount: 5,
    mainImage: {
      ru: asset('images/iTrucking-Pro/transaction-report/transaction-report-main.png'),
      en: asset('images/iTrucking-Pro/transaction-report/transaction-report-main-en.png')
    },
    steps: [
      {
        title: {
          ru: 'Войдите в систему',
          en: 'Log In to the System'
        },
        content: {
          ru: 'Войдите в систему на портале iTrucking Pro по ссылке: <a href="https://itrucking.pro/" target="_blank" style="color: var(--accent); text-decoration: underline;">itrucking.pro</a>. Нажмите кнопку "Log in to Portal" и введите свой логин и пароль, которые были высланы вам на email при регистрации профиля',
          en: 'Log in to the iTrucking Pro Portal at: <a href="https://itrucking.pro/" target="_blank" style="color: var(--accent); text-decoration: underline;">itrucking.pro</a>. Click the "Log in to Portal" button and enter your login and password that were sent to your email when your profile was registered'
        },
        image: asset('images/iTrucking-Pro/transaction-report/transaction-step1.png'),
        note: {
          ru: 'Письмо с логином и паролем было выслано вам с адреса <strong>fuel@itrucking.pro</strong>',
          en: 'The email with your login and password was sent from <strong>fuel@itrucking.pro</strong>'
        }
      },
      {
        title: {
          ru: 'Найдите раздел Reports',
          en: 'Find the Reports Section'
        },
        content: {
          ru: 'Найдите и нажмите "Reports"',
          en: 'Find and click "Reports"'
        },
        image: asset('images/iTrucking-Pro/transaction-report/transaction-step2.png')
      },
      {
        title: {
          ru: 'Выберите тип отчета',
          en: 'Select Report Type'
        },
        content: {
          ru: 'Найдите и нажмите "Transaction Report"',
          en: 'Find and click "Transaction Report"'
        },
        image: asset('images/iTrucking-Pro/transaction-report/transaction-step3.png')
      },
      {
        title: {
          ru: 'Укажите период отчета',
          en: 'Specify Report Period'
        },
        content: {
          ru: 'Выберите дату начала отчета в поле "Start Date" и дату окончания отчета в поле "End Date"',
          en: 'Select the report start date in the "Start Date" field and the end date in the "End Date" field'
        },
        image: asset('images/iTrucking-Pro/transaction-report/transaction-step4.png')
      },
      {
        title: {
          ru: 'Сгенерируйте PDF',
          en: 'Generate PDF'
        },
        content: {
          ru: 'Нажмите на кнопку "Generate PDF"',
          en: 'Click the "Generate PDF" button'
        },
        image: asset('images/iTrucking-Pro/transaction-report/transaction-step5.png')
      }
    ],
    conclusion: {
      ru: 'Готово! Вы успешно скачали отчет на свой компьютер.',
      en: 'Done! You have successfully downloaded the report to your computer.'
    }
  },
  {
    id: 5,
    title: {
      ru: 'Как создать или изменить юзера/драйвера в приложении iTrucking Pro?',
      en: 'How to Create or Edit User/Driver in iTrucking Pro App?'
    },
    description: {
      ru: 'Следуйте этой простой инструкции, для добавления или изменения данных юзеров/драйверов для ваших топливных карт.',
      en: 'Follow this simple guide to add or edit user/driver data for your fuel cards.'
    },
    category: 'pump-price',
    readTime: 5,
    stepsCount: 6,
    mainImage: {
      ru: asset('images/iTrucking-Pro/manage-users/users-main.png'),
      en: asset('images/iTrucking-Pro/manage-users/users-main-en.png')
    },
    steps: [
      {
        title: {
          ru: 'Войдите в систему',
          en: 'Log In to the System'
        },
        content: {
          ru: 'Войдите в систему на портале <strong>iTrucking Pro</strong> по ссылке: <a href="https://itrucking.pro/" target="_blank" style="color: var(--accent); text-decoration: underline;">itrucking.pro</a>. Нажмите кнопку "Log in to Portal" и введите свой логин и пароль, которые были высланы вам на email при регистрации профиля',
          en: 'Log in to the <strong>iTrucking Pro</strong> Portal at: <a href="https://itrucking.pro/" target="_blank" style="color: var(--accent); text-decoration: underline;">itrucking.pro</a>. Click the "Log in to Portal" button and enter your login and password that were sent to your email when your profile was registered'
        },
        image: asset('images/iTrucking-Pro/manage-users/users-step1.png'),
        note: {
          ru: 'Письмо с логином и паролем было выслано вам с адреса <strong>fuel@itrucking.pro</strong>',
          en: 'The email with your login and password was sent from <strong>fuel@itrucking.pro</strong>'
        }
      },
      {
        title: {
          ru: 'Откройте настройки',
          en: 'Open Settings'
        },
        content: {
          ru: 'На главной странице "Dashboard" вашего аккаунта выберите пункт "Settings".',
          en: 'On your account Dashboard page, select "Settings".'
        },
        image: asset('images/iTrucking-Pro/manage-users/users-step2.png'),
        note: {
          ru: 'В появившемся окне вы также можете заполнить данные вашей компании',
          en: 'In the window that appears, you can also fill in your company details'
        },
        noteImage: asset('images/iTrucking-Pro/manage-users/users-step2-note.png')
      },
      {
        title: {
          ru: 'Перейдите в раздел Users',
          en: 'Go to Users Section'
        },
        content: {
          ru: 'Для перехода к разделу юзеры, нажмите соответствующую кнопку "Users"',
          en: 'To go to the users section, click the "Users" button'
        },
        image: asset('images/iTrucking-Pro/manage-users/users-step3.png')
      },
      {
        title: {
          ru: 'Добавьте нового пользователя',
          en: 'Add New User'
        },
        content: {
          ru: 'Вы увидите список уже существующих юзеров. Для добавления нового пользователя, нажмите кнопку "Add User"',
          en: 'You will see a list of existing users. To add a new user, click the "Add User" button'
        },
        image: asset('images/iTrucking-Pro/manage-users/users-step4.png')
      },
      {
        title: {
          ru: 'Заполните данные пользователя',
          en: 'Fill in User Details'
        },
        content: {
          ru: 'В появившемся окне заполните данные пользователя: <strong>Email, Пароль, Имя, Фамилия</strong>. Важно правильно выбрать тип аккаунта (Сотрудник или Владелец/Оператор) и установить права использования (права администратора или владелец карты).',
          en: 'In the window that appears, fill in the user details: <strong>Email, Password, First Name, Last Name</strong>. It is important to correctly select the account type (Employee or Owner/Operator) and set usage rights (administrator rights or card holder).'
        },
        image: asset('images/iTrucking-Pro/manage-users/users-step5.png'),
        note: {
          ru: 'Если вы предоставляете пользователю права администратора "Fleet Administrator", то созданный пользователь сможет создавать/управлять юзерами, менять настройки, и управлять картами (если данный функционал предоставлен провайдером)',
          en: 'If you grant "Fleet Administrator" rights to a user, the created user will be able to create/manage users, change settings, and manage cards (if this functionality is provided by the provider)'
        }
      },
      {
        title: {
          ru: 'Сохраните пользователя',
          en: 'Save User'
        },
        content: {
          ru: 'После введения всех данных нажмите кнопку "Save User". После этого пользователю автоматически придет письмо на указанный электронный адрес с инструкциями как зайти в приложение iTrucking Pro.',
          en: 'After entering all the data, click the "Save User" button. After this, the user will automatically receive an email at the specified address with instructions on how to log in to the iTrucking Pro app.'
        },
        image: asset('images/iTrucking-Pro/manage-users/users-step6.png'),
        hasEditingSection: true
      }
    ],
    editingSteps: [
      {
        title: {
          ru: 'Редактирование пользователя',
          en: 'Editing a User'
        },
        content: {
          ru: 'Для того, чтобы редактировать юзера перейдите в раздел "Users" и нажмите на иконку "карандаш", напротив пользователя, которому необходимо внести изменения.',
          en: 'To edit a user, go to the "Users" section and click the "pencil" icon next to the user you need to modify.'
        },
        image: asset('images/iTrucking-Pro/manage-users/users-edit1.png')
      },
      {
        title: {
          ru: 'Изменение информации',
          en: 'Changing Information'
        },
        content: {
          ru: 'В появившемся окне вы можете изменить необходимую информацию, после чего нажать на кнопку "Save User"',
          en: 'In the window that appears, you can change the necessary information, then click the "Save User" button'
        },
        image: asset('images/iTrucking-Pro/manage-users/users-edit2.png')
      },
      {
        title: {
          ru: 'Установка роли',
          en: 'Setting Role'
        },
        content: {
          ru: 'В разделе "Roles" вы можете установить новую роль для пользователя',
          en: 'In the "Roles" section, you can set a new role for the user'
        },
        image: asset('images/iTrucking-Pro/manage-users/users-edit3.png')
      },
      {
        title: {
          ru: 'Изменение пароля',
          en: 'Changing Password'
        },
        content: {
          ru: 'В разделе "Set password" вы можете установить новый пароль для пользователя (новый пароль отправится на email данного юзера)',
          en: 'In the "Set password" section, you can set a new password for the user (the new password will be sent to this user\'s email)'
        },
        image: asset('images/iTrucking-Pro/manage-users/users-edit4.png')
      },
      {
        title: {
          ru: 'Дополнительные действия',
          en: 'Additional Actions'
        },
        content: {
          ru: 'В разделе "Action" вы можете:<br>• сгенерировать автоматический случайный новый пароль, который будет отправлен на email пользователя<br>• отправить пользователю ссылку с инструкцией как войти в программу<br>• деактивировать пользователя',
          en: 'In the "Action" section you can:<br>• generate an automatic random new password that will be sent to the user\'s email<br>• send the user a link with instructions on how to log into the program<br>• deactivate the user'
        },
        image: asset('images/iTrucking-Pro/manage-users/users-edit5.png')
      }
    ],
    note: {
      ru: 'Вам также будет доступна возможность в любой момент редактировать пользователей, устанавливать разные роли и другое (Данный функционал доступен только для аккаунта с правами администратора - "Fleet Administrator").',
      en: 'You will also be able to edit users at any time, set different roles, and more (This functionality is only available for accounts with administrator rights - "Fleet Administrator").'
    },
    conclusion: {
      ru: 'Готово! Вы успешно создали/изменили юзеров-драйверов в вашем аккаунте iTrucking Pro.',
      en: 'Done! You have successfully created/edited user-drivers in your iTrucking Pro account.'
    }
  },
  {
    id: 6,
    title: {
      ru: 'Как привязывать созданных пользователей к конкретным картам и назначать им названия?',
      en: 'How to Assign Created Users to Specific Cards and Name Them?'
    },
    description: {
      ru: 'Следуйте этой простой инструкции, чтобы привязать пользователя/юзера к конкретной карте.',
      en: 'Follow this simple guide to assign a user to a specific card.'
    },
    category: 'pump-price',
    readTime: 2,
    stepsCount: 4,
    mainImage: {
      ru: asset('images/iTrucking-Pro/assign-cards/assign-cards-main.png'),
      en: asset('images/iTrucking-Pro/assign-cards/assign-cards-main-en.png')
    },
    steps: [
      {
        title: {
          ru: 'Войдите в систему',
          en: 'Log In to the System'
        },
        content: {
          ru: 'Войдите в систему на портале <strong>iTrucking Pro</strong> по ссылке: <a href="https://itrucking.pro/" target="_blank" style="color: var(--accent); text-decoration: underline;">itrucking.pro</a>. Нажмите кнопку "Log in to Portal" и введите свой логин и пароль, которые были высланы вам на email при регистрации профиля',
          en: 'Log in to the <strong>iTrucking Pro</strong> Portal at: <a href="https://itrucking.pro/" target="_blank" style="color: var(--accent); text-decoration: underline;">itrucking.pro</a>. Click the "Log in to Portal" button and enter your login and password that were sent to your email when your profile was registered'
        },
        image: asset('images/iTrucking-Pro/assign-cards/assign-cards-step1.png'),
        note: {
          ru: 'Письмо с логином и паролем было выслано вам с адреса <strong>fuel@itrucking.pro</strong>',
          en: 'The email with your login and password was sent from <strong>fuel@itrucking.pro</strong>'
        }
      },
      {
        title: {
          ru: 'Перейдите в раздел Fuel Cards',
          en: 'Go to Fuel Cards Section'
        },
        content: {
          ru: 'На главной странице "Dashboard" вашего аккаунта перейдите в раздел "Fuel Cards".',
          en: 'On your account Dashboard page, go to the "Fuel Cards" section.'
        },
        image: asset('images/iTrucking-Pro/assign-cards/assign-cards-step2.png')
      },
      {
        title: {
          ru: 'Откройте настройки необходимой карты',
          en: 'Open Card Details'
        },
        content: {
          ru: 'В появившемся окне напротив необходимой карты нажмите на иконку "view"',
          en: 'In the window that appears, click the "view" icon next to the desired card'
        },
        image: asset('images/iTrucking-Pro/assign-cards/assign-cards-step3.png')
      },
      {
        title: {
          ru: 'Привяжите пользователя и назначьте имя карте',
          en: 'Assign User and Set Card Name'
        },
        content: {
          ru: 'В первом пункте "Assign to Driver" выберите пользователя, которому передали данную карту, и во втором пункте "Set a Card Nickname" установите имя карты. Например: "TR 01 Company Name". После этого нажмите кнопку "сохранить".',
          en: 'In the first field "Assign to Driver" select the user who was given this card, and in the second field "Set a Card Nickname" set the card name. For example: "TR 01 Company Name". Then click the "save" button.'
        },
        image: asset('images/iTrucking-Pro/assign-cards/assign-cards-step4.png'),
        note: {
          ru: 'Пользователь сможет видеть свои транзакции по данной карте через приложение iTrucking Pro',
          en: 'The user will be able to see their transactions for this card through the iTrucking Pro app'
        }
      }
    ],
    conclusion: {
      ru: 'Готово! Вы успешно привязали карту к пользователю в вашем аккаунте iTrucking Pro.',
      en: 'Done! You have successfully assigned the card to a user in your iTrucking Pro account.'
    }
  },
  {
    id: 7,
    title: {
      ru: 'Как установить номер Юнита и PIN вашим топливным картам в приложении iTrucking Pro? ‼️',
      en: 'How to Set Unit Number and PIN for Your Fuel Cards in iTrucking Pro App? ‼️'
    },
    description: {
      ru: 'Следуйте этой простой инструкции, для установки номера Юнита и PIN для ваших топливных карт. (функционал доступен для компаний с 10+ траками)',
      en: 'Follow this simple guide to set Unit number and PIN for your fuel cards. (available for companies with 10+ trucks)'
    },
    category: 'pump-price',
    readTime: 7,
    stepsCount: 9,
    mainImage: {
      ru: asset('images/iTrucking-Pro/unit-pin/unit-pin-main.png'),
      en: asset('images/iTrucking-Pro/unit-pin/unit-pin-main-en.png')
    },
    steps: [
      {
        title: {
          ru: 'Войдите в систему',
          en: 'Log In to the System'
        },
        content: {
          ru: 'Войдите в систему на портале iTrucking Pro по ссылке: <a href="https://itrucking.pro/" target="_blank" style="color: var(--accent); text-decoration: underline;">itrucking.pro</a>. Нажмите кнопку "Log in to Portal" и введите свой логин и пароль, которые были высланы вам на email при регистрации профиля. Войдите со своего аккаунта "Fleet Administrator"',
          en: 'Log in to the iTrucking Pro Portal at: <a href="https://itrucking.pro/" target="_blank" style="color: var(--accent); text-decoration: underline;">itrucking.pro</a>. Click the "Log in to Portal" button and enter your login and password that were sent to your email when your profile was registered. Use your "Fleet Administrator" account'
        },
        image: asset('images/iTrucking-Pro/unit-pin/unit-pin-step1.png'),
        note: {
          ru: 'Письмо с логином и паролем было выслано вам с адреса <strong>fuel@itrucking.pro</strong>',
          en: 'The email with your login and password was sent from <strong>fuel@itrucking.pro</strong>'
        }
      },
      {
        title: {
          ru: 'Перейдите в раздел Fuel Cards',
          en: 'Go to Fuel Cards Section'
        },
        content: {
          ru: 'Найдите раздел "Fuel Cards" и нажмите на него',
          en: 'Find the "Fuel Cards" section and click on it'
        },
        image: asset('images/iTrucking-Pro/unit-pin/unit-pin-step2.png')
      },
      {
        title: {
          ru: 'Выберите карту',
          en: 'Select a Card'
        },
        content: {
          ru: 'Выберите карту, которую вы хотите настроить/изменить и нажмите напротив неё на иконку "View"',
          en: 'Select the card you want to configure/modify and click the "View" icon next to it'
        },
        image: asset('images/iTrucking-Pro/unit-pin/unit-pin-step3.png')
      },
      {
        title: {
          ru: 'Откройте управление EFS картой',
          en: 'Open EFS Card Management'
        },
        content: {
          ru: 'В появившемся окне нажмите кнопку "Manage EFS Card"',
          en: 'In the window that appears, click the "Manage EFS Card" button'
        },
        image: asset('images/iTrucking-Pro/unit-pin/unit-pin-step4.png')
      },
      {
        title: {
          ru: 'Перейдите к настройке контролей',
          en: 'Proceed to Controls Settings'
        },
        content: {
          ru: 'На данном этапе вы в любой момент можете активировать карту, деактивировать, или приостановить. В разделе "EFS Card Controls" вы можете установить номер юнита и пинкод карты. Для этого нажмите на кнопку "Add New"',
          en: 'At this stage, you can activate, deactivate, or suspend the card at any time. In the "EFS Card Controls" section, you can set the unit number and card PIN. To do this, click the "Add New" button'
        },
        image: asset('images/iTrucking-Pro/unit-pin/unit-pin-step5.png')
      },
      {
        title: {
          ru: 'Выберите тип контроля Driver ID',
          en: 'Select Driver ID Control Type'
        },
        content: {
          ru: 'Появится окно где нужно выбрать необходимый "Control Type". Для этого нажмите на выпадающий список "Select a Control Type" и выберите пункт "Driver ID" (DRID)',
          en: 'A window will appear where you need to select the required "Control Type". Click the "Select a Control Type" dropdown and select "Driver ID" (DRID)'
        },
        image: asset('images/iTrucking-Pro/unit-pin/unit-pin-step6.png')
      },
      {
        title: {
          ru: 'Установите PIN-код',
          en: 'Set PIN Code'
        },
        content: {
          ru: 'Введите цифры, которые будут паролем (PIN) на данной карте. После этого нажмите "Save"',
          en: 'Enter the digits that will be the password (PIN) for this card. Then click "Save"'
        },
        image: asset('images/iTrucking-Pro/unit-pin/unit-pin-step7.png')
      },
      {
        title: {
          ru: 'Добавьте номер юнита',
          en: 'Add Unit Number'
        },
        content: {
          ru: 'Далее нажмите кнопку "Add New" и выберите следующий "Control Type" - Unit #. И введите номер вашего юнита/трака',
          en: 'Then click the "Add New" button and select the next "Control Type" - Unit #. And enter your unit/truck number'
        },
        image: asset('images/iTrucking-Pro/unit-pin/unit-pin-step8.png')
      },
      {
        title: {
          ru: 'Проверьте и сохраните',
          en: 'Verify and Save'
        },
        content: {
          ru: 'Убедитесь, что вы правильно выбрали два вида Control Type и ввели правильные данные. После этого нажмите кнопку "Save".',
          en: 'Make sure you have correctly selected both Control Types and entered the correct data. Then click the "Save" button.'
        },
        image: asset('images/iTrucking-Pro/unit-pin/unit-pin-step9.png')
      }
    ],
    conclusion: {
      ru: 'Готово! Вы успешно установили номер юнита и PIN выбранной карты.',
      en: 'Done! You have successfully set the unit number and PIN for the selected card.'
    }
  },
  {
    id: 8,
    title: {
      ru: 'Как зарегистрироваться в дисконтной программе на шины?',
      en: 'How to Register for the Tire Discount Program?'
    },
    description: {
      ru: 'Простая инструкция по регистрации в программе скидок на шины',
      en: 'Simple guide to register for the tire discount program'
    },
    category: 'tire-discount',
    readTime: 1,
    stepsCount: 0,
    mainImage: {
      ru: asset('images/tire-discount/register/tire-discount-main.png'),
      en: asset('images/tire-discount/register/tire-discount-main-en.png')
    },
    intro: {
      ru: 'Перейдите по ссылке и заполните свои данные в форме ➡️: <a href="https://forms.gle/pnMeq9d2FXWsAM3e9" target="_blank" style="color: var(--accent); text-decoration: underline; font-weight: 600;">Нажмите на этот текст</a>',
      en: 'Follow the link and fill in your details in the form ➡️: <a href="https://forms.gle/pnMeq9d2FXWsAM3e9" target="_blank" style="color: var(--accent); text-decoration: underline; font-weight: 600;">Click on this text</a>'
    },
    instructionsList: [
      {
        ru: 'Введите ваше имя',
        en: 'Enter your name'
      },
      {
        ru: 'Введите ваш номер телефона',
        en: 'Enter your phone number'
      },
      {
        ru: 'Введите название вашей компании',
        en: 'Enter your company name'
      },
      {
        ru: 'Введите адрес электронной почты вашей компании',
        en: 'Enter your company email address'
      },
      {
        ru: 'Введите DOT-номер вашей компании (на данный момент это обязательное условие для участия в программе)',
        en: 'Enter your company DOT number (this is currently a mandatory requirement for program participation)'
      }
    ],
    tip: {
      ru: 'Если Вы уже зарегистрированы в дисконтной программе, перейдите на <a href="#tutorial-9" class="internal-link" style="color: var(--accent); text-decoration: underline;">эту страницу</a>, чтобы узнать как воспользоваться скидками: "Как воспользоваться скидками по дисконтной программе на шины?"',
      en: 'If you are already registered in the discount program, go to <a href="#tutorial-9" class="internal-link" style="color: var(--accent); text-decoration: underline;">this page</a> to learn how to use the discounts: "How to Use Tire Discount Program Benefits?"'
    }
  },
  {
    id: 9,
    title: {
      ru: 'Как воспользоваться скидками по дисконтной программе на шины?',
      en: 'How to Use Tire Discount Program Benefits?'
    },
    description: {
      ru: 'Пошаговая инструкция использования скидок на шины в сервисных центрах Love\'s и Speedco',
      en: 'Step-by-step guide to using tire discounts at Love\'s and Speedco service centers'
    },
    category: 'tire-discount',
    readTime: 2,
    stepsCount: 4,
    mainImage: {
      ru: asset('images/tire-discount/use-discounts/tire-discount-use-main.png'),
      en: asset('images/tire-discount/use-discounts/tire-discount-use-main-en.png')
    },
    preIntro: {
      ru: 'Если вы уже прошли регистрацию на участие в дисконтной программе на шины, то Вы теперь имеете доступ к эксклюзивным ценам со скидкой на основные бренды шин в участвующих в программе сервисных центрах Love\'s и Speedco по всей территории США.',
      en: 'If you have already registered to participate in the tire discount program, you now have access to exclusive discounted prices on major tire brands at participating Love\'s and Speedco service centers across the United States.'
    },
    preIntroImage: asset('images/tire-discount/use-discounts/tire-discount-instruction-header.png'),
    preIntroLink: {
      ru: 'Если Вы еще не зарегистрированы в дисконтной программе, перейдите на <a href="#tutorial-8" class="internal-link" style="color: var(--accent); text-decoration: underline;">эту страницу</a> ➡️',
      en: 'If you are not yet registered in the discount program, go to <a href="#tutorial-8" class="internal-link" style="color: var(--accent); text-decoration: underline;">this page</a> ➡️'
    },
    steps: [
      {
        title: {
          ru: 'Идентификация участника',
          en: 'Member Identification'
        },
        content: {
          ru: 'В любом сервисном центре Love\'s или Speedco сообщите персоналу, что у вас есть скидки по подписке (членству) по вашему номеру DOT.',
          en: 'At any Love\'s or Speedco service center, inform the staff that you have subscription (membership) discounts using your DOT number.'
        }
      },
      {
        title: {
          ru: 'Начало заказа',
          en: 'Starting the Order'
        },
        content: {
          ru: 'Попросите их начать сервисный заказ, используя ваш номер DOT. Четко укажите, что это «наличный расчет (cash account)», и вы оплатите все услуги на месте.',
          en: 'Ask them to start a service order using your DOT number. Clearly specify that this is a "cash account" and you will pay for all services on site.'
        }
      },
      {
        title: {
          ru: 'Уточнение типа аккаунта',
          en: 'Clarifying Account Type'
        },
        content: {
          ru: 'Подчеркните, что это «членский аккаунт» по вашему DOT, а НЕ национальный аккаунт. Подтвердите, что для этой подписки нет конкретного номера счета, и что вашего номера DOT достаточно.',
          en: 'Emphasize that this is a "membership account" under your DOT, NOT a national account. Confirm that there is no specific account number for this subscription, and that your DOT number is sufficient.'
        }
      },
      {
        title: {
          ru: 'Подтверждение скидки',
          en: 'Discount Confirmation'
        },
        content: {
          ru: 'Пожалуйста, имейте в виду, что кассир может изначально не видеть скидки в своей системе. При этом, цена со скидкой будет применена и четко видна в вашем окончательном заказе.',
          en: 'Please note that the cashier may not initially see the discounts in their system. However, the discounted price will be applied and clearly visible in your final order.'
        }
      }
    ]
  }
]
