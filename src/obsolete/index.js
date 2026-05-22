const TRANSLATIONS = {
  en: {
    languageLabel: 'Language',
    contactUs: 'Contact us',
    progressLabel: 'Registration progress',
    pageTitleStep1: 'Complete your registration process',
    pageSubtitleStep1: 'Please remember that you have 30 days after your application is approved to clarify any details or request additional time.',
    pageTitleStep2: 'Please review your information one more<br>time before we continue',
    pageTitleStep3: 'Continue filling out the form',
    pageSubtitleStep3: 'Please remember that you have 30 days after your application is approved to clarify any details or request additional time.',
    pageTitleStep9: 'Please review your information',
    pageSubtitleStep9: 'Please check all details below. Make sure everything is correct before submitting. You can edit any information by going back to the previous steps.',
    pageTitleStep10: 'Confirm and sign your information',
    pageSubtitleStep10: 'Please check all details below. Make sure everything is correct before submitting. You can edit any information by going back to the previous steps.',
    pageTitleStep11: 'Congratulations!',
    pageSubtitleStep11: 'Thanks for being part of our community',
    otpWelcomeTitle: 'Welcome back',
    otpWelcomeSubtitle: 'Good to see you again!',
    otpMessage: 'Enter your personal code to continue your registration or check the status of your application.',
    otpLabel: 'Personal code',
    otpPlaceholder: 'Personal code',
    otpVerifying: 'Verifying...',
    otpRetry: 'Retry request',
    otpNext: 'Next step',
    otpNoteLine1: 'Prepare a <strong class="otp-underline">VALID DRIVER LICENSE</strong>. It will be used for identity verification and must be <strong>attached</strong> to the agreement.',
    otpNoteLine2: 'If you don’t have it with you right now, you can upload it within 30 days after starting this registration.',
    step2ContactTitle: 'Contact information',
    step2BusinessTitle: 'Business information',
    step2RecommendedTitle: 'Recommended by',
    fleetTrucks: 'trucks',
    step2CalloutBefore: 'If you’ve found an error in your data, please call us',
    step2CalloutAfter: '. To avoid further errors',
    reviewBottomNote: 'You’ll review and sign the contract later in the process',
    step3Title: 'Company Information', // Personal Information for individual leads
    step3Subtitle: 'Tell us more about your company', // Please provide your address
    labelStreet1: 'Street Address',
    labelStreet2: 'Street Address 2',
    labelCity: 'City',
    labelState: 'State',
    labelZip: 'ZIP',
    placeholderStreet1: '123 Main St',
    placeholderStreet2: 'Apt/Unit',
    placeholderCity: 'New York',
    placeholderState: 'NY',
    placeholderZip: '01001',
    mailChoiceSame: 'Use this address for all mail deliveries?',
    mailChoiceOther: 'I want to provide a different mailing address',
    step4Title: 'Mailing Address',
    step4Subtitle: 'Choose address for paperwork',
    step5Title: 'Company Bank Information',
    step5Subtitle: 'Verify your company bank account with Plaid to receive payments.',
    plaidStatusLabel: 'Verification status',
    plaidStatusNotStarted: 'Not started',
    plaidStatusInProgress: 'In progress',
    plaidStatusVerified: 'Verified',
    plaidStatusError: 'Needs retry',
    plaidVerifiedHint: 'Your account has been verified with Plaid.',
    plaidSelectedAccountLabel: 'Selected account',
    plaidNoAccountSelected: 'No bank account has been selected yet.',
    plaidStep5Helper: 'Click <strong>Verify with Plaid</strong> to connect your bank securely.',
    plaidManualFallbackPending: 'This account requires manual bank entry before final submission.',
    plaidVerifyButton: 'Verify with Plaid',
    plaidIntroTitle: 'Connect your account with Plaid',
    plaidIntroSubtitle: 'The easiest and safest way to verify your bank account and personal information.',
    plaidIntroBulletBank: 'Please provide the bank account you will use to pay for the services.',
    plaidIntroBulletOwner: 'Complete personal verification. You must be the business owner to open a company account.',
    plaidIntroButton: 'Continue to verify with Plaid',
    plaidRetryButton: 'Retry Plaid verification',
    plaidConnectingButton: 'Connecting...',
    errorPlaidVerificationRequired: 'Complete Plaid verification before continuing.',
    errorPlaidUnavailable: 'Plaid is temporarily unavailable. Please try again.',
    errorPlaidFlowFailed: 'Unable to complete Plaid verification. Please retry.',
    errorPlaidAccountRequired: 'Please select an account in Plaid to continue.',
    labelBankName: 'Bank name',
    placeholderBankName: 'BoFa, Chase, Wells Fargo, etc.',
    labelAccountType: 'Account type',
    accountTypeChoose: 'Choose one',
    accountTypeChecking: 'Checking',
    accountTypeSavings: 'Savings',
    labelAccountNumber: 'Account number',
    labelConfirmAccount: 'Confirm Account number',
    labelRoutingNumber: 'Routing number',
    placeholderAccountNumber: '01234567890',
    placeholderRoutingNumber: '01234567890',
    show: 'Show',
    hide: 'Hide',
    attachVoidedCheck: 'Attach VOIDED check',
    changeVoidedCheck: 'Change VOIDED check',
    voidCheckWarning: 'You can proceed, but you must upload a voided check before final submission.',
    voidCheckHelper: 'The company name on the voided check <strong>must match</strong> the company name you entered earlier.',
    step6Title: 'Personal information and guarantee',
    step6Subtitle: 'As a financial organisation, we are legally required by our bank partnership to collect this information for verification purposes. It will be securely stored and handled with the utmost confidentiality. It will not be shared with third parties and is protected according to privacy regulations',
    labelSsnFull: 'Please enter full Social Security Number',
    labelDriverLicense: 'Please enter Driver License Number',
    placeholderDriverLicense: '01234567890',
    attachDriverLicense: 'Attach DRIVER LICENSE',
    changeDriverLicense: 'Change DRIVER LICENSE',
    driverLicenseWarning: 'You can proceed, but you must upload your driver license before final submission.',
    driverLicenseHelper: "The driver's license <strong>must match</strong> the owner of the company signing this contract.",
    nextStep: 'Next step',
    prevStep: 'Previous step',
    submit: 'Submit',
    submitting: 'Submitting...',
    preparingContract: 'Please wait while your contract is being prepared…',
    retry: 'Retry',
    termsTitle: 'Terms and Conditions',
    termsText: 'By clicking "I Agree" below, I agree to the <a href="#" class="terms-link" @click.prevent="">terms and conditions</a>, confirm that all information is accurate, and consent to the use of my data for account verification and contract processing.',
    agree: 'I Agree',
    disclaimerTitle: 'Important Notice',
    disclaimerLine1: 'You are about to complete a registration process that will generate a <strong>legally binding contract</strong>.',
    disclaimerLine2: 'Please take your time to carefully review and verify all information you provide. Ensure that your personal details, company information, and banking data are accurate and up-to-date.',
    disclaimerLine3: 'If you have any questions or need assistance, please contact our support team before proceeding.',
    disclaimerCta: 'I Understand, Continue',
    termsLastStep: 'Last step before savings!',
    contractLoading: 'Loading contract...',
    step7Title: 'Please provide your personal address',
    personalAddrSameBusiness: 'The same as my <strong>business</strong> address',
    personalAddrSameMailing: 'The same as my <strong>mailing</strong> address',
    personalAddrOther: 'Choose a different personal address',
    step8Title: 'Who will be responsible for billing?',
    billingSelfTitle: 'I am the billing contact',
    billingSelfHelper: 'We will use your email for invoices and billing notifications. Please make sure it is correct and accessible',
    billingOtherTitle: 'Someone else in my company',
    billingNameLabel: 'Billing Contact Full Name',
    billingNamePlaceholder: 'Full name',
    billingEmailLabel: 'Billing Contact Email',
    billingEmailPlaceholder: 'name@company.com',
    billingRoleLabel: 'Billing Contact Role',
    billingRolePlaceholder: 'Role',
    summaryContact: 'Contact details',
    summaryCompany: 'Company details',
    summaryCompanyAddress: 'Company address',
    summaryMailing: 'Mailing address',
    summaryBillingDetails: 'Billing details',
    summaryPersonalInfo: 'Personal information',
    summaryPersonalAddress: 'Personal address',
    summaryBillingContact: 'Billing contact',
    summaryEdit: 'edit',
    summaryMissingTitle: 'Please upload required documents to continue:',
    summaryTokenizedManualBankTitle: 'Manual bank details are required before final submission for tokenized accounts.',
    summaryVoidCheckHelper: 'The company name on the voided check <strong>must match</strong> the company name.',
    summaryDriverLicenseHelper: "The driver's license <strong>must match</strong> the owner signing this contract.",
    fuelDoneTitle: 'Done. Thanks for signed.',
    fuelDoneSub: 'We will review the information you provided, sign the contract on our end, and send you the fuel cards.',
    fuelSectionTitle: 'Would you like to add info about fuel cards?',
    fuelSectionSub: 'Please enter the information below.',
    fuelSectionHint: 'Please provide follow informations for each card (optional)',
    fuelUnitTitle: 'Unit number',
    fuelUnitHelp: 'The unit number showed on your truck',
    fuelUnitPlaceholder: 'Unit #',
    fuelDriverTitle: 'Driver ID',
    fuelDriverHelp: "We recommend to use 6 digits of driver's date of birth in format MMDDYY",
    fuelDriverPlaceholder: 'Driver ID',
    fuelAddMore: '+ Add more',
    confirmTitle: 'Done. Thanks for signed.',
    confirmSubtitle: 'We will review the information you provided, sign the contract on our end, and send you the fuel cards.',
    confirmMedia: 'Media placeholder',
    progressSteps: ['Code', 'Lead Summary', 'Bank', 'Company', 'Mailing', 'Personal', 'Personal Address', 'Billing', 'Summary', 'Terms', 'Done'],
    errorOtpInvalidFormat: 'Enter the 6-digit code',
    pendingReviewMessage: 'Your application is still under review. Please check back later.',
    errorLeadMissing: 'Unable to retrieve your information. Please try again or contact support.',
    errorNetworkTryAgain: 'Network error, try again',
    errorContactEmailInvalid: 'Enter a valid email address.',
    errorContactPhoneInvalid: 'Enter a valid phone number.',
    errorCompanyStreetRequired: 'Street address is required',
    errorCompanyCityRequired: 'City is required',
    errorCompanyStateRequired: 'State is required',
    errorCompanyZipRequired: 'ZIP is required',
    errorBankNameRequired: 'Bank name required',
    errorRoutingRequired: 'Routing number required',
    errorRoutingInvalid: 'Routing number must be 9 digits',
    errorAccountRequired: 'Account number required',
    errorAccountInvalid: 'Account number must be 5–17 digits',
    errorAccountConfirmRequired: 'Please confirm account number',
    errorAccountMismatch: 'Account numbers do not match',
    errorTokenizedManualBankRequired: 'Complete Step 3 manual bank details before final submission.',
    errorSsnFullRequired: 'Enter full nine digits of SSN',
    errorBillingEmailRequired: 'Billing email is required',
    errorBillingEmailInvalid: 'Enter a valid billing email address.',
    errorFormNetwork: 'Network error',
    errorNoDocumentId: 'No document ID available',
    errorFuelCardsNetwork: 'Network error. Please try again.',
    errorFileTooLarge: 'File is too large. Maximum allowed size is 10MB.',
    errorFileTypeInvalid: 'Invalid file type. Please upload a PDF or image file.',
    uploadPreviouslyUploaded: 'Document previously uploaded.',
    uploadSuccess: 'Document uploaded successfully.',
    uploadFailed: 'Failed to upload document. Please try again.',
    otpInvalidCodeWarning: 'This code is invalid or has already been used. Enter your email below to receive a new one.',
    otpRecoveryLabel: 'Enter your email to receive a new code',
    otpRecoveryPlaceholder: 'Your email address',
    otpRecoveryButton: 'Send new code',
    otpRecoverySent: 'If that email matches our records, a new code has been sent.',
    otpRecoveryButtonSending: 'Sending...'
  },
  es: {
    languageLabel: 'Idioma',
    contactUs: 'Contáctanos',
    progressLabel: 'Progreso del registro',
    pageTitleStep1: 'Completa tu proceso de registro',
    pageSubtitleStep1: 'Recuerda que tienes 30 días después de que tu solicitud sea aprobada para aclarar cualquier detalle o solicitar más tiempo.',
    pageTitleStep2: 'Revisa tu información una vez más<br>antes de continuar',
    pageTitleStep3: 'Continúa completando el formulario',
    pageSubtitleStep3: 'Recuerda que tienes 30 días después de que tu solicitud sea aprobada para aclarar cualquier detalle o solicitar más tiempo.',
    pageTitleStep9: 'Revisa tu información',
    pageSubtitleStep9: 'Verifica todos los detalles. Asegúrate de que todo sea correcto antes de enviar. Puedes editar cualquier información volviendo a los pasos anteriores.',
    pageTitleStep10: 'Confirma y firma tu información',
    pageSubtitleStep10: 'Verifica todos los detalles. Asegúrate de que todo sea correcto antes de enviar. Puedes editar cualquier información volviendo a los pasos anteriores.',
    pageTitleStep11: '¡Felicidades!',
    pageSubtitleStep11: 'Gracias por ser parte de nuestra comunidad',
    otpWelcomeTitle: 'Bienvenido de nuevo',
    otpWelcomeSubtitle: '¡Qué gusto verte otra vez!',
    otpMessage: 'Ingresa tu código personal para continuar tu registro o revisar el estado de tu solicitud.',
    otpLabel: 'Código personal',
    otpPlaceholder: 'Código personal',
    otpVerifying: 'Verificando...',
    otpRetry: 'Reintentar solicitud',
    otpNext: 'Siguiente paso',
    otpNoteLine1: 'Prepare un <strong class="otp-underline">CHEQUE ANULADO</strong> y una <strong class="otp-underline">LICENCIA DE CONDUCIR VÁLIDA</strong>. Estos documentos deberán <strong>adjuntarse</strong> al acuerdo.',
    otpNoteLine2: 'Si no los tiene ahora, puede cargarlos dentro de los 30 días posteriores al inicio de este registro.',
    step2ContactTitle: 'Información de contacto',
    step2BusinessTitle: 'Información del negocio',
    step2RecommendedTitle: 'Recomendado por',
    fleetTrucks: 'camiones',
    step2CalloutBefore: 'Si encontró un error en sus datos, por favor llámenos',
    step2CalloutAfter: '. Para evitar más errores',
    reviewBottomNote: 'Revisará y firmará el contrato más adelante en el proceso',
    step3Title: 'Información de la empresa',
    step3Subtitle: 'Cuéntenos más sobre su empresa',
    labelStreet1: 'Dirección',
    labelStreet2: 'Dirección 2',
    labelCity: 'Ciudad',
    labelState: 'Estado',
    labelZip: 'Código postal',
    placeholderStreet1: '123 Main St',
    placeholderStreet2: 'Apto/Unidad',
    placeholderCity: 'Nueva York',
    placeholderState: 'NY',
    placeholderZip: '01001',
    mailChoiceSame: '¿Usar esta dirección para todo el correo?',
    mailChoiceOther: 'Quiero proporcionar una dirección postal diferente',
    step4Title: 'Dirección postal',
    step4Subtitle: 'Elija la dirección para los documentos',
    step5Title: 'Información bancaria de la empresa',
    step5Subtitle: 'Verifique la cuenta bancaria de su empresa con Plaid para recibir pagos.',
    plaidStatusLabel: 'Estado de verificación',
    plaidStatusNotStarted: 'No iniciado',
    plaidStatusInProgress: 'En progreso',
    plaidStatusVerified: 'Verificado',
    plaidStatusError: 'Requiere reintento',
    plaidVerifiedHint: 'Su cuenta fue verificada con Plaid.',
    plaidSelectedAccountLabel: 'Cuenta seleccionada',
    plaidNoAccountSelected: 'Aún no se ha seleccionado una cuenta bancaria.',
    plaidStep5Helper: 'Haga clic en <strong>Verificar con Plaid</strong> para conectar su banco de forma segura.',
    plaidManualFallbackPending: 'Esta cuenta requiere ingreso manual de datos bancarios antes del envío final.',
    plaidVerifyButton: 'Verificar con Plaid',
    plaidIntroTitle: 'Conecta tu cuenta con Plaid',
    plaidIntroSubtitle: 'La forma más fácil y segura de verificar tu cuenta bancaria e información personal.',
    plaidIntroBulletBank: 'Proporciona la cuenta bancaria que usarás para pagar los servicios.',
    plaidIntroBulletOwner: 'Completa la verificación personal. Debes ser el propietario del negocio para abrir una cuenta de empresa.',
    plaidIntroButton: 'Continuar para verificar con Plaid',
    plaidRetryButton: 'Reintentar verificación con Plaid',
    plaidConnectingButton: 'Conectando...',
    errorPlaidVerificationRequired: 'Complete la verificación con Plaid antes de continuar.',
    errorPlaidUnavailable: 'Plaid no está disponible temporalmente. Inténtelo de nuevo.',
    errorPlaidFlowFailed: 'No se pudo completar la verificación con Plaid. Reintente.',
    errorPlaidAccountRequired: 'Seleccione una cuenta en Plaid para continuar.',
    labelBankName: 'Nombre del banco',
    placeholderBankName: 'BoFa, Chase, Wells Fargo, etc.',
    labelAccountType: 'Tipo de cuenta',
    accountTypeChoose: 'Elija una opción',
    accountTypeChecking: 'Cuenta corriente',
    accountTypeSavings: 'Ahorros',
    labelAccountNumber: 'Número de cuenta',
    labelConfirmAccount: 'Confirmar número de cuenta',
    labelRoutingNumber: 'Número de ruta',
    placeholderAccountNumber: '01234567890',
    placeholderRoutingNumber: '01234567890',
    show: 'Mostrar',
    hide: 'Ocultar',
    attachVoidedCheck: 'Adjuntar CHEQUE ANULADO',
    changeVoidedCheck: 'Cambiar CHEQUE ANULADO',
    voidCheckWarning: 'Puede continuar, pero debe cargar un cheque anulado antes del envío final.',
    voidCheckHelper: 'El nombre de la empresa en el cheque anulado <strong>debe coincidir</strong> con el nombre de la empresa que ingresó anteriormente.',
    step6Title: 'Información personal y garantía',
    step6Subtitle: 'Como organización financiera, estamos legalmente obligados por nuestra asociación bancaria a recopilar esta información para fines de verificación. Se almacenará de forma segura y se manejará con la máxima confidencialidad. No se compartirá con terceros y está protegida conforme a las regulaciones de privacidad.',
    labelSsnFull: 'Ingrese el número completo de Seguro Social',
    labelDriverLicense: 'Ingrese el número de licencia de conducir',
    placeholderDriverLicense: '01234567890',
    attachDriverLicense: 'Adjuntar LICENCIA DE CONDUCIR',
    changeDriverLicense: 'Cambiar LICENCIA DE CONDUCIR',
    driverLicenseWarning: 'Puede continuar, pero debe cargar su licencia de conducir antes del envío final.',
    driverLicenseHelper: 'La licencia de conducir <strong>debe coincidir</strong> con el propietario que firma este contrato.',
    nextStep: 'Siguiente paso',
    prevStep: 'Paso anterior',
    submit: 'Enviar',
    submitting: 'Enviando...',
    preparingContract: 'Por favor, espere mientras se prepara su contrato…',
    retry: 'Reintentar',
    termsTitle: 'Términos y condiciones',
    termsText: 'Al hacer clic en "Estoy de acuerdo" abajo, acepto los <a href="#" class="terms-link" @click.prevent="">términos y condiciones</a>, confirmo que toda la información es correcta y autorizo el uso de mis datos para la verificación de la cuenta y el procesamiento del contrato.',
    agree: 'Estoy de acuerdo',
    disclaimerTitle: 'Aviso importante',
    disclaimerLine1: 'Está a punto de completar un proceso de registro que generará un <strong>contrato legalmente vinculante</strong>.',
    disclaimerLine2: 'Por favor, tómese su tiempo para revisar y verificar cuidadosamente toda la información que proporciona. Asegúrese de que sus datos personales, la información de la empresa y los datos bancarios sean correctos y estén actualizados.',
    disclaimerLine3: 'Si tiene alguna pregunta o necesita ayuda, comuníquese con nuestro equipo de soporte antes de continuar.',
    disclaimerCta: 'Entiendo, continuar',
    termsLastStep: '¡Último paso antes de ahorrar!',
    contractLoading: 'Cargando contrato...',
    step7Title: 'Por favor, proporcione su dirección personal',
    personalAddrSameBusiness: 'Igual que mi dirección <strong>comercial</strong>',
    personalAddrSameMailing: 'Igual que mi dirección <strong>postal</strong>',
    personalAddrOther: 'Elegir una dirección personal diferente',
    step8Title: '¿Quién será responsable de la facturación?',
    billingSelfTitle: 'Yo soy el contacto de facturación',
    billingSelfHelper: 'Usaremos su correo para facturas y notificaciones. Asegúrese de que sea correcto y accesible',
    billingOtherTitle: 'Otra persona en mi empresa',
    billingNameLabel: 'Nombre completo del contacto de facturación',
    billingNamePlaceholder: 'Nombre completo',
    billingEmailLabel: 'Correo del contacto de facturación',
    billingEmailPlaceholder: 'nombre@empresa.com',
    billingRoleLabel: 'Cargo del contacto de facturación',
    billingRolePlaceholder: 'Cargo',
    summaryContact: 'Datos de contacto',
    summaryCompany: 'Detalles de la empresa',
    summaryCompanyAddress: 'Dirección de la empresa',
    summaryMailing: 'Dirección postal',
    summaryBillingDetails: 'Detalles de facturación',
    summaryPersonalInfo: 'Información personal',
    summaryPersonalAddress: 'Dirección personal',
    summaryBillingContact: 'Contacto de facturación',
    summaryEdit: 'editar',
    summaryMissingTitle: 'Por favor cargue los documentos requeridos para continuar:',
    summaryTokenizedManualBankTitle: 'Se requieren datos bancarios manuales antes del envío final para cuentas tokenizadas.',
    summaryVoidCheckHelper: 'El nombre de la empresa en el cheque anulado <strong>debe coincidir</strong> con el nombre de la empresa.',
    summaryDriverLicenseHelper: 'La licencia de conducir <strong>debe coincidir</strong> con el propietario que firma este contrato.',
    fuelDoneTitle: 'Listo. Gracias por firmar.',
    fuelDoneSub: 'Revisaremos la información proporcionada, firmaremos el contrato y enviaremos las tarjetas de combustible.',
    fuelSectionTitle: '¿Desea agregar información sobre tarjetas de combustible?',
    fuelSectionSub: 'Por favor ingrese la información a continuación.',
    fuelSectionHint: 'Proporcione la información para cada tarjeta (opcional)',
    fuelUnitTitle: 'Número de unidad',
    fuelUnitHelp: 'El número de unidad que aparece en su camión',
    fuelUnitPlaceholder: 'Unidad #',
    fuelDriverTitle: 'ID del conductor',
    fuelDriverHelp: 'Recomendamos usar 6 dígitos de la fecha de nacimiento del conductor en formato MMDDYY',
    fuelDriverPlaceholder: 'ID del conductor',
    fuelAddMore: '+ Agregar más',
    confirmTitle: 'Listo. Gracias por firmar.',
    confirmSubtitle: 'Revisaremos la información proporcionada, firmaremos el contrato y enviaremos las tarjetas de combustible.',
    confirmMedia: 'Marcador de medios',
    progressSteps: ['Código', 'Resumen', 'Banco', 'Compañía', 'Dirección', 'Personal', 'Dirección personal', 'Facturación', 'Resumen', 'Términos', 'Listo'],
    errorOtpInvalidFormat: 'Ingresa el código de 6 dígitos',
    pendingReviewMessage: 'Tu solicitud aún está en revisión. Vuelve a intentarlo más tarde.',
    errorLeadMissing: 'No se pudo obtener tu información. Inténtalo de nuevo o contacta soporte.',
    errorNetworkTryAgain: 'Error de red, inténtalo de nuevo',
    errorContactEmailInvalid: 'Ingresa un correo electrónico válido.',
    errorContactPhoneInvalid: 'Ingresa un número de teléfono válido.',
    errorCompanyStreetRequired: 'La dirección es obligatoria',
    errorCompanyCityRequired: 'La ciudad es obligatoria',
    errorCompanyStateRequired: 'El estado es obligatorio',
    errorCompanyZipRequired: 'El código postal es obligatorio',
    errorBankNameRequired: 'El nombre del banco es obligatorio',
    errorRoutingRequired: 'El número de ruta es obligatorio',
    errorRoutingInvalid: 'El número de ruta debe tener 9 dígitos',
    errorAccountRequired: 'El número de cuenta es obligatorio',
    errorAccountInvalid: 'El número de cuenta debe tener entre 5 y 17 dígitos',
    errorAccountConfirmRequired: 'Confirma el número de cuenta',
    errorAccountMismatch: 'Los números de cuenta no coinciden',
    errorTokenizedManualBankRequired: 'Complete los datos bancarios manuales del Paso 3 antes del envío final.',
    errorSsnFullRequired: 'Ingresa los nueve dígitos completos del SSN',
    errorBillingEmailRequired: 'El correo de facturación es obligatorio',
    errorBillingEmailInvalid: 'Ingresa un correo de facturación válido.',
    errorFormNetwork: 'Error de red',
    errorNoDocumentId: 'No hay ID de documento disponible',
    errorFuelCardsNetwork: 'Error de red. Inténtalo de nuevo.',
    errorFileTooLarge: 'El archivo es demasiado grande. Máximo 10 MB.',
    errorFileTypeInvalid: 'Tipo de archivo inválido. Sube un PDF o imagen.',
    uploadPreviouslyUploaded: 'Documento cargado previamente.',
    uploadSuccess: 'Documento cargado correctamente.',
    uploadFailed: 'No se pudo cargar el documento. Inténtalo de nuevo.',
    errorOtpInvalidOrUsed: 'Código inválido o ya usado.',
    errorCreateContractFailed: 'No se pudo crear el contrato',
    errorGetEmbedFailed: 'No se pudo obtener la URL de firma',
    errorLoadContractFailed: 'No se pudo cargar el contrato. Inténtalo de nuevo.',
    errorUnexpected: 'Ocurrió un error inesperado. Inténtalo de nuevo.',
    errorFuelCardsStoreFailed: 'No se pudieron guardar las tarjetas de combustible. Inténtalo de nuevo.',
    otpInvalidCodeWarning: 'Este código no es válido o ya fue utilizado. Ingresa tu correo para recibir uno nuevo.',
    otpRecoveryLabel: 'Ingresa tu correo para recibir un nuevo código',
    otpRecoveryPlaceholder: 'Tu dirección de correo',
    otpRecoveryButton: 'Enviar nuevo código',
    otpRecoverySent: 'Si ese correo coincide con nuestros registros, se ha enviado un nuevo código.',
    otpRecoveryButtonSending: 'Enviando...'
  },
  ru: {
    languageLabel: 'Язык',
    contactUs: 'Связаться с нами',
    progressLabel: 'Прогресс регистрации',
    pageTitleStep1: 'Завершите процесс регистрации',
    pageSubtitleStep1: 'Напоминаем, что у вас есть 30 дней после одобрения заявки, чтобы уточнить детали или запросить больше времени.',
    pageTitleStep2: 'Пожалуйста, ещё раз проверьте информацию<br>перед продолжением',
    pageTitleStep3: 'Продолжите заполнение формы',
    pageSubtitleStep3: 'Напоминаем, что у вас есть 30 дней после одобрения заявки, чтобы уточнить детали или запросить больше времени.',
    pageTitleStep9: 'Проверьте вашу информацию',
    pageSubtitleStep9: 'Проверьте все детали ниже. Убедитесь, что всё верно перед отправкой. Вы можете вернуться к предыдущим шагам и изменить данные.',
    pageTitleStep10: 'Подтвердите и подпишите информацию',
    pageSubtitleStep10: 'Проверьте все детали ниже. Убедитесь, что всё верно перед отправкой. Вы можете вернуться к предыдущим шагам и изменить данные.',
    pageTitleStep11: 'Поздравляем!',
    pageSubtitleStep11: 'Спасибо, что вы с нами',
    otpWelcomeTitle: 'С возвращением',
    otpWelcomeSubtitle: 'Рады снова вас видеть!',
    otpMessage: 'Введите персональный код, чтобы продолжить регистрацию или проверить статус заявки.',
    otpLabel: 'Персональный код',
    otpPlaceholder: 'Персональный код',
    otpVerifying: 'Проверка...',
    otpRetry: 'Повторить запрос',
    otpNext: 'Следующий шаг',
    otpNoteLine1: 'Подготовьте <strong class="otp-underline">АННУЛИРОВАННЫЙ БАНКОВСКИЙ ЧЕК</strong> и <strong class="otp-underline">ДЕЙСТВИТЕЛЬНЫЕ ПРАВА</strong>. Эти документы необходимо <strong>прикрепить</strong> к соглашению.',
    otpNoteLine2: 'Если у вас их нет сейчас, вы можете загрузить их в течение 30 дней после начала регистрации.',
    step2ContactTitle: 'Контактная информация',
    step2BusinessTitle: 'Информация о компании',
    step2RecommendedTitle: 'Рекомендовал(а)',
    fleetTrucks: 'грузовиков',
    step2CalloutBefore: 'Если вы обнаружили ошибку в данных, пожалуйста, позвоните нам',
    step2CalloutAfter: '. Чтобы избежать дальнейших ошибок',
    reviewBottomNote: 'Вы ознакомитесь и подпишете договор позже в процессе',
    step3Title: 'Информация о компании',
    step3Subtitle: 'Расскажите больше о вашей компании',
    labelStreet1: 'Адрес',
    labelStreet2: 'Адрес 2',
    labelCity: 'Город',
    labelState: 'Штат',
    labelZip: 'Индекс',
    placeholderStreet1: '123 Main St',
    placeholderStreet2: 'Кв./офис',
    placeholderCity: 'Нью‑Йорк',
    placeholderState: 'NY',
    placeholderZip: '01001',
    mailChoiceSame: 'Использовать этот адрес для всей почты?',
    mailChoiceOther: 'Хочу указать другой почтовый адрес',
    step4Title: 'Почтовый адрес',
    step4Subtitle: 'Выберите адрес для документов',
    step5Title: 'Банковские реквизиты компании',
    step5Subtitle: 'Подтвердите банковский счет компании через Plaid для получения платежей.',
    plaidStatusLabel: 'Статус проверки',
    plaidStatusNotStarted: 'Не начато',
    plaidStatusInProgress: 'В процессе',
    plaidStatusVerified: 'Проверено',
    plaidStatusError: 'Нужна повторная попытка',
    plaidVerifiedHint: 'Ваш счет подтвержден через Plaid.',
    plaidSelectedAccountLabel: 'Выбранный счет',
    plaidNoAccountSelected: 'Банковский счет пока не выбран.',
    plaidStep5Helper: 'Нажмите <strong>Проверить через Plaid</strong>, чтобы безопасно подключить банк.',
    plaidManualFallbackPending: 'Для этого счета требуется ручной ввод банковских данных перед финальной отправкой.',
    plaidVerifyButton: 'Проверить через Plaid',
    plaidIntroTitle: 'Подключите ваш аккаунт через Plaid',
    plaidIntroSubtitle: 'Самый простой и безопасный способ подтвердить банковский счет и личные данные.',
    plaidIntroBulletBank: 'Укажите банковский счет, который вы будете использовать для оплаты услуг.',
    plaidIntroBulletOwner: 'Пройдите личную проверку. Чтобы открыть счет компании, вы должны быть владельцем бизнеса.',
    plaidIntroButton: 'Продолжить проверку через Plaid',
    plaidRetryButton: 'Повторить проверку Plaid',
    plaidConnectingButton: 'Подключение...',
    errorPlaidVerificationRequired: 'Завершите проверку Plaid перед продолжением.',
    errorPlaidUnavailable: 'Plaid временно недоступен. Пожалуйста, попробуйте снова.',
    errorPlaidFlowFailed: 'Не удалось завершить проверку Plaid. Повторите попытку.',
    errorPlaidAccountRequired: 'Выберите счет в Plaid, чтобы продолжить.',
    labelBankName: 'Название банка',
    placeholderBankName: 'BoFa, Chase, Wells Fargo и т. д.',
    labelAccountType: 'Тип счета',
    accountTypeChoose: 'Выберите',
    accountTypeChecking: 'Расчетный',
    accountTypeSavings: 'Сберегательный',
    labelAccountNumber: 'Номер счета',
    labelConfirmAccount: 'Подтвердите номер счета',
    labelRoutingNumber: 'Роутинговый номер',
    placeholderAccountNumber: '01234567890',
    placeholderRoutingNumber: '01234567890',
    show: 'Показать',
    hide: 'Скрыть',
    attachVoidedCheck: 'Прикрепить АННУЛИРОВАННЫЙ ЧЕК',
    changeVoidedCheck: 'Изменить АННУЛИРОВАННЫЙ ЧЕК',
    voidCheckWarning: 'Вы можете продолжить, но перед финальной отправкой нужно загрузить аннулированный чек.',
    voidCheckHelper: 'Название компании на чеке <strong>должно совпадать</strong> с введенным ранее названием компании.',
    step6Title: 'Личная информация и гарантия',
    step6Subtitle: 'Как финансовая организация, мы по закону обязаны собирать эту информацию для проверки. Она будет храниться безопасно и конфиденциально. Мы не передаем ее третьим лицам и соблюдаем нормы конфиденциальности.',
    labelSsnFull: 'Введите полный номер SSN',
    labelDriverLicense: 'Введите номер водительского удостоверения',
    placeholderDriverLicense: '01234567890',
    attachDriverLicense: 'Прикрепить ВОДИТЕЛЬСКОЕ УДОСТОВЕРЕНИЕ',
    changeDriverLicense: 'Изменить ВОДИТЕЛЬСКОЕ УДОСТОВЕРЕНИЕ',
    driverLicenseWarning: 'Вы можете продолжить, но перед финальной отправкой нужно загрузить водительское удостоверение.',
    driverLicenseHelper: 'Водительское удостоверение <strong>должно совпадать</strong> с владельцем компании, подписывающим этот договор.',
    nextStep: 'Следующий шаг',
    prevStep: 'Предыдущий шаг',
    submit: 'Отправить',
    submitting: 'Отправка...',
    preparingContract: 'Пожалуйста, подождите, пока готовится ваш договор…',
    retry: 'Повторить',
    termsTitle: 'Условия и положения',
    termsText: 'Нажимая «Я согласен» ниже, я принимаю <a href="#" class="terms-link" @click.prevent="">условия</a>, подтверждаю правильность информации и даю согласие на использование данных для проверки аккаунта и обработки договора.',
    agree: 'Я согласен',
    disclaimerTitle: 'Важное уведомление',
    disclaimerLine1: 'Вы собираетесь завершить процесс регистрации, который создаст <strong>юридически обязательный договор</strong>.',
    disclaimerLine2: 'Пожалуйста, внимательно проверьте всю предоставляемую информацию. Убедитесь, что личные данные, информация о компании и банковские реквизиты актуальны и корректны.',
    disclaimerLine3: 'Если у вас есть вопросы или нужна помощь, свяжитесь с нашей поддержкой перед продолжением.',
    disclaimerCta: 'Понимаю, продолжить',
    termsLastStep: 'Последний шаг перед экономией!',
    contractLoading: 'Загрузка договора...',
    step7Title: 'Пожалуйста, укажите ваш личный адрес',
    personalAddrSameBusiness: 'Такой же, как <strong>адрес компании</strong>',
    personalAddrSameMailing: 'Такой же, как <strong>почтовый адрес</strong>',
    personalAddrOther: 'Выбрать другой личный адрес',
    step8Title: 'Кто будет ответственен за биллинг?',
    billingSelfTitle: 'Я — контакт по биллингу',
    billingSelfHelper: 'Мы будем использовать ваш email для счетов и уведомлений. Убедитесь, что он корректный и доступен',
    billingOtherTitle: 'Другое лицо в моей компании',
    billingNameLabel: 'ФИО контакта по биллингу',
    billingNamePlaceholder: 'Полное имя',
    billingEmailLabel: 'Email контакта по биллингу',
    billingEmailPlaceholder: 'name@company.com',
    billingRoleLabel: 'Должность контакта по биллингу',
    billingRolePlaceholder: 'Должность',
    summaryContact: 'Контактные данные',
    summaryCompany: 'Данные компании',
    summaryCompanyAddress: 'Адрес компании',
    summaryMailing: 'Почтовый адрес',
    summaryBillingDetails: 'Платежные реквизиты',
    summaryPersonalInfo: 'Личная информация',
    summaryPersonalAddress: 'Личный адрес',
    summaryBillingContact: 'Контакт для биллинга',
    summaryEdit: 'редактировать',
    summaryMissingTitle: 'Пожалуйста, загрузите необходимые документы для продолжения:',
    summaryTokenizedManualBankTitle: 'Для токенизированных счетов перед финальной отправкой требуются ручные банковские данные.',
    summaryVoidCheckHelper: 'Название компании на чеке <strong>должно совпадать</strong> с названием компании.',
    summaryDriverLicenseHelper: 'Водительские права <strong>должны совпадать</strong> с владельцем, подписывающим договор.',
    fuelDoneTitle: 'Готово. Спасибо за подпись.',
    fuelDoneSub: 'Мы проверим предоставленную информацию, подпишем договор и отправим топливные карты.',
    fuelSectionTitle: 'Хотите добавить информацию о топливных картах?',
    fuelSectionSub: 'Пожалуйста, заполните информацию ниже.',
    fuelSectionHint: 'Укажите данные для каждой карты (необязательно)',
    fuelUnitTitle: 'Номер юнита',
    fuelUnitHelp: 'Номер юнита, указанный на вашем грузовике',
    fuelUnitPlaceholder: 'Юнит #',
    fuelDriverTitle: 'ID водителя',
    fuelDriverHelp: 'Рекомендуем использовать 6 цифр даты рождения водителя в формате MMDDYY',
    fuelDriverPlaceholder: 'ID водителя',
    fuelAddMore: '+ Добавить еще',
    confirmTitle: 'Готово. Спасибо за подпись.',
    confirmSubtitle: 'Мы проверим предоставленную информацию, подпишем договор и отправим топливные карты.',
    confirmMedia: 'Медиа-заглушка',
    progressSteps: ['Код', 'Сводка', 'Банк', 'Компания', 'Адрес', 'Личные данные', 'Личный адрес', 'Биллинг', 'Сводка', 'Условия', 'Готово'],
    errorOtpInvalidFormat: 'Введите 6-значный код',
    pendingReviewMessage: 'Ваша заявка все еще на рассмотрении. Пожалуйста, попробуйте позже.',
    errorLeadMissing: 'Не удалось получить вашу информацию. Попробуйте снова или свяжитесь с поддержкой.',
    errorNetworkTryAgain: 'Ошибка сети, попробуйте снова',
    errorContactEmailInvalid: 'Введите корректный e-mail.',
    errorContactPhoneInvalid: 'Введите корректный номер телефона.',
    errorCompanyStreetRequired: 'Адрес обязателен',
    errorCompanyCityRequired: 'Город обязателен',
    errorCompanyStateRequired: 'Штат обязателен',
    errorCompanyZipRequired: 'Индекс обязателен',
    errorBankNameRequired: 'Название банка обязательно',
    errorRoutingRequired: 'Роутинговый номер обязателен',
    errorRoutingInvalid: 'Роутинговый номер должен содержать 9 цифр',
    errorAccountRequired: 'Номер счета обязателен',
    errorAccountInvalid: 'Номер счета должен содержать 5–17 цифр',
    errorAccountConfirmRequired: 'Подтвердите номер счета',
    errorAccountMismatch: 'Номера счетов не совпадают',
    errorTokenizedManualBankRequired: 'Заполните ручные банковские данные на шаге 3 перед финальной отправкой.',
    errorSsnFullRequired: 'Введите все 9 цифр SSN',
    errorBillingEmailRequired: 'Email для биллинга обязателен',
    errorBillingEmailInvalid: 'Введите корректный email для биллинга.',
    errorFormNetwork: 'Ошибка сети',
    errorNoDocumentId: 'ID документа недоступен',
    errorFuelCardsNetwork: 'Ошибка сети. Пожалуйста, попробуйте снова.',
    errorFileTooLarge: 'Файл слишком большой. Максимум 10 МБ.',
    errorFileTypeInvalid: 'Недопустимый тип файла. Загрузите PDF или изображение.',
    uploadPreviouslyUploaded: 'Документ уже был загружен.',
    uploadSuccess: 'Документ успешно загружен.',
    uploadFailed: 'Не удалось загрузить документ. Пожалуйста, попробуйте снова.',
    errorOtpInvalidOrUsed: 'Неверный или уже использованный код.',
    errorCreateContractFailed: 'Не удалось создать договор',
    errorGetEmbedFailed: 'Не удалось получить URL подписи',
    errorLoadContractFailed: 'Не удалось загрузить договор. Пожалуйста, попробуйте снова.',
    errorUnexpected: 'Произошла непредвиденная ошибка. Пожалуйста, попробуйте снова.',
    errorFuelCardsStoreFailed: 'Не удалось сохранить топливные карты. Пожалуйста, попробуйте снова.',
    otpInvalidCodeWarning: 'Этот код недействителен или уже был использован. Введите email ниже, чтобы получить новый.',
    otpRecoveryLabel: 'Введите email для получения нового кода',
    otpRecoveryPlaceholder: 'Ваш email',
    otpRecoveryButton: 'Отправить новый код',
    otpRecoverySent: 'Если этот email есть в нашей базе, новый код уже отправлен.',
    otpRecoveryButtonSending: 'Отправка...'
  },
  uk: {
    languageLabel: 'Мова',
    contactUs: 'Зв’язатися з нами',
    progressLabel: 'Прогрес реєстрації',
    pageTitleStep1: 'Завершіть процес реєстрації',
    pageSubtitleStep1: 'Нагадуємо, що у вас є 30 днів після схвалення заявки, щоб уточнити деталі або запросити більше часу.',
    pageTitleStep2: 'Будь ласка, ще раз перевірте інформацію<br>перед продовженням',
    pageTitleStep3: 'Продовжуйте заповнення форми',
    pageSubtitleStep3: 'Нагадуємо, що у вас є 30 днів після схвалення заявки, щоб уточнити деталі або запросити більше часу.',
    pageTitleStep9: 'Перевірте вашу інформацію',
    pageSubtitleStep9: 'Перевірте всі деталі нижче. Переконайтеся, що все правильно перед відправленням. Ви можете повернутися до попередніх кроків і змінити дані.',
    pageTitleStep10: 'Підтвердьте та підпишіть інформацію',
    pageSubtitleStep10: 'Перевірте всі деталі нижче. Переконайтеся, що все правильно перед відправленням. Ви можете повернутися до попередніх кроків і змінити дані.',
    pageTitleStep11: 'Вітаємо!',
    pageSubtitleStep11: 'Дякуємо, що ви з нами',
    otpWelcomeTitle: 'З поверненням',
    otpWelcomeSubtitle: 'Раді знову вас бачити!',
    otpMessage: 'Введіть персональний код, щоб продовжити реєстрацію або перевірити статус заявки.',
    otpLabel: 'Персональний код',
    otpPlaceholder: 'Персональний код',
    otpVerifying: 'Перевірка...',
    otpRetry: 'Повторити запит',
    otpNext: 'Наступний крок',
    otpNoteLine1: 'Підготуйте <strong class="otp-underline">АНУЛЬОВАНИЙ БАНКІВСЬКИЙ ЧЕК</strong> і <strong class="otp-underline">ДІЙСНІ ПРАВА</strong>. Ці документи потрібно <strong>прикріпити</strong> до угоди.',
    otpNoteLine2: 'Якщо зараз їх немає, ви можете завантажити їх протягом 30 днів після початку реєстрації.',
    step2ContactTitle: 'Контактна інформація',
    step2BusinessTitle: 'Інформація про компанію',
    step2RecommendedTitle: 'Рекомендував(ла)',
    fleetTrucks: 'вантажівок',
    step2CalloutBefore: 'Якщо ви знайшли помилку у своїх даних, будь ласка, зателефонуйте нам',
    step2CalloutAfter: '. Щоб уникнути подальших помилок',
    reviewBottomNote: 'Ви ознайомитеся та підпишете договір пізніше в процесі',
    step3Title: 'Інформація про компанію',
    step3Subtitle: 'Розкажіть більше про вашу компанію',
    labelStreet1: 'Адреса',
    labelStreet2: 'Адреса 2',
    labelCity: 'Місто',
    labelState: 'Штат',
    labelZip: 'Індекс',
    placeholderStreet1: '123 Main St',
    placeholderStreet2: 'Кв./офіс',
    placeholderCity: 'Нью-Йорк',
    placeholderState: 'NY',
    placeholderZip: '01001',
    mailChoiceSame: 'Використовувати цю адресу для всієї пошти?',
    mailChoiceOther: 'Хочу вказати іншу поштову адресу',
    step4Title: 'Поштова адреса',
    step4Subtitle: 'Виберіть адресу для документів',
    step5Title: 'Банківські реквізити компанії',
    step5Subtitle: 'Підтвердьте банківський рахунок компанії через Plaid для отримання платежів.',
    plaidStatusLabel: 'Статус перевірки',
    plaidStatusNotStarted: 'Не розпочато',
    plaidStatusInProgress: 'У процесі',
    plaidStatusVerified: 'Підтверджено',
    plaidStatusError: 'Потрібна повторна спроба',
    plaidVerifiedHint: 'Ваш рахунок підтверджено через Plaid.',
    plaidSelectedAccountLabel: 'Вибраний рахунок',
    plaidNoAccountSelected: 'Банківський рахунок ще не вибрано.',
    plaidStep5Helper: 'Натисніть <strong>Підтвердити через Plaid</strong>, щоб безпечно підʼєднати банк.',
    plaidManualFallbackPending: 'Для цього рахунку потрібне ручне введення банківських даних перед фінальним надсиланням.',
    plaidVerifyButton: 'Підтвердити через Plaid',
    plaidIntroTitle: 'Підʼєднайте свій акаунт через Plaid',
    plaidIntroSubtitle: 'Найпростіший і найбезпечніший спосіб підтвердити банківський рахунок та особисті дані.',
    plaidIntroBulletBank: 'Вкажіть банківський рахунок, який ви використовуватимете для оплати послуг.',
    plaidIntroBulletOwner: 'Завершіть особисту перевірку. Ви маєте бути власником бізнесу, щоб відкрити рахунок компанії.',
    plaidIntroButton: 'Продовжити перевірку через Plaid',
    plaidRetryButton: 'Повторити перевірку Plaid',
    plaidConnectingButton: 'Підключення...',
    errorPlaidVerificationRequired: 'Завершіть перевірку Plaid перед продовженням.',
    errorPlaidUnavailable: 'Plaid тимчасово недоступний. Будь ласка, спробуйте ще раз.',
    errorPlaidFlowFailed: 'Не вдалося завершити перевірку Plaid. Спробуйте ще раз.',
    errorPlaidAccountRequired: 'Оберіть рахунок у Plaid, щоб продовжити.',
    labelBankName: 'Назва банку',
    placeholderBankName: 'BoFa, Chase, Wells Fargo тощо',
    labelAccountType: 'Тип рахунку',
    accountTypeChoose: 'Оберіть',
    accountTypeChecking: 'Розрахунковий',
    accountTypeSavings: 'Ощадний',
    labelAccountNumber: 'Номер рахунку',
    labelConfirmAccount: 'Підтвердіть номер рахунку',
    labelRoutingNumber: 'Routing номер',
    placeholderAccountNumber: '01234567890',
    placeholderRoutingNumber: '01234567890',
    show: 'Показати',
    hide: 'Сховати',
    attachVoidedCheck: 'Додати АНУЛЬОВАНИЙ ЧЕК',
    changeVoidedCheck: 'Змінити АНУЛЬОВАНИЙ ЧЕК',
    voidCheckWarning: 'Ви можете продовжити, але перед фінальним надсиланням потрібно завантажити анульований чек.',
    voidCheckHelper: 'Назва компанії на чеку <strong>має збігатися</strong> з назвою компанії, яку ви ввели раніше.',
    step6Title: 'Особиста інформація та гарантія',
    step6Subtitle: 'Як фінансова організація, ми юридично зобов’язані збирати цю інформацію для перевірки. Вона зберігатиметься безпечно та конфіденційно. Ми не передаємо її третім сторонам і дотримуємося норм конфіденційності.',
    labelSsnFull: 'Введіть повний номер SSN',
    labelDriverLicense: 'Введіть номер водійського посвідчення',
    placeholderDriverLicense: '01234567890',
    attachDriverLicense: 'Додати ВОДІЙСЬКЕ ПОСВІДЧЕННЯ',
    changeDriverLicense: 'Змінити ВОДІЙСЬКЕ ПОСВІДЧЕННЯ',
    driverLicenseWarning: 'Ви можете продовжити, але перед фінальним надсиланням потрібно завантажити водійське посвідчення.',
    driverLicenseHelper: 'Водійське посвідчення <strong>має збігатися</strong> з власником компанії, який підписує договір.',
    nextStep: 'Наступний крок',
    prevStep: 'Попередній крок',
    submit: 'Відправити',
    submitting: 'Відправлення...',
    preparingContract: 'Будь ласка, зачекайте, поки готується ваш договір…',
    retry: 'Повторити',
    termsTitle: 'Умови та положення',
    termsText: 'Натискаючи «Погоджуюсь» нижче, я приймаю <a href="#" class="terms-link" @click.prevent="">умови</a>, підтверджую правильність інформації та даю згоду на використання даних для перевірки облікового запису й обробки договору.',
    agree: 'Погоджуюсь',
    disclaimerTitle: 'Важливе повідомлення',
    disclaimerLine1: 'Ви збираєтесь завершити процес реєстрації, який створить <strong>юридично зобов’язувальний договір</strong>.',
    disclaimerLine2: 'Будь ласка, уважно перевірте всю інформацію. Переконайтеся, що особисті дані, інформація про компанію та банківські реквізити актуальні й коректні.',
    disclaimerLine3: 'Якщо у вас є запитання або потрібна допомога, зверніться до служби підтримки перед продовженням.',
    disclaimerCta: 'Зрозуміло, продовжити',
    termsLastStep: 'Останній крок перед економією!',
    contractLoading: 'Завантаження договору...',
    step7Title: 'Будь ласка, вкажіть вашу особисту адресу',
    personalAddrSameBusiness: 'Та сама, що й <strong>адреса компанії</strong>',
    personalAddrSameMailing: 'Та сама, що й <strong>поштова адреса</strong>',
    personalAddrOther: 'Обрати іншу особисту адресу',
    step8Title: 'Хто буде відповідальним за білінг?',
    billingSelfTitle: 'Я — контакт з білінгу',
    billingSelfHelper: 'Ми будемо використовувати вашу пошту для рахунків і повідомлень. Переконайтеся, що вона правильна та доступна',
    billingOtherTitle: 'Інша особа в моїй компанії',
    billingNameLabel: 'ПІБ контакту з білінгу',
    billingNamePlaceholder: 'Повне ім’я',
    billingEmailLabel: 'Email контакту з білінгу',
    billingEmailPlaceholder: 'name@company.com',
    billingRoleLabel: 'Посада контакту з білінгу',
    billingRolePlaceholder: 'Посада',
    summaryContact: 'Контактні дані',
    summaryCompany: 'Дані компанії',
    summaryCompanyAddress: 'Адреса компанії',
    summaryMailing: 'Поштова адреса',
    summaryBillingDetails: 'Платіжні реквізити',
    summaryPersonalInfo: 'Особиста інформація',
    summaryPersonalAddress: 'Особиста адреса',
    summaryBillingContact: 'Контакт для білінгу',
    summaryEdit: 'редагувати',
    summaryMissingTitle: 'Будь ласка, завантажте необхідні документи для продовження:',
    summaryTokenizedManualBankTitle: 'Для токенізованих рахунків перед фінальним надсиланням потрібні ручні банківські дані.',
    summaryVoidCheckHelper: 'Назва компанії на чеку <strong>має збігатися</strong> з назвою компанії.',
    summaryDriverLicenseHelper: 'Водійське посвідчення <strong>має збігатися</strong> з власником, який підписує договір.',
    fuelDoneTitle: 'Готово. Дякуємо за підпис.',
    fuelDoneSub: 'Ми перевіримо надану інформацію, підпишемо договір і надішлемо паливні картки.',
    fuelSectionTitle: 'Хочете додати інформацію про паливні картки?',
    fuelSectionSub: 'Будь ласка, введіть інформацію нижче.',
    fuelSectionHint: 'Вкажіть дані для кожної картки (необов’язково)',
    fuelUnitTitle: 'Номер юніта',
    fuelUnitHelp: 'Номер юніта, вказаний на вашому вантажівці',
    fuelUnitPlaceholder: 'Юніт #',
    fuelDriverTitle: 'ID водія',
    fuelDriverHelp: 'Рекомендуємо використовувати 6 цифр дати народження водія у форматі MMDDYY',
    fuelDriverPlaceholder: 'ID водія',
    fuelAddMore: '+ Додати ще',
    confirmTitle: 'Готово. Дякуємо за підпис.',
    confirmSubtitle: 'Ми перевіримо надану інформацію, підпишемо договір і надішлемо паливні картки.',
    confirmMedia: 'Медіа-заглушка',
    progressSteps: ['Код', 'Сводка', 'Банк', 'Компанія', 'Адреса', 'Особисті дані', 'Особиста адреса', 'Білінг', 'Сводка', 'Умови', 'Готово'],
    errorOtpInvalidFormat: 'Введіть 6-значний код',
    pendingReviewMessage: 'Ваша заявка все ще на розгляді. Будь ласка, спробуйте пізніше.',
    errorLeadMissing: 'Не вдалося отримати вашу інформацію. Спробуйте ще раз або зверніться до підтримки.',
    errorNetworkTryAgain: 'Помилка мережі, спробуйте ще раз',
    errorContactEmailInvalid: 'Введіть коректну електронну пошту.',
    errorContactPhoneInvalid: 'Введіть коректний номер телефону.',
    errorCompanyStreetRequired: 'Адреса обовʼязкова',
    errorCompanyCityRequired: 'Місто обовʼязкове',
    errorCompanyStateRequired: 'Штат обовʼязковий',
    errorCompanyZipRequired: 'Індекс обовʼязковий',
    errorBankNameRequired: 'Назва банку обовʼязкова',
    errorRoutingRequired: 'Routing номер обовʼязковий',
    errorRoutingInvalid: 'Routing номер має містити 9 цифр',
    errorAccountRequired: 'Номер рахунку обовʼязковий',
    errorAccountInvalid: 'Номер рахунку має містити 5–17 цифр',
    errorAccountConfirmRequired: 'Підтвердіть номер рахунку',
    errorAccountMismatch: 'Номери рахунків не збігаються',
    errorTokenizedManualBankRequired: 'Заповніть ручні банківські дані на кроці 3 перед фінальним надсиланням.',
    errorSsnFullRequired: 'Введіть усі 9 цифр SSN',
    errorBillingEmailRequired: 'Email для білінгу обовʼязковий',
    errorBillingEmailInvalid: 'Введіть коректний email для білінгу.',
    errorFormNetwork: 'Помилка мережі',
    errorNoDocumentId: 'ID документа недоступний',
    errorFuelCardsNetwork: 'Помилка мережі. Будь ласка, спробуйте ще раз.',
    errorFileTooLarge: 'Файл завеликий. Максимум 10 МБ.',
    errorFileTypeInvalid: 'Неприпустимий тип файлу. Завантажте PDF або зображення.',
    uploadPreviouslyUploaded: 'Документ уже було завантажено.',
    uploadSuccess: 'Документ успішно завантажено.',
    uploadFailed: 'Не вдалося завантажити документ. Будь ласка, спробуйте ще раз.',
    errorOtpInvalidOrUsed: 'Недійсний або вже використаний код.',
    errorCreateContractFailed: 'Не вдалося створити договір',
    errorGetEmbedFailed: 'Не вдалося отримати URL підписання',
    errorLoadContractFailed: 'Не вдалося завантажити договір. Будь ласка, спробуйте ще раз.',
    errorUnexpected: 'Сталася непередбачувана помилка. Будь ласка, спробуйте ще раз.',
    errorFuelCardsStoreFailed: 'Не вдалося зберегти паливні картки. Будь ласка, спробуйте ще раз.',
    otpInvalidCodeWarning: 'Цей код недійсний або вже був використаний. Введіть email нижче, щоб отримати новий.',
    otpRecoveryLabel: 'Введіть email для отримання нового коду',
    otpRecoveryPlaceholder: 'Ваша адреса email',
    otpRecoveryButton: 'Надіслати новий код',
    otpRecoverySent: 'Якщо цей email є в нашій базі, новий код уже надіслано.',
    otpRecoveryButtonSending: 'Надсилання...'
  }
}
const DEFAULT_DOMAIN = window.RegistrationShared.DEFAULT_DOMAIN; // change in shared.js when deploying

const DEFAULT_ENDPOINTS = {
  validateOtpUrl: '/api/leads/fetch_by_code?code=',
  updateLeadUrl: '/api/leads/update-lead',
  plaidLinkTokenUrl: '/api/leads/plaid/link-token',
  plaidCombinedLinkTokenUrl: '/api/leads/plaid/combined-link-token',
  plaidExchangeUrl: '/api/leads/plaid/exchange',
  saveDocumentUrl: '/api/leads/upload_document',
  generateContractUrl: '/api/leads/generate_contract',
  getEmbedSigningUrl: '/api/leads/sign_embed_url',
  storeFuelCardsUrl: '/api/leads/set_fuel_cards',
  requestNewCodeUrl: '/api/leads/request-new-code'
};

function registrationForm() {
  return {
    step: 1,
    language: 'en',
    translations: TRANSLATIONS,
    verifying: false,
    fuelCardsSubmitting: false,
    submitting: false,
    // Terms modal state
    termsModalVisible: false,
    // Disclaimer modal state (shown after OTP success)
    disclaimerModalVisible: false,
    // Contract embed state
    contractEmbedUrl: null,
    loadingContract: false,
    contractError: null,
    documentId: null,
    // form includes fields used across steps
    form: {
      tokenId: '', // optional, populated by external app
      otp: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',

      // Address structures
      companyAddress: { line1: '', line2: '', city: '', state: '', zip: '' },
      mailingAddressChoice: 'same-as-company',
      mailingAddress: { line1: '', line2: '', city: '', state: '', zip: '' },

      // Bank info (masked sensitive fields only)
      bank: {
        name: '',
        accountType: '',
        routingNumber: '',
        accountNumberMasked: '',
        accountNumberMaskedConfirm: ''
      },

      // Personal info
      personal: {
        ssnLast4Masked: '',
        driverLicenseNumber: ''
      },

      // Personal address
      personalAddressChoice: 'same-as-business',
      personalAddress: { line1: '', line2: '', city: '', state: '', zip: '' },

      // Billing contact
      billingChoice: 'self',
      billingContact: {
        name: '',
        role: '',
        email: ''
      },

      // Uploaded file metadata (filenames returned by save-document)
      files: {
        // e.g. voidCheck: { field: 'voidCheck', filename: 'void_check_acme_Corp.pdf' }
      },

      // Terms
      acceptTerms: false
    },
    // visibility toggles for masked fields
    showBankAccount: false,
    showBankAccountConfirm: false,
    showSsn: false,
    showDriverLicense: false,
    // data from validate-otp
    lead: null,
    // server-provided proof after successful OTP verification
    registrationProof: null,
    // Session token returned after a successful OTP verification; sent in all subsequent requests
    sessionToken: null,
    // Email recovery state — shown when OTP code is invalid or already consumed
    showEmailRecovery: false,
    recoveryEmail: '',
    recoverySent: false,
    recoverySending: false,

    // selected files (UI only for now)
    files: {
      voidCheck: null,
      driverLicenseScan: null
    },
    plaid: {
      status: 'not_started',
      linkToken: '',
      linkSessionId: '',
      selectedAccount: null,
      institution: null,
      requestId: null,
      requiresManualBankInput: false,
      combinedProbe: {
        enabled: false,
        mode: 'standard',
        idvEvents: [],
        lastOutcome: null
      }
    },
    plaidHandler: null,
    // Step 11 fuel cards inputs (separate object as requested)
    fuelCardsData: [
      window.RegistrationShared.newFuelCardRow()
    ],
    uploadStatus: {
      voidCheck: { message: '', type: '' },
      driverLicenseScan: { message: '', type: '' }
    },
    uploadInFlight: {
      voidCheck: false,
      driverLicenseScan: false
    },
    errors: {},
    warnings: {},
    pendingMessage: '',

    // Initialize on page load - check for code in URL
    init() {
      const urlParams = new URLSearchParams(window.location.search);
      const codeFromUrl = urlParams.get('code');
      if (codeFromUrl && /^[0-9]{6}$/.test(codeFromUrl)) {
        this.form.otp = codeFromUrl;
        this.verifyOtp();
      }
    },

    getEndpoint(key) {
      return window.RegistrationShared.resolveEndpoint(DEFAULT_DOMAIN, DEFAULT_ENDPOINTS, key);
    },

    isPlaidStep5Enabled() {
      const config = window.APP_CONFIG || {};
      const raw = config.plaid_step5_enabled;

      if (raw === undefined || raw === null || raw === '') return true;
      if (typeof raw === 'boolean') return raw;
      if (typeof raw === 'number') return raw !== 0;

      const normalized = String(raw).trim().toLowerCase();
      if (['0', 'false', 'off', 'no', 'disabled'].includes(normalized)) return false;
      return true;
    },

    isPlaidCombinedLinkEnabled() {
      const config = window.APP_CONFIG || {};
      const raw = config.plaid_combined_link_enabled;

      if (raw === undefined || raw === null || raw === '') return false;
      if (typeof raw === 'boolean') return raw;
      if (typeof raw === 'number') return raw !== 0;

      const normalized = String(raw).trim().toLowerCase();
      if (['0', 'false', 'off', 'no', 'disabled'].includes(normalized)) return false;
      return true;
    },

    async requestJson(url, options = {}, timeoutMs = 20000) {
      return window.RegistrationShared.requestJson(url, options, timeoutMs);
    },

    mapLeadFromApi(apiLead) {
      return {
        firstName: apiLead.first_name || '',
        lastName: apiLead.last_name || '',
        email: apiLead.email || '',
        phone: apiLead.phone || '',
        accountType: apiLead['is_business?'] ? 'business' : 'personal',
        businessOwnerConfirm: !!apiLead['is_business?'],
        companyName: apiLead.company_name || '',
        businessType: apiLead.business_type || '',
        companyTitle: apiLead.title || '',
        fleetSize: apiLead.fleet_size ?? '',
        dot: apiLead.company_dot || apiLead.company_dot === 0 ? String(apiLead.company_dot) : '',
        mc: apiLead.company_mc || apiLead.company_mc === 0 ? String(apiLead.company_mc) : '',
        refFirstName: apiLead.referer?.ref_first_name || '',
        refLastName: apiLead.referer?.ref_last_name || '',
        refCompany: apiLead.referer?.ref_company || '',
        refPhone: apiLead.referer?.ref_phone || '',
        driverLicenseNumber: apiLead.driver_license_number || ''
      };
    },

    hydrateFormFromLead() {
      this.form.firstName = this.lead.firstName;
      this.form.lastName = this.lead.lastName;
      this.form.email = this.lead.email;
      this.form.personal.driverLicenseNumber = this.lead.driverLicenseNumber;
    },

    hydrateAddresses(apiLead) {
      const companyAddr = apiLead.company_address || apiLead.address || null;
      if (companyAddr) {
        this.form.companyAddress = {
          line1: companyAddr.line1 || '',
          line2: companyAddr.line2 || '',
          city: companyAddr.city || '',
          state: companyAddr.state || '',
          zip: companyAddr.zip || ''
        };
      }

      const mailingAddr = apiLead.mailing_address || null;
      if (mailingAddr) {
        this.form.mailingAddressChoice = 'other';
        this.form.mailingAddress = {
          line1: mailingAddr.line1 || '',
          line2: mailingAddr.line2 || '',
          city: mailingAddr.city || '',
          state: mailingAddr.state || '',
          zip: mailingAddr.zip || ''
        };
      } else {
        this.form.mailingAddressChoice = 'same-as-company';
        this.form.mailingAddress = { ...this.form.companyAddress };
      }

      const shippingAddr = apiLead.shipping_address || null;
      if (shippingAddr) {
        this.form.personalAddressChoice = 'other';
        this.form.personalAddress = {
          line1: shippingAddr.line1 || '',
          line2: shippingAddr.line2 || '',
          city: shippingAddr.city || '',
          state: shippingAddr.state || '',
          zip: shippingAddr.zip || ''
        };
      } else {
        this.form.personalAddressChoice = 'same-as-business';
        this.form.personalAddress = { ...this.form.companyAddress };
      }
    },

    hydrateBankInfo(apiLead) {
      const bank = apiLead.bank_information || {};
      this.form.bank = {
        name: bank.name || '',
        accountType: bank.account_type || '',
        routingNumber: bank.routing_number || '',
        accountNumberMasked: bank.account_number_masked || '',
        accountNumberMaskedConfirm: bank.account_number_masked || ''
      };

      const metadataPlaid = apiLead.metadata?.plaid || {};
      const isPlaidVerification =
        bank.verification_method === 'plaid' ||
        !!bank.plaid_account_id ||
        !!metadataPlaid.plaid_account_id;

      if (isPlaidVerification) {
        const selectedAccountId = bank.plaid_account_id || metadataPlaid.plaid_account_id || null;
        const selectedMask = bank.plaid_account_mask || metadataPlaid.plaid_account_mask || bank.account_number_masked || '';
        const selectedSubtype = bank.plaid_account_subtype || metadataPlaid.plaid_account_subtype || bank.account_type || '';

        this.plaid.status = 'verified';
        this.plaid.linkSessionId = bank.plaid_link_session_id || metadataPlaid.plaid_link_session_id || '';
        this.plaid.institution = {
          name: bank.plaid_institution_name || metadataPlaid.plaid_institution_name || bank.name || ''
        };
        this.plaid.selectedAccount = {
          id: selectedAccountId,
          mask: selectedMask,
          subtype: selectedSubtype,
          type: selectedSubtype
        };
        this.plaid.requiresManualBankInput = !!metadataPlaid.plaid_manual_bank_required;
      } else {
        this.plaid.status = 'not_started';
        this.plaid.linkSessionId = '';
        this.plaid.institution = null;
        this.plaid.selectedAccount = null;
        this.plaid.requiresManualBankInput = false;
      }
    },

    plaidStatusText() {
      const keyByStatus = {
        not_started: 'plaidStatusNotStarted',
        in_progress: 'plaidStatusInProgress',
        verified: 'plaidStatusVerified',
        error: 'plaidStatusError'
      };
      return this.t(keyByStatus[this.plaid.status] || 'plaidStatusNotStarted');
    },

    shouldShowPlaidIntroCard() {
      return this.isPlaidStep5Enabled() && this.plaid.status !== 'verified' && !this.plaid.requiresManualBankInput;
    },

    step5ActionLabel() {
      if (!this.isPlaidStep5Enabled()) return this.t('nextStep');
      if (this.plaid.status === 'in_progress') return this.t('plaidConnectingButton');
      if (this.plaid.status === 'verified') return this.t('nextStep');
      if (this.plaid.status === 'error') return this.t('plaidRetryButton');
      return this.t('plaidVerifyButton');
    },

    async step5Action() {
      if (!this.isPlaidStep5Enabled()) {
        await this.next();
        return;
      }

      if (this.plaid.status === 'verified') {
        await this.next();
        return;
      }

      await this.startPlaidVerification();
    },

    formatPlaidSelectionSummary() {
      const account = this.plaid.selectedAccount || {};
      const institutionName = this.plaid.institution?.name || this.form.bank.name || '';
      const mask = account.mask || '';
      const subtype = account.subtype || account.type || this.form.bank.accountType || '';

      return [
        institutionName,
        mask ? `••••${mask}` : '',
        subtype ? String(subtype).replace(/_/g, ' ') : ''
      ].filter(Boolean).join(', ');
    },

    async startPlaidVerification() {
      if (this.plaid.status === 'in_progress') return;

      this.errors.plaidFlow = '';
      this.errors.plaidVerification = '';
      this.plaid.status = 'in_progress';
      this.plaid.combinedProbe.idvEvents = [];
      this.plaid.combinedProbe.lastOutcome = null;

      try {
        const verificationCode = this.form.otp;
        // Plaid Link Web SDK docs:
        // https://plaid.com/docs/link/web/
        const linkToken = await this.fetchPlaidLinkToken(verificationCode);

        if (!window.Plaid || typeof window.Plaid.create !== 'function') {
          throw new Error(this.t('errorPlaidUnavailable'));
        }

        if (this.plaidHandler && typeof this.plaidHandler.destroy === 'function') {
          this.plaidHandler.destroy();
        }

        this.plaidHandler = window.Plaid.create({
          token: linkToken,
          onSuccess: async (publicToken, metadata) => {
            await this.handlePlaidSuccess(publicToken, metadata);
          },
          onEvent: (eventName, metadata) => {
            this.handlePlaidEvent(eventName, metadata);
          },
          onExit: (error, metadata) => {
            this.handlePlaidEvent('EXIT', metadata);

            if (this.plaid.status === 'verified') return;

            this.plaid.status = 'not_started';
            if (error?.display_message) {
              this.errors.plaidFlow = error.display_message;
            } else if (error?.error_message) {
              this.errors.plaidFlow = error.error_message;
            }
          }
        });

        this.plaidHandler.open();
      } catch (error) {
        console.error('startPlaidVerification failed', error);
        this.plaid.status = 'error';
        this.errors.plaidFlow = error?.message || this.t('errorPlaidFlowFailed');
      }
    },

    async fetchPlaidLinkToken(verificationCode) {
      // Plaid /link/token/create docs:
      // https://plaid.com/docs/api/link/#linktokencreate
      const useCombinedProbe = this.isPlaidCombinedLinkEnabled();
      const endpointKey = useCombinedProbe ? 'plaidCombinedLinkTokenUrl' : 'plaidLinkTokenUrl';
      const plaidLinkTokenUrl = this.getEndpoint(endpointKey);
      const { ok, data } = await this.requestJson(plaidLinkTokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationCode,
          sessionToken: this.sessionToken,
          mode: useCombinedProbe ? 'single_session_probe' : 'standard'
        })
      });

      if (!ok || !data?.success || !data?.link_token) {
        throw new Error(data?.message || this.t('errorPlaidUnavailable'));
      }

      this.plaid.linkToken = data.link_token;
      this.plaid.requestId = data.request_id || null;
      this.plaid.combinedProbe.enabled = useCombinedProbe;
      this.plaid.combinedProbe.mode = data.mode || (useCombinedProbe ? 'single_session_probe' : 'standard');
      return data.link_token;
    },

    handlePlaidEvent(eventName, metadata) {
      if (!this.plaid.combinedProbe.enabled) return;
      if (!eventName) return;

      if (String(eventName).startsWith('IDENTITY_VERIFICATION_')) {
        this.plaid.combinedProbe.idvEvents.push({
          eventName,
          linkSessionId: metadata?.link_session_id || metadata?.linkSessionId || null,
          viewName: metadata?.view_name || null,
          timestamp: metadata?.timestamp || new Date().toISOString()
        });

        if (eventName === 'IDENTITY_VERIFICATION_PASS_SESSION') {
          this.plaid.combinedProbe.lastOutcome = 'idv_passed';
        } else if (eventName === 'IDENTITY_VERIFICATION_FAIL_SESSION') {
          this.plaid.combinedProbe.lastOutcome = 'idv_failed';
        } else if (eventName === 'IDENTITY_VERIFICATION_PENDING_REVIEW_SESSION') {
          this.plaid.combinedProbe.lastOutcome = 'idv_pending_review';
        }
      }
    },

    async handlePlaidSuccess(publicToken, metadata) {
      this.plaid.status = 'in_progress';
      this.errors.plaidFlow = '';

      if (this.plaid.combinedProbe.enabled && !publicToken) {
        this.plaid.status = 'error';
        this.plaid.combinedProbe.lastOutcome = this.plaid.combinedProbe.lastOutcome || 'missing_public_token';
        this.errors.plaidFlow = 'Combined Plaid flow finished without bank token. Single-session feasibility needs fallback handling.';
        return;
      }

      const selectedAccount = (metadata?.accounts || [])[0] || null;
      if (!selectedAccount?.id) {
        this.plaid.status = 'error';
        this.errors.plaidFlow = this.t('errorPlaidAccountRequired');
        return;
      }

      // Plaid Link onSuccess docs:
      // https://plaid.com/docs/link/web/#onsuccess
      // Plaid token exchange and Auth docs:
      // https://plaid.com/docs/api/items/#itempublic_tokenexchange
      // https://plaid.com/docs/api/products/auth/#authget
      const plaidExchangeUrl = this.getEndpoint('plaidExchangeUrl');
      const { ok, data } = await this.requestJson(plaidExchangeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationCode: this.form.otp,
          sessionToken: this.sessionToken,
          publicToken,
          accountId: selectedAccount.id,
          metadata
        })
      });

      if (!ok || !data?.success) {
        this.plaid.status = 'error';
        this.errors.plaidFlow = data?.message || this.t('errorPlaidFlowFailed');
        return;
      }

      this.applyPlaidVerificationResult(data, metadata, selectedAccount);
    },

    applyPlaidVerificationResult(payload, metadata, selectedAccount) {
      const plaidPayload = payload?.plaid || {};
      this.plaid.status = 'verified';
      this.plaid.linkSessionId = metadata?.link_session_id || '';
      this.plaid.requestId = plaidPayload.request_id || null;
      this.plaid.institution = {
        name: plaidPayload.institution_name || metadata?.institution?.name || ''
      };
      this.plaid.selectedAccount = {
        id: plaidPayload.plaid_account_id || selectedAccount?.id || null,
        mask: plaidPayload.account_mask || selectedAccount?.mask || '',
        subtype: plaidPayload.account_subtype || selectedAccount?.subtype || '',
        type: selectedAccount?.type || ''
      };
      //this.plaid.requiresManualBankInput = !!payload.requires_manual_bank_input;
      this.plaid.requiresManualBankInput = true; // force manual bank input while Plaid issue is being resolved, to avoid blocking users from proceeding

      this.form.bank.name = plaidPayload.institution_name || metadata?.institution?.name || this.form.bank.name;
      this.form.bank.accountType = this.plaid.selectedAccount.subtype || this.form.bank.accountType;

      if (this.plaid.requiresManualBankInput) {
        // Tokenized account flow: keep user in Plaid step and require manual account/routing capture.
        this.form.bank.routingNumber = '';
        this.form.bank.accountNumberMasked = '';
        this.form.bank.accountNumberMaskedConfirm = '';
        this.step = 3;
        this.saveProgress(3).catch((err) => {
          console.error('saveProgress unhandled error', err);
        });
      } else {
        // Non-tokenized flow: proceed to Company step after Plaid verification.
        this.form.bank.accountNumberMasked = this.plaid.selectedAccount.mask || this.form.bank.accountNumberMasked;
        this.form.bank.accountNumberMaskedConfirm = this.form.bank.accountNumberMasked;
        this.step = 4;
        this.saveProgress(4).catch((err) => {
          console.error('saveProgress unhandled error', err);
        });
      }
    },

    hydrateBillingContact(apiLead) {
      const billing = apiLead.billing_contact || {};
      const primaryEmail = this.form.email;
      if (billing.email && billing.email !== primaryEmail) {
        this.form.billingChoice = 'other';
        this.form.billingContact = {
          name: billing.name || '',
          role: billing.role || '',
          email: billing.email || ''
        };
      } else {
        this.form.billingChoice = 'self';
        this.form.billingContact = {
          name: billing.name || '',
          role: billing.role || '',
          email: primaryEmail || billing.email || ''
        };
      }
    },

    hydrateUploadedFiles(apiLead) {
      const filesArray = apiLead.files || [];
      if (filesArray.length === 0) return;

      if (!this.form.files) {
        this.form.files = {};
      }

      filesArray.forEach((fileInfo) => {
        if (fileInfo.type && fileInfo.name) {
          this.form.files[fileInfo.type] = {
            field: fileInfo.type,
            filename: fileInfo.name
          };
          this.uploadStatus[fileInfo.type] = {
            message: this.t('uploadPreviouslyUploaded'),
            type: 'success'
          };
        }
      });
      console.log('Hydrated files from API:', this.form.files);
    },

    applyResumeStep(json) {
      const resumeStep = json.step_completed ?? json.completed_step;
      this.step =
        typeof resumeStep === 'number' && resumeStep >= 2 && resumeStep <= 12
          ? resumeStep
          : 2;

      if (this.step === 2) {
        this.disclaimerModalVisible = true;
      }

      if (this.step === 10) {
        this.loadContractEmbed();
      }
    },

    // ==== OTP verification ====
    async verifyOtp() {
      if (this.verifying) return;
      this.errors = {};
      this.pendingMessage = '';
      const otp = (this.form.otp || '').trim().toUpperCase();

      if (!/^[0-9A-F]{6}$/.test(otp)) {
        this.errors.otp = this.t('errorOtpInvalidFormat');
        return;
      }

      this.form.otp = otp;
      this.verifying = true;
      try {
        const validateOtpUrl = this.getEndpoint('validateOtpUrl');
        const { ok, data: json } = await this.requestJson(validateOtpUrl + encodeURIComponent(otp), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        console.log('validate-otp response', json);

        // If backend indicates application is still under review, do not proceed
        if (json.pending === true) {
          this.pendingMessage = this.t('pendingReviewMessage');
          return;
        }

        if (!ok || !json.success) {
          this.errors.otp = this.t(json.message) || this.t('errorOtpInvalidOrUsed');
          if (json.code === 'OTP_INVALID_OR_USED') {
            this.form.otp = '';
            this.showEmailRecovery = true;
          }
          return;
        }

        // Check if lead data exists before proceeding
        if (!json.lead) {
          this.errors.otp = this.t('errorLeadMissing');
          return;
        }

        // mirror backend structure: lead has snake_case keys and nested referer
        const apiLead = json.lead;

        if (json.document_id) {
          this.documentId = json.document_id;
          this.form.documentId = json.document_id;
        }
        console.log('Fetched lead data:', apiLead);

        this.lead = this.mapLeadFromApi(apiLead);
        this.hydrateFormFromLead();
        this.hydrateAddresses(apiLead);
        this.hydrateBankInfo(apiLead);
        this.hydrateBillingContact(apiLead);
        this.hydrateUploadedFiles(apiLead);
        this.sessionToken = json.session_token || null;
        this.applyResumeStep(json);
      } catch (err) {
        console.error('verifyOtp error', err);
        this.errors.otp = this.t('errorNetworkTryAgain');
      } finally {
        this.verifying = false;
      }
    },


    async requestNewCode() {
      if (this.recoverySending) return;
      const email = (this.recoveryEmail || '').trim();
      if (!email) return;

      this.recoverySending = true;
      try {
        const requestNewCodeUrl = this.getEndpoint('requestNewCodeUrl');
        await this.requestJson(requestNewCodeUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        // Always show success to prevent email enumeration
        this.recoverySent = true;
        this.errors.otp = '';
      } catch (err) {
        console.error('requestNewCode error', err);
        this.recoverySent = true; // keep success appearance to prevent enumeration
        this.errors.otp = '';
      } finally {
        this.recoverySending = false;
      }
    },

    async saveProgress(nextStepOverride) {
      try {
        const otpCode = this.form.otp;
        if (!otpCode) {
          console.warn('saveProgress: no otpCode available, skipping progress save');
          return;
        }

        const updateLeadUrl = this.getEndpoint('updateLeadUrl');
        const { ok, status, text } = await this.requestJson(updateLeadUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.buildUpdateLeadPayload(otpCode, nextStepOverride))
        });

        if (!ok) {
          console.warn('saveProgress failed', status, text);
        }
      } catch (err) {
        console.error('saveProgress error', err);
      }
    },

    buildUpdateLeadPayload(code, nextStepOverride) {
      // Build bank payload without sending an empty routingNumber.
      // After a successful non-tokenized Plaid exchange the routing number is
      // stored server-side only — the JS form state stays ''. Sending '' would
      // attempt to overwrite (and clear) the server-set value. Omitting the key
      // entirely lets the backend preserve whatever it already has.
      const bankPayload = { ...this.form.bank };
      if (!bankPayload.routingNumber) {
        delete bankPayload.routingNumber;
      }

      const formPayload = {
        ...this.form,
        bank: bankPayload,
        plaid: {
          status: this.plaid.status,
          linkSessionId: this.plaid.linkSessionId || '',
          requestId: this.plaid.requestId || null,
          requiresManualBankInput: !!this.plaid.requiresManualBankInput,
          institution: this.plaid.institution || null,
          selectedAccount: this.plaid.selectedAccount || null
        }
      };

      return {
        form: formPayload,
        code,
        sessionToken: this.sessionToken,
        stepCompleted: typeof nextStepOverride === 'number' ? nextStepOverride : (this.step + 1)
      };
    },


    addError(field, translationKey) {
      this.errors[field] = this.t(translationKey);
    },

    validateStep2() {
      if (this.lead?.email && !this.isValidEmail(this.lead.email)) {
        this.addError('contactEmail', 'errorContactEmailInvalid');
      }
      if (this.lead?.phone && !this.isValidPhone(this.lead.phone)) {
        this.addError('contactPhone', 'errorContactPhoneInvalid');
      }
    },

    validateStep3() {
      if (!this.form.companyAddress.line1) this.addError('companyAddressLine1', 'errorCompanyStreetRequired');
      if (!this.form.companyAddress.city) this.addError('companyAddressCity', 'errorCompanyCityRequired');
      if (!this.form.companyAddress.state) this.addError('companyAddressState', 'errorCompanyStateRequired');
      if (!this.form.companyAddress.zip) this.addError('companyAddressZip', 'errorCompanyZipRequired');
    },

    validateManualBankFields() {
      if (!this.form.bank.name) {
        this.addError('bankName', 'errorBankNameRequired');
      }

      const routingDigits = this.normalizeDigits(this.form.bank.routingNumber, 9);
      if (!routingDigits) {
        this.addError('routingNumber', 'errorRoutingRequired');
      } else if (!this.isValidRoutingNumber(routingDigits)) {
        this.addError('routingNumber', 'errorRoutingInvalid');
      }

      const accountDigits = this.normalizeDigits(this.form.bank.accountNumberMasked);
      if (!accountDigits) {
        this.addError('accountNumberMasked', 'errorAccountRequired');
      } else if (!this.isValidBankAccountLength(accountDigits)) {
        this.addError('accountNumberMasked', 'errorAccountInvalid');
      }

      if (!this.form.bank.accountNumberMaskedConfirm) {
        this.addError('accountNumberMaskedConfirm', 'errorAccountConfirmRequired');
      } else if (this.normalizeDigits(this.form.bank.accountNumberMasked) !== this.normalizeDigits(this.form.bank.accountNumberMaskedConfirm)) {
        this.addError('accountNumberMaskedConfirm', 'errorAccountMismatch');
      }
    },

    validateStep5() {
      if (!this.isPlaidStep5Enabled()) {
        this.validateManualBankFields();
        return;
      }

      if (this.plaid.status === 'verified' && !this.plaid.requiresManualBankInput) {
        return;
      }

      if (this.plaid.status === 'verified' && this.plaid.requiresManualBankInput) {
        this.validateManualBankFields();
        return;
      }

      const hasLegacyManualData =
        !!this.form.bank.name &&
        !!this.form.bank.accountNumberMasked &&
        !!this.form.bank.routingNumber;

      if (hasLegacyManualData) {
        this.validateManualBankFields();
        return;
      }

      this.addError('plaidVerification', 'errorPlaidVerificationRequired');
    },

    validateStep6() {
      if (!this.form.personal.ssnLast4Masked || this.form.personal.ssnLast4Masked.length !== 9) {
        this.addError('ssnLast4Masked', 'errorSsnFullRequired');
      }
    },

    validateStep8() {
      if (this.form.billingChoice !== 'other') return;

      if (!this.form.billingContact.email) {
        this.addError('billingContactEmail', 'errorBillingEmailRequired');
      } else if (!this.isValidEmail(this.form.billingContact.email)) {
        this.addError('billingContactEmail', 'errorBillingEmailInvalid');
      }
    },

    isPlaidVerified() {
      return this.plaid.status === 'verified';
    },

    requiresVoidedCheckForSubmission() {
      return !this.isPlaidVerified();
    },

    hasManualBankFallbackData() {
      const bank = this.form.bank || {};
      const bankName = String(bank.name || '').trim();
      const routingDigits = this.normalizeDigits(bank.routingNumber, 9);
      const accountDigits = this.normalizeDigits(bank.accountNumberMasked);
      const confirmDigits = this.normalizeDigits(bank.accountNumberMaskedConfirm || bank.accountNumberMasked);

      return (
        bankName.length > 0 &&
        this.isValidRoutingNumber(routingDigits) &&
        this.isValidBankAccountLength(accountDigits) &&
        accountDigits === confirmDigits
      );
    },

    shouldBlockTokenizedManualFallbackAtStep9() {
      return this.plaid.requiresManualBankInput && !this.hasManualBankFallbackData();
    },

    shouldShowMissingFilesPanel() {
      const missingDriverLicense = !this.form.files?.driverLicenseScan?.filename;
      const missingVoidCheck = this.requiresVoidedCheckForSubmission() && !this.form.files?.voidCheck?.filename;

      return this.shouldBlockTokenizedManualFallbackAtStep9() || missingVoidCheck || missingDriverLicense;
    },

    validateStep9() {
      const missingDriverLicense = !this.form.files?.driverLicenseScan;
      const missingVoidCheck = this.requiresVoidedCheckForSubmission() && !this.form.files?.voidCheck;

      if (missingVoidCheck || missingDriverLicense) {
        this.errors.missingFiles = true;
      }

      if (this.shouldBlockTokenizedManualFallbackAtStep9()) {
        this.errors.tokenizedManualBank = this.t('errorTokenizedManualBankRequired');
      }
    },

    // validate fields like before; allow moving between steps
    validate() {
      this.errors = {};
      this.warnings = {};

      const validatorsByStep = {
        2: () => this.validateStep2(),
        3: () => this.validateStep5(),
        4: () => this.validateStep3(),
        6: () => this.validateStep6(),
        8: () => this.validateStep8(),
        9: () => this.validateStep9()
      };

      const runValidator = validatorsByStep[this.step];
      if (runValidator) {
        runValidator();
      }

      return Object.keys(this.errors).length === 0;
    },

    computeNextStep() {
      let nextStep = this.step + 1;

      // Reordered flow: Review (2) -> Bank/Plaid (3) -> Company (4) -> Mailing (5) -> Personal (6)
      if (this.step === 4 && this.form.mailingAddressChoice === 'same-as-company') {
        this.form.mailingAddress = { ...this.form.companyAddress };
        nextStep = 6;
      }
      return nextStep;
    },

    async next() {
      if (this.verifying || this.submitting || this.fuelCardsSubmitting) return;
      if (!this.validate()) return;

      const nextStep = this.computeNextStep();

      // Fire-and-forget: do not block navigation on save progress errors
      this.saveProgress(nextStep).catch((err) => {
        console.error('saveProgress unhandled error', err);
      });

      this.step = nextStep;

      // Load contract embed when entering step 10
      if (nextStep === 10) {
        this.loadContractEmbed();
      }
    },
    prev() {
      if (this.step === 6) {
        this.step = this.form.mailingAddressChoice === 'same-as-company' ? 4 : 5;
        return;
      }

      this.step = Math.max(1, this.step - 1);
    },

    onFileSelect(event, key) {
      const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
      if (!file) return;

      const validation = window.RegistrationShared.validateUploadFile(file);
      if (!validation.ok && validation.reason === 'type') {
        this.uploadStatus[key] = { message: this.t('errorFileTypeInvalid'), type: 'error' };
        event.target.value = '';
        return;
      }

      if (!validation.ok && validation.reason === 'size') {
        this.uploadStatus[key] = { message: this.t('errorFileTooLarge'), type: 'error' };
        event.target.value = '';
        return;
      }

      if (this.uploadInFlight[key]) {
        return;
      }

      this.files[key] = file;

      this.uploadStatus[key] = { message: '', type: '' };
      this.uploadDocument(key, file);
    },

    async uploadDocument(key, file) {
      const saveDocumentUrl = this.getEndpoint('saveDocumentUrl');
      this.uploadInFlight[key] = true;
      try {
        console.log('Uploading document to backend lead controller:', {
          url: saveDocumentUrl,
          field: key,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size
        });

        const formData = this.buildUploadDocumentFormData(key, file);

        const { ok, data: uploadJson } = await this.requestJson(saveDocumentUrl, {
          method: 'POST',
          body: formData
        });
        console.log('upload_document response', uploadJson);

        if (!ok || !uploadJson.success) {
          throw new Error(uploadJson.message || 'Upload failed');
        }

        // Store the resulting filename in the form as requested
        if (!this.form.files) {
          this.form.files = {};
        }
        this.form.files[key] = {
          field: key,
          filename: uploadJson.fileName || file.name
        };

        // Fire-and-forget save progress. Do not update step, only uploaded file info.
        this.saveProgress(this.step).catch((err) => {
          console.error('saveProgress unhandled error', err);
        });

        this.uploadStatus[key] = {
          message: this.t('uploadSuccess'),
          type: 'success'
        };
      } catch (err) {
        console.error('Document upload failed for', key, err);
        this.uploadStatus[key] = {
          message: this.t('uploadFailed'),
          type: 'error'
        };
      } finally {
        this.uploadInFlight[key] = false;
      }
    },

    buildUploadDocumentFormData(key, file) {
      const formData = new FormData();
      formData.append('code', this.form.otp || '');
      if (this.sessionToken) {
        formData.append('sessionToken', this.sessionToken);
      }
      formData.append('field', key);
      formData.append('file', file, file.name);
      return formData;
    },

    async finalize() {
      await this.next();
    },

    // Show terms modal after validation passes
    showTermsModal() {
      if (!this.validate()) return;
      this.termsModalVisible = true;
    },

    // Accept terms and proceed with submission
    async acceptTermsAndSubmit() {
      this.form.acceptTerms = true;
      this.termsModalVisible = false;
      await this.submit();
    },

    buildContractPayload() {
      return {
        registrationProof: this.registrationProof,
        code: this.form.otp,
        sessionToken: this.sessionToken,
        form: this.form
      };
    },

    async requestContractGeneration() {
      const generateContractUrl = this.getEndpoint('generateContractUrl');
      return this.requestJson(generateContractUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.buildContractPayload())
      });
    },

    applyContractGenerationSuccess(json) {
      this.step = 10;
      this.documentId = json.document_id || null;
      // Load contract embed immediately after moving to step 10
      this.loadContractEmbed();
    },

    buildEmbedSigningPayload() {
      return {
        code: this.form.otp,
        sessionToken: this.sessionToken,
        documentId: this.documentId
      };
    },

    async requestEmbedSigningUrl() {
      const getEmbedSigningUrl = this.getEndpoint('getEmbedSigningUrl');
      return this.requestJson(getEmbedSigningUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.buildEmbedSigningPayload())
      });
    },

    setContractEmbedLoadingState(isLoading) {
      this.loadingContract = isLoading;
      if (isLoading) {
        this.contractEmbedUrl = null;
        this.contractError = null;
      }
    },

    //
    async submit() {
      if (this.submitting) return;
      if (!this.validate()) return;
      this.submitting = true;
      try {
        console.log('Submitting registration with form data:', JSON.stringify(this.form));

        const { ok, data: json } = await this.requestContractGeneration();
        if (!ok) {
          this.errors.form = json.message || this.t('errorCreateContractFailed');
          // optionally show detailed error
        } else {
          this.applyContractGenerationSuccess(json);
        }
      } catch (err) {
        this.errors.form = this.t('errorFormNetwork');
      } finally {
        this.submitting = false;
      }
    },

    async getEmbedUrl() {
      try {
        if (!this.documentId) {
          this.errors.form = this.t('errorNoDocumentId');
          return null;
        }
        const { ok, data: json } = await this.requestEmbedSigningUrl();
        if (!ok || !json.success) {
          this.errors.form = json.message || this.t('errorGetEmbedFailed');
          return null;
        }
        return json.sign_url || null;
      } catch (err) {
        this.errors.form = this.t('errorFormNetwork');
        return null;
      }
    },

    async loadContractEmbed() {
      this.setContractEmbedLoadingState(true);

      try {
        const embedUrl = await this.getEmbedUrl();
        if (embedUrl) {
          this.contractEmbedUrl = embedUrl;
        } else {
          this.contractError = this.errors.form || this.t('errorLoadContractFailed');
        }
      } catch (err) {
        console.error('loadContractEmbed error', err);
        this.contractError = this.t('errorUnexpected');
      } finally {
        this.setContractEmbedLoadingState(false);
      }
    },

    addFuelCardRow() {
      this.fuelCardsData.push(window.RegistrationShared.newFuelCardRow());
    },

    async submitFuelCards() {
      if (this.fuelCardsSubmitting) return;
      this.errors.fuelCards = '';
      const cleaned = window.RegistrationShared.cleanFuelCards(this.fuelCardsData);

      this.fuelCardsSubmitting = true;
      try {
        const storeFuelCardsUrl = this.getEndpoint('storeFuelCardsUrl');
        const { ok, data: json } = await this.requestJson(storeFuelCardsUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.buildFuelCardsPayload(cleaned))
        });

        if (!ok || json.success === false) {
          this.errors.fuelCards = json.message || this.t('errorFuelCardsStoreFailed');
          return;
        }

        this.step = 12;
      } catch (err) {
        console.error('store-fuel-cards error', err);
        this.errors.fuelCards = this.t('errorFuelCardsNetwork');
      } finally {
        this.fuelCardsSubmitting = false;
      }
    },

    buildFuelCardsPayload(fuelCards) {
      return {
        otpCode: this.form.otp,
        sessionToken: this.sessionToken,
        fuelCards
      };
    },

    t(key) {
      const dict = this.translations?.[this.language] || this.translations?.en || {};
      const fallback = this.translations?.en || {};
      return dict[key] ?? fallback[key] ?? key;
    },

    progressLabels() {
      const dict = this.translations?.[this.language] || this.translations?.en || {};
      return dict.progressSteps || this.translations?.en?.progressSteps || [];
    },

    // formatting helpers for summary step
    formatAddress(addr) {
      if (!addr) return '';
      const parts = [addr.line1, addr.line2, addr.city, addr.state, addr.zip].filter(Boolean);
      return parts.join(', ');
    },

    formatMailingAddress() {
      if (this.form.mailingAddressChoice === 'same-as-company') {
        return this.formatAddress(this.form.companyAddress);
      }
      return this.formatAddress(this.form.mailingAddress);
    },

    formatPersonalAddress() {
      if (this.form.personalAddressChoice === 'same-as-business') {
        return this.formatAddress(this.form.companyAddress);
      }
      if (this.form.personalAddressChoice === 'same-as-mailing') {
        return this.formatMailingAddress();
      }
      return this.formatAddress(this.form.personalAddress);
    },

    formatBillingContact() {
      if (this.form.billingChoice === 'self') {
        return this.lead?.email || this.form.email || '';
      }
      return this.form.billingContact.email || '';
    },

    maskLast4(value) {
      const str = String(value || '').replace(/\s+/g, '');
      const digits = str.replace(/\D+/g, '');
      if (!digits) return '';
      const last4 = digits.slice(-4);
      return `****${last4}`;
    },

    normalizeDigits(value, maxLength) {
      const digits = String(value || '').replace(/\D+/g, '');
      return typeof maxLength === 'number' ? digits.slice(0, maxLength) : digits;
    },

    isValidEmail(value) {
      const email = String(value || '').trim();
      if (!email) return false;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

    isValidRoutingNumber(value) {
      const digits = this.normalizeDigits(value, 9);
      if (digits.length !== 9) return false;
      const nums = digits.split('').map((d) => parseInt(d, 10));
      const checksum = (3 * (nums[0] + nums[3] + nums[6])) +
        (7 * (nums[1] + nums[4] + nums[7])) +
        (nums[2] + nums[5] + nums[8]);
      return checksum % 10 === 0;
    },

    isValidBankAccountLength(value) {
      const digits = this.normalizeDigits(value);
      return digits.length >= 5 && digits.length <= 17;
    },

    formatRoutingNumber(value) {
      const digits = this.normalizeDigits(value, 9);
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    },

    formatAccountNumber(value) {
      const digits = this.normalizeDigits(value, 21);
      if (!digits) return '';
      return digits.replace(/(.{4})/g, '$1 ').trim();
    },

    normalizeSsn(value) {
      const digits = String(value || '').replace(/\D+/g, '').slice(0, 9);
      return digits;
    },

    formatSsn(value) {
      const digits = this.normalizeSsn(value);
      if (digits.length <= 3) return digits;
      if (digits.length <= 5) {
        return `${digits.slice(0, 3)}-${digits.slice(3)}`;
      }
      return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
    },

    formatContactSummary() {
      const name = [this.lead?.firstName || this.form.firstName, this.lead?.lastName || this.form.lastName].filter(Boolean).join(' ');
      const email = this.lead?.email || this.form.email || '';
      const phone = this.lead?.phone || '';
      return [name, email, phone].filter(Boolean).join(', ');
    },

    formatCompanySummary() {
      const companyName = this.lead?.companyName || this.form.companyName || '';
      const title = this.lead?.companyTitle || this.form.companyTitle || '';
      const contactName = [this.lead?.firstName || this.form.firstName, this.lead?.lastName || this.form.lastName].filter(Boolean).join(' ');
      const fleet = (this.lead?.fleetSize ?? '') !== '' ? `${this.lead?.fleetSize} trucks` : '';
      const addr = this.formatAddress(this.form.companyAddress);
      const head = [companyName, title ? `${title} - ${contactName}` : contactName].filter(Boolean).join(', ');
      return [head, fleet, addr].filter(Boolean).join(', ');
    },

    formatBankSummary() {
      if (this.plaid.status === 'verified' || this.plaid.selectedAccount) {
        const plaidSummary = this.formatPlaidSelectionSummary();
        if (plaidSummary) return plaidSummary;
      }

      const bank = this.form.bank || {};
      const bankName = bank.name || '';
      const acct = bank.accountNumberMasked ? `Account number ${this.maskLast4(bank.accountNumberMasked)}` : '';
      const routing = bank.routingNumber ? `Routing number ${this.maskLast4(bank.routingNumber)}` : '';
      const type = bank.accountType ? (bank.accountType === 'checking' ? 'Business checking' : bank.accountType) : '';
      return [bankName, acct, routing, type].filter(Boolean).join(', ');
    },

    formatBillingContactSummary() {
      if (this.form.billingChoice === 'self') {
        return this.lead?.email || this.form.email || '';
      }
      const billing = this.form.billingContact || {};
      return [billing.name, billing.email, billing.role].filter(Boolean).join(', ');
    },

    progressPercent() {
      if (this.step >= 10) return 100;
      if (this.step <= 0) return 0;
      return Math.max(0, Math.min(100, this.step * 10));
    },

    formatPersonalInfoSummary() {
      const ssn = this.form.personal?.ssnLast4Masked ? `SSN ${this.maskLast4(this.form.personal.ssnLast4Masked)}` : '';
      const dl = this.form.personal?.driverLicenseNumber ? `DL ${this.form.personal.driverLicenseNumber}` : '';
      return [ssn, dl].filter(Boolean).join(', ');
    }
  }
}