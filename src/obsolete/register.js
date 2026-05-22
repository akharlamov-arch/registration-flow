const TRANSLATIONS = {
  en: {
    languageLabel: 'Language',
    progressTitleDefault: 'Application progress',
    progressTitleReview: 'Registration progress',
    progressTitleComplete: 'Application completed!',
    pageTitleStep1: 'Start your registration with us',
    pageTitleStep5: 'Please review your information',
    pageTitleStep6: 'Your application received!',
    pageTitleDefault: 'Continue filling out the form',
    pageSubtitleStep1: 'Answer a short set of questions so we can tailor the service to your fleet. ',
    pageSubtitleStrongStep1: 'It only takes 2 minutes.',
    pageSubtitleStep5: 'Please check all details below. Make sure everything is correct before submitting. You can edit any information by going back to the previous steps.',
    pageSubtitleStep6: 'Thank you for the information you have provided. We need time to check everything and get back to you.',
    pageSubtitleDefault: 'Please complete the remaining steps to move forward with your registration.',
    step1Title: 'Your contact information',
    step1Subtitle: 'Tell us about yourself',
    labelFirstName: 'First name',
    labelLastName: 'Last name',
    labelEmail: 'Email',
    labelPhone: 'Phone number',
    placeholderFirstName: 'First name',
    placeholderLastName: 'Last name',
    placeholderEmail: 'example@gmail.com',
    placeholderPhone: '(202) 555-0139',
    helperEmail: 'Make sure your email is correct — we’ll send important account details there.',
    nextStep: 'Next step',
    previousStep: 'Previous step',
    step2Title: 'How would you like to set up your account?',
    step2Subtitle: 'Choose the option that best matches how you plan to use the service.',
    accountPersonalLabel: 'Personal',
    accountBusinessLabel: 'Business',
    accountPersonalTitle: 'Personal account',
    accountBusinessTitle: 'Business account',
    accountPersonalText: 'For individual use, if you <strong>do NOT have</strong> your own company. The contract and billing will be linked to <strong>your personal information.</strong>',
    accountBusinessText: 'For companies or fleets. The contract and payments will be connected directly to <strong>your business bank account.</strong>',
    accountBusinessNote: 'The business must be <strong>your own company</strong>, not the carrier you currently work under.',
    accountBusinessConfirm: 'I confirm that I <strong>own or legally represent</strong> the business entity.',
    helperReviewSign: 'You’ll review and sign the contract later in the process.',
    step3Title: 'Company Information',
    step3Subtitle: 'Tell us about your company',
    labelCompanyName: 'Company name',
    placeholderCompanyName: 'Put your Company Name',
    labelBusinessType: 'Business formation type',
    selectPlaceholder: 'Select',
    businessTypeSole: 'Sole Proprietorship',
    businessTypePartnership: 'Partnership',
    businessTypeLlc: 'LLC',
    businessTypeCorporation: 'Corporation',
    labelCompanyTitle: 'Your company title',
    companyTitleAccountant: 'Accountant',
    companyTitlePresident: 'President',
    companyTitleOwner: 'Owner',
    companyTitleOther: 'Other',
    labelFleetSize: 'How many trucks do you have?',
    placeholderFleetSize: '1-99',
    labelDotOptional: 'Company DOT (optional)',
    placeholderDot: '1234567',
    labelMcOptional: 'Company MC (optional)',
    placeholderMc: '1234567',
    step4Title: 'Who recommended us?',
    step4Subtitle: 'Tell us about your <strong>Referral</strong>.',
    labelRefFirstName: 'Referral First name',
    labelRefLastName: 'Referral Last name',
    labelRefCompany: 'Referral Company Name',
    placeholderRefCompany: 'Truck Dream LLC',
    labelRefNotes: 'Notes (optional)',
    placeholderRefNotes: 'Any additional notes…',
    helperReferral: 'It helps to build strong relationships.',
    step5Title: 'Review your details',
    step5Subtitle: 'Check that everything below is correct before submitting.',
    summaryContactTitle: 'Contact information',
    summaryBusinessTitle: 'Business information',
    summaryReferralTitle: 'Recommended by',
    editLabel: 'edit',
    ariaEditContact: 'Edit contact information',
    ariaEditBusiness: 'Edit business information',
    ariaEditReferral: 'Edit referral information',
    ariaEditFleet: 'Edit fleet size',
    summaryFleetTitle: 'Fleet size',
    summaryTrucks: 'trucks',
    summaryDotLabel: 'DOT -',
    summaryMcLabel: 'MC -',
    notAvailable: 'n/a',
    submit: 'Submit',
    submitting: 'Submitting…',
    receivedLead: 'We received your applicaton for {accountType} account and will review it shortly',
    accountTypePersonal: 'Personal',
    accountTypeBusiness: 'Business',
    receivedPrepareStart: 'Prepare a ',
    receivedPrepareCheck: 'VOIDED BANK CHECK',
    receivedPrepareAnd: ' and ',
    receivedPrepareLicense: 'VALID DRIVER LICENSE',
    receivedPrepareEnd: '. These documents will need to be attached to the agreement if your application is approved.',
    receivedContactTimeline: 'We will contact you within 7 business days.',
    receivedFooter: 'You may close this window. Thanks',
    errorFirstNameRequired: 'First name required',
    errorLastNameRequired: 'Last name required',
    errorEmailRequired: 'Valid email required',
    errorPhoneRequired: 'Phone required',
    errorPhoneInvalid: 'Enter a valid 10-digit phone number',
    errorAccountTypeRequired: 'Please select an account type',
    errorBusinessConfirmRequired: 'Please confirm you own or represent the business',
    errorFuelProgramRequired: 'Please select an option',
    errorRefFirstNameRequired: 'Referral first name required',
    errorRefLastNameRequired: 'Referral last name required',
    errorRefPhoneInvalid: 'Enter a valid 10-digit phone number',
    errorCompanyNameRequired: 'Company name required',
    errorBusinessTypeRequired: 'Business type required',
    errorCompanyTitleRequired: 'Your title is required',
    errorFleetSizeRequired: 'Fleet size required',
    errorSaveLeadFailed: 'Failed to save lead.',
    errorNetworkSaveLead: 'Network error while saving lead. Please try again.',
    errorFileTypeInvalid: 'Invalid file type. Upload a PDF or image file.',
    errorFileTooLarge: 'File too large. Max 10MB.',
    uploadSuccess: 'Upload completed successfully.',
    uploadFailed: 'Upload failed. Please try again.',
    step4FuelTitle: 'Are you currently using another fuel discount program?',
    step4FuelSubtitle: 'To offer you the best possible experience, we need to know which services you use. This helps us tailor our services to your individual needs and provide you with more personalized benefits.',
    fuelYesOption: 'Yes, I used other Fuel Card(s)',
    fuelNoOption: "No, I've never used any fuel program",
    fuelUploadTitle: 'Please attach your last FUEL INVOICE or CURRENT FUEL CARD',
    fuelUploadSubtitle: 'Invoice must be dated within last 2 weeks and must match the name that you are using to apply for this account',
    attachFuelInvoice: 'Attach a FILE',
    changeFuelInvoice: 'Change FILE',
    fuelInvoiceWarning: 'Please attach your fuel invoice or card'
  },
  es: {
    languageLabel: 'Idioma',
    progressTitleDefault: 'Progreso de la solicitud',
    progressTitleReview: 'Progreso del registro',
    progressTitleComplete: '¡Solicitud completada!',
    pageTitleStep1: 'Comienza tu registro con nosotros',
    pageTitleStep5: 'Revisa tu información',
    pageTitleStep6: '¡Tu solicitud fue recibida!',
    pageTitleDefault: 'Continúa completando el formulario',
    pageSubtitleStep1: 'Responde un breve conjunto de preguntas para que podamos adaptar el servicio a tu flota. ',
    pageSubtitleStrongStep1: 'Solo toma 2 minutos.',
    pageSubtitleStep5: 'Revisa todos los detalles a continuación. Asegúrate de que todo sea correcto antes de enviar. Puedes editar cualquier información volviendo a los pasos anteriores.',
    pageSubtitleStep6: 'Gracias por la información que has proporcionado. Necesitamos tiempo para revisarla y comunicarnos contigo.',
    pageSubtitleDefault: 'Completa los pasos restantes para avanzar con tu registro.',
    step1Title: 'Tu información de contacto',
    step1Subtitle: 'Cuéntanos sobre ti',
    labelFirstName: 'Nombre',
    labelLastName: 'Apellido',
    labelEmail: 'Correo electrónico',
    labelPhone: 'Número de teléfono',
    placeholderFirstName: 'Nombre',
    placeholderLastName: 'Apellido',
    placeholderEmail: 'ejemplo@gmail.com',
    placeholderPhone: '(202) 555-0139',
    helperEmail: 'Asegúrate de que tu correo sea correcto: enviaremos información importante allí.',
    nextStep: 'Siguiente paso',
    previousStep: 'Paso anterior',
    step2Title: '¿Cómo te gustaría configurar tu cuenta?',
    step2Subtitle: 'Elige la opción que mejor se adapte a cómo planeas usar el servicio.',
    accountPersonalLabel: 'Personal',
    accountBusinessLabel: 'Empresarial',
    accountPersonalTitle: 'Cuenta personal',
    accountBusinessTitle: 'Cuenta empresarial',
    accountPersonalText: 'Para uso individual, si <strong>NO tienes</strong> tu propia empresa. El contrato y la facturación se vincularán a <strong>tu información personal.</strong>',
    accountBusinessText: 'Para empresas o flotas. El contrato y los pagos estarán conectados directamente a <strong>tu cuenta bancaria empresarial.</strong>',
    accountBusinessNote: 'La empresa debe ser <strong>tu propia compañía</strong>, no el transportista para el que trabajas actualmente.',
    accountBusinessConfirm: 'Confirmo que <strong>soy dueño o represento legalmente</strong> a la entidad comercial.',
    helperReviewSign: 'Revisarás y firmarás el contrato más adelante en el proceso.',
    step3Title: 'Información de la empresa',
    step3Subtitle: 'Cuéntanos sobre tu empresa',
    labelCompanyName: 'Nombre de la empresa',
    placeholderCompanyName: 'Escribe el nombre de tu empresa',
    labelBusinessType: 'Tipo de constitución',
    selectPlaceholder: 'Seleccionar',
    businessTypeSole: 'Propietario único',
    businessTypePartnership: 'Sociedad',
    businessTypeLlc: 'LLC',
    businessTypeCorporation: 'Corporación',
    labelCompanyTitle: 'Tu cargo en la empresa',
    companyTitleAccountant: 'Contador',
    companyTitlePresident: 'Presidente',
    companyTitleOwner: 'Propietario',
    companyTitleOther: 'Otro',
    labelFleetSize: '¿Cuántos camiones tienes?',
    placeholderFleetSize: '1-99',
    labelDotOptional: 'DOT de la empresa (opcional)',
    placeholderDot: '1234567',
    labelMcOptional: 'MC de la empresa (opcional)',
    placeholderMc: '1234567',
    step4Title: '¿Quién nos recomendó?',
    step4Subtitle: 'Cuéntanos sobre tu <strong>Referencia</strong>.',
    labelRefFirstName: 'Nombre de la referencia',
    labelRefLastName: 'Apellido de la referencia',
    labelRefCompany: 'Nombre de la empresa de la referencia',
    placeholderRefCompany: 'Truck Dream LLC',
    labelRefNotes: 'Notas (opcional)',
    placeholderRefNotes: 'Notas adicionales…',
    helperReferral: 'Ayuda a construir relaciones sólidas.',
    step5Title: 'Revisa tus detalles',
    step5Subtitle: 'Verifica que todo a continuación sea correcto antes de enviar.',
    summaryContactTitle: 'Información de contacto',
    summaryBusinessTitle: 'Información comercial',
    summaryReferralTitle: 'Recomendado por',
    editLabel: 'editar',
    ariaEditContact: 'Editar información de contacto',
    ariaEditBusiness: 'Editar información comercial',
    ariaEditReferral: 'Editar información de referencia',
    ariaEditFleet: 'Editar tamaño de flota',
    summaryFleetTitle: 'Tamaño de flota',
    summaryTrucks: 'camiones',
    summaryDotLabel: 'DOT -',
    summaryMcLabel: 'MC -',
    notAvailable: 'n/d',
    submit: 'Enviar',
    submitting: 'Enviando…',
    receivedLead: 'Hemos enviado el código de solicitud {accountType} a tu correo. ¡Revisa tu bandeja de entrada!',
    accountTypePersonal: 'Personal',
    accountTypeBusiness: 'Empresarial',
    receivedPrepareStart: 'Prepara un ',
    receivedPrepareCheck: 'CHEQUE ANULADO',
    receivedPrepareAnd: ' y ',
    receivedPrepareLicense: 'LICENCIA DE CONDUCIR VÁLIDA',
    receivedPrepareEnd: '. Estos documentos deberán adjuntarse al acuerdo si tu solicitud es aprobada.',
    receivedContactTimeline: 'Nos pondremos en contacto contigo dentro de 7 días hábiles.',
    receivedFooter: 'Puedes cerrar esta ventana. Gracias',
    errorFirstNameRequired: 'Nombre requerido',
    errorLastNameRequired: 'Apellido requerido',
    errorEmailRequired: 'Se requiere un correo válido',
    errorPhoneRequired: 'Se requiere teléfono',
    errorPhoneInvalid: 'Ingresa un número de teléfono válido de 10 dígitos',
    errorAccountTypeRequired: 'Selecciona un tipo de cuenta',
    errorBusinessConfirmRequired: 'Confirma que eres dueño o representas a la empresa',
    errorFuelProgramRequired: 'Por favor selecciona una opción',
    errorRefFirstNameRequired: 'Se requiere el nombre de la referencia',
    errorRefLastNameRequired: 'Se requiere el apellido de la referencia',
    errorRefPhoneInvalid: 'Ingresa un número de teléfono válido de 10 dígitos',
    errorCompanyNameRequired: 'Se requiere el nombre de la empresa',
    errorBusinessTypeRequired: 'Se requiere el tipo de empresa',
    errorCompanyTitleRequired: 'Se requiere tu cargo',
    errorFleetSizeRequired: 'Se requiere el tamaño de la flota',
    errorSaveLeadFailed: 'No se pudo guardar el lead.',
    errorNetworkSaveLead: 'Error de red al guardar el lead. Inténtalo de nuevo.',
    step4FuelTitle: '¿Actualmente usas otro programa de descuento de combustible?',
    step4FuelSubtitle: 'Para ofrecerte la mejor experiencia posible, necesitamos saber qué servicios utilizas. Esto nos ayuda a adaptar nuestros servicios a tus necesidades individuales y brindarte beneficios más personalizados.',
    fuelYesOption: 'Sí, usé otras tarjetas de combustible',
    fuelNoOption: 'No, nunca he usado ningún programa de combustible',
    fuelUploadTitle: 'Adjunta tu última FACTURA DE COMBUSTIBLE o TARJETA DE COMBUSTIBLE ACTUAL',
    fuelUploadSubtitle: 'La factura debe tener fecha de las últimas 2 semanas y debe coincidir con el nombre que estás usando para solicitar esta cuenta',
    attachFuelInvoice: 'Adjuntar ARCHIVO',
    changeFuelInvoice: 'Cambiar ARCHIVO',
    fuelInvoiceWarning: 'Por favor adjunta tu factura o tarjeta de combustible'
  },
  uk: {
    languageLabel: 'Мова',
    progressTitleDefault: 'Прогрес заявки',
    progressTitleReview: 'Прогрес реєстрації',
    progressTitleComplete: 'Заявку завершено!',
    pageTitleStep1: 'Почніть реєстрацію з нами',
    pageTitleStep5: 'Перевірте вашу інформацію',
    pageTitleStep6: 'Вашу заявку отримано!',
    pageTitleDefault: 'Продовжуйте заповнювати форму',
    pageSubtitleStep1: 'Дайте відповіді на короткі запитання, щоб ми могли підібрати сервіс для вашого автопарку. ',
    pageSubtitleStrongStep1: 'Це займе лише 2 хвилини.',
    pageSubtitleStep5: 'Перевірте всі дані нижче. Переконайтеся, що все правильно перед відправленням. Ви можете редагувати будь-яку інформацію, повернувшись до попередніх кроків.',
    pageSubtitleStep6: 'Дякуємо за надану інформацію. Нам потрібен час, щоб усе перевірити й повернутися до вас.',
    pageSubtitleDefault: 'Будь ласка, завершіть решту кроків, щоб продовжити реєстрацію.',
    step1Title: 'Ваші контактні дані',
    step1Subtitle: 'Розкажіть про себе',
    labelFirstName: "Ім'я",
    labelLastName: 'Прізвище',
    labelEmail: 'Електронна пошта',
    labelPhone: 'Номер телефону',
    placeholderFirstName: "Ім'я",
    placeholderLastName: 'Прізвище',
    placeholderEmail: 'example@gmail.com',
    placeholderPhone: '(202) 555-0139',
    helperEmail: 'Переконайтеся, що ваша електронна пошта правильна — ми надішлемо туди важливі деталі.',
    nextStep: 'Наступний крок',
    previousStep: 'Попередній крок',
    step2Title: 'Як ви хочете налаштувати свій акаунт?',
    step2Subtitle: 'Оберіть варіант, який найкраще відповідає тому, як ви плануєте користуватися сервісом.',
    accountPersonalLabel: 'Особистий',
    accountBusinessLabel: 'Бізнес',
    accountPersonalTitle: 'Особистий акаунт',
    accountBusinessTitle: 'Бізнес-акаунт',
    accountPersonalText: 'Для індивідуального використання, якщо у вас <strong>НЕМАЄ</strong> власної компанії. Договір і оплата будуть прив’язані до <strong>ваших особистих даних.</strong>',
    accountBusinessText: 'Для компаній або автопарків. Договір і платежі будуть прив’язані безпосередньо до <strong>вашого бізнес-рахунку.</strong>',
    accountBusinessNote: 'Бізнес має бути <strong>вашою власною компанією</strong>, а не перевізником, у якого ви працюєте.',
    accountBusinessConfirm: 'Я підтверджую, що <strong>володію або законно представляю</strong> бізнес-організацію.',
    helperReviewSign: 'Ви переглянете та підпишете договір пізніше в процесі.',
    step3Title: 'Інформація про компанію',
    step3Subtitle: 'Розкажіть про вашу компанію',
    labelCompanyName: 'Назва компанії',
    placeholderCompanyName: 'Вкажіть назву компанії',
    labelBusinessType: 'Форма власності',
    selectPlaceholder: 'Виберіть',
    businessTypeSole: 'ФОП',
    businessTypePartnership: 'Партнерство',
    businessTypeLlc: 'ТОВ',
    businessTypeCorporation: 'Корпорація',
    labelCompanyTitle: 'Ваша посада в компанії',
    companyTitleAccountant: 'Бухгалтер',
    companyTitlePresident: 'Президент',
    companyTitleOwner: 'Власник',
    companyTitleOther: 'Інше',
    labelFleetSize: 'Скільки у вас вантажівок?',
    placeholderFleetSize: '1-99',
    labelDotOptional: 'DOT компанії (необов’язково)',
    placeholderDot: '1234567',
    labelMcOptional: 'MC компанії (необов’язково)',
    placeholderMc: '1234567',
    step4Title: 'Хто нас порекомендував?',
    step4Subtitle: 'Розкажіть про вашу <strong>рекомендацію</strong>.',
    labelRefFirstName: "Ім'я рекомендателя",
    labelRefLastName: 'Прізвище рекомендателя',
    labelRefCompany: 'Назва компанії рекомендателя',
    placeholderRefCompany: 'Truck Dream LLC',
    labelRefNotes: 'Нотатки (необов\u2019язково)',
    placeholderRefNotes: 'Додаткові нотатки…',
    helperReferral: 'Це допомагає будувати міцні стосунки.',
    step5Title: 'Перевірте свої дані',
    step5Subtitle: 'Переконайтеся, що все нижче правильно перед відправленням.',
    summaryContactTitle: 'Контактна інформація',
    summaryBusinessTitle: 'Інформація про бізнес',
    summaryReferralTitle: 'Рекомендовано',
    editLabel: 'редагувати',
    ariaEditContact: 'Редагувати контактну інформацію',
    ariaEditBusiness: 'Редагувати інформацію про бізнес',
    ariaEditReferral: 'Редагувати інформацію про рекомендацію',
    ariaEditFleet: 'Редагувати розмір автопарку',
    summaryFleetTitle: 'Розмір автопарку',
    summaryTrucks: 'вантажівок',
    summaryDotLabel: 'DOT -',
    summaryMcLabel: 'MC -',
    notAvailable: 'н/д',
    submit: 'Надіслати',
    submitting: 'Надсилання…',
    receivedLead: 'Ми надіслали код {accountType} заявки на вашу електронну пошту. Перевірте вхідні!',
    accountTypePersonal: 'особистої',
    accountTypeBusiness: 'бізнес',
    receivedPrepareStart: 'Підготуйте ',
    receivedPrepareCheck: 'АНУЛЬОВАНИЙ ЧЕК',
    receivedPrepareAnd: ' та ',
    receivedPrepareLicense: 'ДІЙСНІ ВОДІЙСЬКІ ПРАВА',
    receivedPrepareEnd: '. Ці документи потрібно буде додати до договору, якщо вашу заявку буде схвалено.',
    receivedContactTimeline: 'Ми зв’яжемося з вами протягом 7 робочих днів.',
    receivedFooter: 'Ви можете закрити це вікно. Дякуємо',
    errorFirstNameRequired: "Потрібне ім'я",
    errorLastNameRequired: 'Потрібне прізвище',
    errorEmailRequired: 'Потрібна коректна електронна пошта',
    errorPhoneRequired: 'Потрібен номер телефону',
    errorPhoneInvalid: 'Введіть коректний 10-значний номер телефону',
    errorAccountTypeRequired: 'Оберіть тип акаунта',
    errorBusinessConfirmRequired: 'Підтвердіть, що ви володієте або представляєте бізнес',
    errorFuelProgramRequired: 'Будь ласка, оберіть варіант',
    errorRefFirstNameRequired: "Потрібне ім'я рекомендателя",
    errorRefLastNameRequired: 'Потрібне прізвище рекомендателя',
    errorRefPhoneInvalid: 'Введіть коректний 10-значний номер телефону',
    errorCompanyNameRequired: 'Потрібна назва компанії',
    errorBusinessTypeRequired: 'Потрібна форма власності',
    errorCompanyTitleRequired: 'Потрібна ваша посада',
    errorFleetSizeRequired: 'Потрібен розмір автопарку',
    errorSaveLeadFailed: 'Не вдалося зберегти заявку.',
    errorNetworkSaveLead: 'Помилка мережі під час збереження заявки. Спробуйте ще раз.',
    step4FuelTitle: 'Ви зараз користуєтесь іншою програмою знижок на паливо?',
    step4FuelSubtitle: 'Щоб запропонувати вам найкращий досвід, нам потрібно знати, якими послугами ви користуєтесь. Це допомагає нам адаптувати наші послуги до ваших індивідуальних потреб і надавати вам більш персоналізовані переваги.',
    fuelYesOption: 'Так, я користувався іншими паливними картками',
    fuelNoOption: 'Ні, я ніколи не користувався жодною паливною програмою',
    fuelUploadTitle: 'Будь ласка, додайте останній РАХУНОК ЗА ПАЛИВО або ПОТОЧНУ ПАЛИВНУ КАРТКУ',
    fuelUploadSubtitle: 'Рахунок має бути датований останніми 2 тижнями і має відповідати імені, яке ви використовуєте для подачі заявки на цей рахунок',
    attachFuelInvoice: 'Прикріпити ФАЙЛ',
    changeFuelInvoice: 'Змінити ФАЙЛ',
    fuelInvoiceWarning: 'Будь ласка, додайте рахунок за паливо або картку'
  },
  ru: {
    languageLabel: 'Язык',
    progressTitleDefault: 'Прогресс заявки',
    progressTitleReview: 'Прогресс регистрации',
    progressTitleComplete: 'Заявка завершена!',
    pageTitleStep1: 'Начните регистрацию с нами',
    pageTitleStep5: 'Пожалуйста, проверьте информацию',
    pageTitleStep6: 'Ваша заявка получена!',
    pageTitleDefault: 'Продолжайте заполнять форму',
    pageSubtitleStep1: 'Ответьте на короткие вопросы, чтобы мы могли подобрать сервис для вашего автопарка. ',
    pageSubtitleStrongStep1: 'Это займет всего 2 минуты.',
    pageSubtitleStep5: 'Проверьте все данные ниже. Убедитесь, что все верно перед отправкой. Вы можете редактировать любую информацию, вернувшись на предыдущие шаги.',
    pageSubtitleStep6: 'Спасибо за предоставленную информацию. Нам нужно время, чтобы все проверить и связаться с вами.',
    pageSubtitleDefault: 'Пожалуйста, завершите оставшиеся шаги, чтобы продолжить регистрацию.',
    step1Title: 'Ваша контактная информация',
    step1Subtitle: 'Расскажите о себе',
    labelFirstName: 'Имя',
    labelLastName: 'Фамилия',
    labelEmail: 'Электронная почта',
    labelPhone: 'Номер телефона',
    placeholderFirstName: 'Имя',
    placeholderLastName: 'Фамилия',
    placeholderEmail: 'example@gmail.com',
    placeholderPhone: '(202) 555-0139',
    helperEmail: 'Убедитесь, что ваш e-mail указан верно — мы отправим туда важные данные.',
    nextStep: 'Следующий шаг',
    previousStep: 'Предыдущий шаг',
    step2Title: 'Как вы хотите настроить свой аккаунт?',
    step2Subtitle: 'Выберите вариант, который лучше всего соответствует тому, как вы планируете пользоваться сервисом.',
    accountPersonalLabel: 'Личный',
    accountBusinessLabel: 'Бизнес',
    accountPersonalTitle: 'Личный аккаунт',
    accountBusinessTitle: 'Бизнес-аккаунт',
    accountPersonalText: 'Для индивидуального использования, если у вас <strong>НЕТ</strong> собственной компании. Договор и платежи будут привязаны к <strong>вашей личной информации.</strong>',
    accountBusinessText: 'Для компаний или автопарков. Договор и платежи будут привязаны напрямую к <strong>вашему бизнес-банковскому счету.</strong>',
    accountBusinessNote: 'Бизнес должен быть <strong>вашей собственной компанией</strong>, а не перевозчиком, у которого вы работаете.',
    accountBusinessConfirm: 'Я подтверждаю, что <strong>владею или законно представляю</strong> бизнес-организацию.',
    helperReviewSign: 'Вы ознакомитесь и подпишете договор позже в процессе.',
    step3Title: 'Информация о компании',
    step3Subtitle: 'Расскажите о вашей компании',
    labelCompanyName: 'Название компании',
    placeholderCompanyName: 'Введите название компании',
    labelBusinessType: 'Форма собственности',
    selectPlaceholder: 'Выберите',
    businessTypeSole: 'ИП',
    businessTypePartnership: 'Партнерство',
    businessTypeLlc: 'ООО',
    businessTypeCorporation: 'Корпорация',
    labelCompanyTitle: 'Ваша должность в компании',
    companyTitleAccountant: 'Бухгалтер',
    companyTitlePresident: 'Президент',
    companyTitleOwner: 'Владелец',
    companyTitleOther: 'Другое',
    labelFleetSize: 'Сколько у вас грузовиков?',
    placeholderFleetSize: '1-99',
    labelDotOptional: 'DOT компании (необязательно)',
    placeholderDot: '1234567',
    labelMcOptional: 'MC компании (необязательно)',
    placeholderMc: '1234567',
    step4Title: 'Кто нас рекомендовал?',
    step4Subtitle: 'Расскажите о вашей <strong>рекомендации</strong>.',
    labelRefFirstName: 'Имя рекомендателя',
    labelRefLastName: 'Фамилия рекомендателя',
    labelRefCompany: 'Название компании рекомендателя',
    placeholderRefCompany: 'Truck Dream LLC',
    labelRefNotes: 'Заметки (необязательно)',
    placeholderRefNotes: 'Дополнительные заметки…',
    helperReferral: 'Это помогает строить крепкие отношения.',
    step5Title: 'Проверьте свои данные',
    step5Subtitle: 'Убедитесь, что все ниже верно перед отправкой.',
    summaryContactTitle: 'Контактная информация',
    summaryBusinessTitle: 'Информация о бизнесе',
    summaryReferralTitle: 'Рекомендовано',
    editLabel: 'редактировать',
    ariaEditContact: 'Редактировать контактную информацию',
    ariaEditBusiness: 'Редактировать информацию о бизнесе',
    ariaEditReferral: 'Редактировать информацию о рекомендации',
    ariaEditFleet: 'Редактировать размер автопарка',
    summaryFleetTitle: 'Размер автопарка',
    summaryTrucks: 'грузовиков',
    summaryDotLabel: 'DOT -',
    summaryMcLabel: 'MC -',
    notAvailable: 'н/д',
    submit: 'Отправить',
    submitting: 'Отправка…',
    receivedLead: 'Мы отправили код {accountType} заявки на вашу электронную почту. Проверьте входящие!',
    accountTypePersonal: 'личной',
    accountTypeBusiness: 'бизнес',
    receivedPrepareStart: 'Подготовьте ',
    receivedPrepareCheck: 'АННУЛИРОВАННЫЙ ЧЕК',
    receivedPrepareAnd: ' и ',
    receivedPrepareLicense: 'ДЕЙСТВИТЕЛЬНОЕ ВОДИТЕЛЬСКОЕ УДОСТОВЕРЕНИЕ',
    receivedPrepareEnd: '. Эти документы нужно будет приложить к договору, если ваша заявка будет одобрена.',
    receivedContactTimeline: 'Мы свяжемся с вами в течение 7 рабочих дней.',
    receivedFooter: 'Вы можете закрыть это окно. Спасибо',
    errorFirstNameRequired: 'Требуется имя',
    errorLastNameRequired: 'Требуется фамилия',
    errorEmailRequired: 'Требуется корректный e-mail',
    errorPhoneRequired: 'Требуется номер телефона',
    errorPhoneInvalid: 'Введите корректный 10-значный номер телефона',
    errorAccountTypeRequired: 'Выберите тип аккаунта',
    errorBusinessConfirmRequired: 'Подтвердите, что вы владеете или представляете бизнес',
    errorFuelProgramRequired: 'Пожалуйста, выберите вариант',
    errorRefFirstNameRequired: 'Требуется имя рекомендателя',
    errorRefLastNameRequired: 'Требуется фамилия рекомендателя',
    errorRefPhoneInvalid: 'Введите корректный 10-значный номер телефона',
    errorCompanyNameRequired: 'Требуется название компании',
    errorBusinessTypeRequired: 'Требуется форма собственности',
    errorCompanyTitleRequired: 'Требуется ваша должность',
    errorFleetSizeRequired: 'Требуется размер автопарка',
    errorSaveLeadFailed: 'Не удалось сохранить заявку.',
    errorNetworkSaveLead: 'Ошибка сети при сохранении заявки. Попробуйте еще раз.',
    step4FuelTitle: 'Вы сейчас пользуетесь другой программой скидок на топливо?',
    step4FuelSubtitle: 'Чтобы предложить вам лучший опыт, нам нужно знать, какими услугами вы пользуетесь. Это помогает нам адаптировать наши услуги к вашим индивидуальным потребностям и предоставлять более персонализированные преимущества.',
    fuelYesOption: 'Да, я пользовался другими топливными картами',
    fuelNoOption: 'Нет, я никогда не пользовался топливными программами',
    fuelUploadTitle: 'Пожалуйста, прикрепите последний СЧЕТ ЗА ТОПЛИВО или ТЕКУЩУЮ ТОПЛИВНУЮ КАРТУ',
    fuelUploadSubtitle: 'Счет должен быть датирован последними 2 неделями и должен соответствовать имени, которое вы используете для подачи заявки на этот счет',
    attachFuelInvoice: 'Прикрепить ФАЙЛ',
    changeFuelInvoice: 'Изменить ФАЙЛ',
    fuelInvoiceWarning: 'Пожалуйста, прикрепите счет за топливо или карту'
  }
};

const DEFAULT_ENDPOINTS = {
  saveLeadUrl: '/api/leads/save',
  saveDocumentUrl: 'https://kaktw4vgmkbqzmxaxoaiitzwqm0tfdtk.lambda-url.us-east-1.on.aws/' // lead does not exists yet at this stage, document is saved via general lambda
};
const DEFAULT_DOMAIN = window.RegistrationShared.DEFAULT_DOMAIN;

function registrationForm() {
  return {
    step: 1,
    language: 'en',
    translations: TRANSLATIONS,
    submitting: false,
    successMessage: '',
    t(key) {
      return (this.translations[this.language] && this.translations[this.language][key])
        || this.translations.en[key]
        || key;
    },

    getEndpoint(key) {
      return window.RegistrationShared.resolveEndpoint(DEFAULT_DOMAIN, DEFAULT_ENDPOINTS, key);
    },

    async requestJson(url, options = {}, timeoutMs = 20000) {
      return window.RegistrationShared.requestJson(url, options, timeoutMs);
    },

    generateSecurityCode() {
      const min = 100000;
      const max = 999999;

      if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
        const arr = new Uint32Array(1);
        window.crypto.getRandomValues(arr);
        return String(min + (arr[0] % (max - min + 1)));
      }

      return String(Math.floor(Math.random() * (max - min + 1)) + min);
    },

    get pageTitleIconUrl() {
      return this.step === 7
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
  <path d="M31.5488 21.528L1.76811 31.4793C1.53149 31.5586 1.27746 31.5703 1.03456 31.5131C0.791662 31.4559 0.569512 31.3322 0.393063 31.1557C0.216614 30.9793 0.0928561 30.7571 0.03569 30.5142C-0.0214761 30.2713 -0.009786 30.0173 0.0694471 29.7807L10.0208 0L31.5488 21.528Z" fill="#FDC70E"/>
</svg>`
        : '';
    },

    get pageTitle() {
      if (this.step === 1) return this.t('pageTitleStep1');
      if (this.step === 6) return this.t('pageTitleStep5');
      if (this.step === 7) return this.t('pageTitleStep6');
      return this.t('pageTitleDefault');
    },

    get pageSubtitle() {
      if (this.step === 1) return this.t('pageSubtitleStep1');
      if (this.step === 6) return this.t('pageSubtitleStep5');
      if (this.step === 7) return this.t('pageSubtitleStep6');
      return this.t('pageSubtitleDefault');
    },

    get pageSubtitleStrong() {
      return this.step === 1 ? this.t('pageSubtitleStrongStep1') : '';
    },

    get progressTitle() {
      if (this.step === 6) return this.t('progressTitleReview');
      if (this.step === 7) return this.t('progressTitleComplete');
      return this.t('progressTitleDefault');
    },

    // Matches Figma widths on an 800px track for 7 steps
    get progressFillPercent() {
      const percentByStep = {
        1: 14.3,
        2: 28.6,
        3: 42.9,
        4: 57.1,
        5: 71.4,
        6: 85.7,
        7: 100
      };
      return percentByStep[this.step] ?? 0;
    },

    get receivedLead() {
      const accountLabelKey = this.form.accountType === 'business'
        ? 'accountTypeBusiness'
        : 'accountTypePersonal';
      return this.t('receivedLead').replace('{accountType}', this.t(accountLabelKey));
    },
    // form includes fields used across steps
    form: {
      // Personal code used in follow-up onboarding flow
      otpCode: '',
      // Contact
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      // Account Type
      accountType: '', // 'personal' | 'business'
      businessOwnerConfirm: false,
      // Company (business only)
      companyName: '',
      businessType: '',
      companyTitle: '',
      fleetSize: 1,
      dot: '',
      mc: '',
      // Fuel Program
      usedFuelProgram: '', // 'yes' | 'no'
      files: {
        fuelInvoice: null
      },
      // Referral
      refFirstName: '',
      refLastName: '',
      refCompany: '',
      refPhone: '',
      refNotes: ''
    },
    // Upload status tracking
    uploadStatus: {
      fuelInvoice: { type: '', message: '' }
    },
    uploadInFlight: {
      fuelInvoice: false
    },
    errors: {},
    businessTypeLabel(value) {
      const map = {
        'sole-proprietorship': this.t('businessTypeSole'),
        partnership: this.t('businessTypePartnership'),
        llc: this.t('businessTypeLlc'),
        corporation: this.t('businessTypeCorporation')
      };
      return map[value] || value || '';
    },
    companyTitleLabel(value) {
      const map = {
        CEO: 'CEO',
        CFO: 'CFO',
        ACCOUNTANT: this.t('companyTitleAccountant'),
        PRESIDENT: this.t('companyTitlePresident'),
        OWNER: this.t('companyTitleOwner'),
        Other: this.t('companyTitleOther')
      };
      return map[value] || value || '';
    },
    // validate current step and allow moving between steps
    validate() {
      this.errors = {};
      if (this.step === 1) {
        if (!this.form.firstName) this.errors.firstName = this.t('errorFirstNameRequired');
        if (!this.form.lastName) this.errors.lastName = this.t('errorLastNameRequired');
        if (!this.form.email || !this.form.email.includes('@')) this.errors.email = this.t('errorEmailRequired');
        if (!this.form.phone) {
          this.errors.phone = this.t('errorPhoneRequired');
        } else if (!this.isValidPhone(this.form.phone)) {
          this.errors.phone = this.t('errorPhoneInvalid');
        }
      }
      if (this.step === 2) {
        if (!this.form.accountType) this.errors.accountType = this.t('errorAccountTypeRequired');
        if (this.form.accountType === 'business' && !this.form.businessOwnerConfirm) {
          this.errors.businessOwnerConfirm = this.t('errorBusinessConfirmRequired');
        }
        if (this.form.accountType === 'personal' && (this.form.fleetSize === '' || this.form.fleetSize === null || this.form.fleetSize < 1)) {
          this.errors.fleetSize = this.t('errorFleetSizeRequired');
        }
      }
      if (this.step === 3 && this.form.accountType === 'business') {
        if (!this.form.companyName) this.errors.companyName = this.t('errorCompanyNameRequired');
        if (!this.form.businessType) this.errors.businessType = this.t('errorBusinessTypeRequired');
        if (!this.form.companyTitle) this.errors.companyTitle = this.t('errorCompanyTitleRequired');
        if (this.form.fleetSize === '' || this.form.fleetSize === null) this.errors.fleetSize = this.t('errorFleetSizeRequired');
      }
      if (this.step === 4) {
        if (!this.form.usedFuelProgram) this.errors.usedFuelProgram = this.t('errorFuelProgramRequired');
      }
      if (this.step === 5) {
        if (!this.form.refFirstName) this.errors.refFirstName = this.t('errorRefFirstNameRequired');
        if (!this.form.refLastName) this.errors.refLastName = this.t('errorRefLastNameRequired');
        if (this.form.refPhone && !this.isValidPhone(this.form.refPhone)) {
          this.errors.refPhone = this.t('errorRefPhoneInvalid');
        }
      }
      return Object.keys(this.errors).length === 0;
    },

    normalizeDigits(value, maxLength) {
      const digits = String(value || '').replace(/\D+/g, '');
      return typeof maxLength === 'number' ? digits.slice(0, maxLength) : digits;
    },

    isValidPhone(value) {
      const digits = this.normalizeDigits(value);
      return digits.length === 10;
    },

    formatPhone(value) {
      const digits = this.normalizeDigits(value, 10);
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      }
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    },

    next() {
      if (!this.validate()) return;
      // Skip company info step if personal account (fuel step is shown for all)
      if (this.step === 2 && this.form.accountType === 'personal') {
        this.step = 4; // jump over company step to fuel step
        return;
      }
      this.step++;
    },
    prev() {
      // Skip company step when going back for personal accounts
      if (this.step === 4 && this.form.accountType === 'personal') {
        this.step = 2; // jump back over company step
        return;
      }
      if (this.step === 5 && this.form.accountType === 'personal') {
        this.step = 4; // go back to fuel step (not company)
        return;
      }
      this.step = Math.max(1, this.step - 1);
    },

    // File upload handler
    onFileSelect(event, fieldName) {
      const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
      if (!file) return;

      const validation = window.RegistrationShared.validateUploadFile(file);
      if (!validation.ok && validation.reason === 'type') {
        this.uploadStatus[fieldName] = {
          type: 'error',
          message: this.t('errorFileTypeInvalid')
        };
        event.target.value = '';
        return;
      }

      if (!validation.ok && validation.reason === 'size') {
        this.uploadStatus[fieldName] = {
          type: 'error',
          message: this.t('errorFileTooLarge')
        };
        event.target.value = '';
        return;
      }

      if (this.uploadInFlight[fieldName]) {
        return;
      }

      this.uploadStatus[fieldName] = {
        type: '',
        message: ''
      };

      this.uploadDocument(fieldName, file);
    },

    async uploadDocument(fieldName, file) {
      const saveDocumentUrl = this.getEndpoint('saveDocumentUrl');
      this.uploadInFlight[fieldName] = true;

      try {
        const { ok, data: uploadJson } = await this.requestJson(saveDocumentUrl, {
          method: 'POST',
          headers: {
            'Content-Type': file.type || 'application/octet-stream',
            'X-File-Name': file.name
          },
          body: file
        });

        if (!ok || !uploadJson.success) {
          throw new Error(uploadJson.message || 'Upload failed');
        }

        if (!this.form.files) {
          this.form.files = {};
        }

        this.form.files[fieldName] = {
          field: fieldName,
          filename: uploadJson.fileName || file.name
        };

        this.uploadStatus[fieldName] = {
          type: 'success',
          message: this.t('uploadSuccess')
        };
      } catch (err) {
        console.error('Document upload failed for', fieldName, err);
        this.uploadStatus[fieldName] = {
          type: 'error',
          message: this.t('uploadFailed')
        };
      } finally {
        this.uploadInFlight[fieldName] = false;
      }
    },

    buildSaveLeadPayload() {
      const files = Object.fromEntries(
        Object.entries(this.form.files || {}).filter(([, v]) => v !== null)
      );
      return {
        form: { ...this.form, files },
        otpCode: this.form.otpCode,
        stepCompleted: this.step
      };
    },

    // final submit
    async submit() {
      if (!this.validate()) return;
      this.submitting = true;
      this.successMessage = '';
      this.errors.form = '';

      try {
        if (!this.form.otpCode) {
          this.form.otpCode = this.generateSecurityCode();
        }

        const saveLeadUrl = this.getEndpoint('saveLeadUrl');
        const { ok, data: json } = await this.requestJson(saveLeadUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.buildSaveLeadPayload())
        });

        if (!ok) {
          this.errors.form = json.message || this.t('errorSaveLeadFailed');
          return;
        }

        this.step = 7;
      } catch (err) {
        console.error('Error calling /save-lead', err);
        this.errors.form = this.t('errorNetworkSaveLead');
      } finally {
        this.submitting = false;
      }
    }
  }
}
