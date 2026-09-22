// Field map for the updated-contract step of the customer portal.
//
// Labels, placeholders and section headings are translation KEYS, not literals.
// Almost every one points at a key the registration flow already owns, so the
// portal asks for the same thing in the same words — and inherits EN/RU/UK/ES
// for free. Only copy with no counterpart there lives under `portalDemo.*`.
//
// Sources:
//   select options   src/pages/LeadForm.jsx:894-897 (businessType)
//                    src/pages/LeadForm.jsx:915-920 (companyTitle)
//   state shape      src/pages/OtpVerification.jsx:157-176
//   choice values    prompts/LEAD_API_CONTRACT.md + src/api/leadMappers.js
//
// `crm` is the record name on our side. Fields marked `isNew` are what the
// updated contract adds.
//
// Option labels are literals because LeadForm hardcodes them in English for
// every language — matching it keeps the two consistent.

export const BUSINESS_TYPES = [
  ['sole',        'Sole Proprietorship'],
  ['partnership', 'Partnership'],
  ['llc',         'LLC'],
  ['corporation', 'Corporation'],
]

export const COMPANY_TITLES = [
  ['ceo',        'CEO'],
  ['cfo',        'CFO'],
  ['accountant', 'Accountant'],
  ['president',  'President'],
  ['owner',      'Owner'],
  ['other',      'Other'],
]

// All three address blocks are identical, as they are in registration.
function addressFields(prefix, crmPrefix) {
  return [
    { key: `${prefix}_street1`, crm: `${crmPrefix} Street Address`, labelKey: 'address.labelStreet1', type: 'text',  required: true,  span: 2, placeholderKey: 'address.placeholderStreet1' },
    { key: `${prefix}_street2`, crm: `${crmPrefix} apt, Unit`,      labelKey: 'address.labelStreet2', type: 'text',  required: false, span: 2, placeholderKey: 'address.placeholderStreet2' },
    { key: `${prefix}_city`,    crm: `${crmPrefix} City`,           labelKey: 'address.labelCity',    type: 'text',  required: true,  placeholderKey: 'address.placeholderCity' },
    { key: `${prefix}_state`,   crm: `${crmPrefix} State`,          labelKey: 'address.labelState',   type: 'state', required: true },
    { key: `${prefix}_zip`,     crm: `${crmPrefix} ZIP`,            labelKey: 'address.labelZip',     type: 'zip',   required: true,  placeholderKey: 'address.placeholderZip' },
  ]
}

export const GROUPS = [
  {
    id: 'business',
    titleKey: 'lead.stepBusiness.title',
    blurbKey: 'lead.stepBusiness.desc',
    fields: [
      { key: 'company_name',   crm: 'Company name',                 labelKey: 'lead.stepBusiness.companyName',  type: 'text',   required: true, placeholderKey: 'lead.stepBusiness.companyNamePlaceholder' },
      { key: 'business_type',  crm: 'Business Formation Type',      labelKey: 'lead.stepBusiness.businessType', type: 'select', required: true, options: BUSINESS_TYPES },
      { key: 'company_title',  crm: 'Title of the Primary Contact', labelKey: 'lead.stepBusiness.companyTitle', type: 'select', required: true, options: COMPANY_TITLES },
      { key: 'company_trucks', crm: 'Truck Count',                  labelKey: 'lead.stepBusiness.trucks',       type: 'number', required: true, placeholder: '5' },
      { key: 'company_dot',    crm: 'DOT Number',                   labelKey: 'lead.stepBusiness.dot',          type: 'text',   required: false, placeholder: '1234567' },
      { key: 'company_mc',     crm: 'MC Number',                    labelKey: 'lead.stepBusiness.mc',           type: 'text',   required: false, placeholder: '123456' },
      { key: 'company_phone',  crm: 'Company Phone Number',         labelKey: 'portalDemo.fields.companyPhone', type: 'phone',  required: true, isNew: true },
      { key: 'company_email',  crm: 'Company Billing Email',        labelKey: 'portalDemo.fields.companyEmail', type: 'email',  required: true, isNew: true, placeholderKey: 'billingContact.placeholderEmail' },
      { key: 'discount_tier',  crm: 'Fuel Discount Tier Level',     labelKey: 'portalDemo.fields.discountTier', type: 'readonly' },
    ],
    noticeKey: 'lead.stepBusiness.dotMcHint',
  },

  {
    id: 'billing_address',
    titleKey: 'address.heading',
    blurbKey: 'address.subheading',
    fields: addressFields('company', 'Company Billing'),
  },

  {
    id: 'mailing',
    titleKey: 'mailingAddress.heading',
    blurbKey: 'mailingAddress.subheading',
    choice: {
      key: 'mailingAddressChoice',
      crm: 'mailingAddressChoice',
      default: 'same-as-company',
      revealOn: 'other',
      options: [
        ['same-as-company', 'address.radioSame'],
        ['other',           'address.radioDifferent'],
      ],
    },
    fields: addressFields('mailing', 'Mailing'),
  },

  {
    id: 'contact',
    titleKey: 'lead.step1.title',
    blurbKey: 'lead.step1.desc',
    fields: [
      { key: 'first_name',   crm: 'First Name',          labelKey: 'lead.step1.firstName', type: 'text',  required: true, placeholderKey: 'lead.step1.firstNamePlaceholder' },
      { key: 'last_name',    crm: 'Last Name',           labelKey: 'lead.step1.lastName',  type: 'text',  required: true, placeholderKey: 'lead.step1.lastNamePlaceholder' },
      { key: 'mobile_phone', crm: 'Mobile Phone Number', labelKey: 'lead.step1.phone',     type: 'phone', required: true },
    ],
  },

  {
    id: 'personal',
    titleKey: 'personalInfo.heading',
    blurbKey: 'personalInfo.subheading',
    fields: [
      { key: 'ssn',        crm: 'Full Social Security Number',       labelKey: 'personalInfo.labelSsn',       type: 'secret', required: true, digits: 9, format: 'ssn', placeholderKey: 'personalInfo.placeholderSsn' },
      { key: 'dl_number',  crm: 'Driver License',                    labelKey: 'personalInfo.labelDl',        type: 'secret', required: true, placeholderKey: 'personalInfo.placeholderDl' },
      { key: 'dl_confirm', crm: 'Driver License',                    labelKey: 'personalInfo.labelDlConfirm', type: 'secret', required: true, matches: 'dl_number', placeholderKey: 'personalInfo.placeholderDlConfirm' },
      { key: 'dl_file',    crm: 'Driver License Attached File Name', labelKey: 'personalInfo.labelDlFile',    type: 'file',   required: true, span: 2 },
    ],
    noticeKey: 'personalInfo.ownerNotice',
  },

  {
    id: 'home',
    titleKey: 'personalAddress.heading',
    blurbKey: 'personalAddress.subheading',
    choice: {
      key: 'personalAddressChoice',
      crm: 'personalAddressChoice',
      default: 'same-as-business',
      revealOn: 'other',
      options: [
        ['same-as-business', 'personalAddress.radioBusinessLabel'],
        ['same-as-mailing',  'personalAddress.radioMailingLabel'],
        ['other',            'personalAddress.radioNewLabel'],
      ],
    },
    fields: addressFields('home', 'Personal Home'),
  },

  {
    id: 'billing_contact',
    titleKey: 'billingContact.heading',
    blurbKey: 'billingContact.subheading',
    choice: {
      key: 'billingChoice',
      crm: 'billingChoice',
      default: 'self',
      revealOn: 'other',
      options: [
        ['self',  'billingContact.radioSelfLabel'],
        ['other', 'billingContact.radioOtherLabel'],
      ],
      hintKey: 'billingContact.radioSelfDesc',
    },
    fields: [
      { key: 'billing_first_name', crm: 'Billing Contact',              labelKey: 'billingContact.labelFirstName', type: 'text',  required: true,  placeholderKey: 'billingContact.placeholderFirstName' },
      { key: 'billing_last_name',  crm: 'Billing Contact',              labelKey: 'billingContact.labelLastName',  type: 'text',  required: true,  placeholderKey: 'billingContact.placeholderLastName' },
      { key: 'billing_email',      crm: 'Billing Contact',              labelKey: 'billingContact.labelEmail',     type: 'email', required: true,  placeholderKey: 'billingContact.placeholderEmail' },
      { key: 'billing_phone',      crm: 'Billing Contact',              labelKey: 'billingContact.labelPhone',     type: 'phone', required: true },
      { key: 'billing_title',      crm: 'Title of the Billing Contact', labelKey: 'billingContact.labelTitle',     type: 'text',  required: false, placeholderKey: 'billingContact.placeholderTitle' },
    ],
  },
]

// Reference only — not rendered, not asked of the customer. Kept because this
// file is the one place the CRM mapping is written down, and which records are
// derived rather than collected is part of that mapping.
export const DERIVED_FIELDS = [
  { crm: 'Full Name',           from: 'First Name + Last Name' },
  { crm: 'Full name',           from: 'duplicate of Full Name in the source list' },
  { crm: 'Company Identifier',  from: 'Company name' },
  { crm: 'Customer Identifier', from: 'Company name' },
  { crm: 'Customer ID',         from: 'our record id — never shown to the customer' },
]

export const CHOICE_GROUPS = GROUPS.filter((g) => g.choice)
export const ALL_FIELDS = GROUPS.flatMap((g) => g.fields)
