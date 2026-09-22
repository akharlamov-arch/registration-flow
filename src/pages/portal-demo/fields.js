// Field map for the updated-contract step of the customer portal.
//
// Every label, placeholder, option value and required/optional flag below is
// copied from the registration flow so the two ask for the same thing in the
// same words. Sources:
//   labels/placeholders  src/data/translations.js — lead.step1, lead.stepBusiness,
//                        address, personalInfo, personalAddress, billingContact,
//                        portalStrings.dashboard.labelTier
//   select options       src/pages/LeadForm.jsx:894-897 (businessType)
//                        src/pages/LeadForm.jsx:915-920 (companyTitle)
//   state shape          src/pages/OtpVerification.jsx:157-176
//   choice values        prompts/LEAD_API_CONTRACT.md + src/api/leadMappers.js
//
// `crm` is the record name on our side. Fields carrying a crm name with no
// counterpart in registration (company phone, billing email) are the ones the
// updated contract adds — they are marked `isNew`.

// src/pages/LeadForm.jsx:894-897 — these four, no others.
export const BUSINESS_TYPES = [
  ['sole',        'Sole Proprietorship'],
  ['partnership', 'Partnership'],
  ['llc',         'LLC'],
  ['corporation', 'Corporation'],
]

// src/pages/LeadForm.jsx:915-920
export const COMPANY_TITLES = [
  ['ceo',        'CEO'],
  ['cfo',        'CFO'],
  ['accountant', 'Accountant'],
  ['president',  'President'],
  ['owner',      'Owner'],
  ['other',      'Other'],
]

// Reused by every address block so the three stay identical, as they are in
// registration (addressForm / mailingForm / personalAddressForm all carry
// street1, street2, city, state, zip).
function addressFields(prefix, crmPrefix) {
  return [
    { key: `${prefix}_street1`, crm: `${crmPrefix} Street Address`, label: 'Street Address 1', type: 'text',  required: true,  span: 2, placeholder: '123 Main St' },
    { key: `${prefix}_street2`, crm: `${crmPrefix} apt, Unit`,      label: 'Street Address 2', type: 'text',  required: false, span: 2, placeholder: 'Suite 200 (optional)' },
    { key: `${prefix}_city`,    crm: `${crmPrefix} City`,           label: 'City',             type: 'text',  required: true,  placeholder: 'Sacramento' },
    { key: `${prefix}_state`,   crm: `${crmPrefix} State`,          label: 'State',            type: 'state', required: true },
    { key: `${prefix}_zip`,     crm: `${crmPrefix} ZIP`,            label: 'ZIP Code',         type: 'zip',   required: true,  placeholder: '95814' },
  ]
}

export const GROUPS = [
  {
    id: 'business',
    title: 'Business Details',
    blurb: 'Tell us a bit more about your company so we can set up your account correctly.',
    fields: [
      { key: 'company_name',   crm: 'Company name',             label: 'Company Name',                type: 'text',   required: true, placeholder: 'Acme Trucking LLC' },
      { key: 'business_type',  crm: 'Business Formation Type',  label: 'Business Type',               type: 'select', required: true, options: BUSINESS_TYPES },
      { key: 'company_title',  crm: 'Title of the Primary Contact', label: 'Your Title',              type: 'select', required: true, options: COMPANY_TITLES },
      { key: 'company_trucks', crm: 'Truck Count',              label: 'How many trucks do you have?', type: 'number', required: true, placeholder: '5' },
      { key: 'company_dot',    crm: 'DOT Number',               label: 'Company DOT',                 type: 'text',   required: false, placeholder: '1234567' },
      { key: 'company_mc',     crm: 'MC Number',                label: 'Company MC',                  type: 'text',   required: false, placeholder: '123456' },
      { key: 'company_phone',  crm: 'Company Phone Number',     label: 'Company Phone Number',        type: 'phone',  required: true, isNew: true },
      { key: 'company_email',  crm: 'Company Billing Email',    label: 'Company Billing Email',       type: 'email',  required: true, isNew: true, placeholder: 'billing@company.com' },
      { key: 'discount_tier',  crm: 'Fuel Discount Tier Level', label: 'Discount tier',               type: 'readonly' },
    ],
    // translations.js lead.stepBusiness.dotMcHint
    notice: "If you have a DOT or MC number, enter it below. If not — just skip this field, it's optional.",
  },

  {
    id: 'billing_address',
    title: 'Billing Address',
    blurb: 'Enter your business or personal address. This information will be used for account setup and correspondence.',
    fields: addressFields('company', 'Company Billing'),
  },

  {
    id: 'mailing',
    title: 'Mailing Address',
    blurb: 'Enter the address where you would like to receive mail and official correspondence.',
    // translations.js address.radioSame / address.radioDifferent
    choice: {
      key: 'mailingAddressChoice',
      crm: 'mailingAddressChoice',
      default: 'same-as-company',
      revealOn: 'other',
      options: [
        ['same-as-company', 'Use this address for all mail deliveries'],
        ['other',           'I want to provide a different mailing address'],
      ],
    },
    fields: addressFields('mailing', 'Mailing'),
  },

  {
    id: 'contact',
    title: 'Contact Information',
    blurb: 'Please provide your basic contact details.',
    fields: [
      { key: 'first_name',   crm: 'First Name',          label: 'First Name',          type: 'text',  required: true, placeholder: 'John' },
      { key: 'last_name',    crm: 'Last Name',           label: 'Last Name',           type: 'text',  required: true, placeholder: 'McDavid' },
      { key: 'mobile_phone', crm: 'Mobile Phone Number', label: 'Phone Number',        type: 'phone', required: true },
    ],
  },

  {
    id: 'personal',
    title: 'Personal Information & Guarantee',
    blurb: 'Required by our bank partner for identity verification. Your data is securely stored, kept confidential, and protected under privacy regulations.',
    fields: [
      { key: 'ssn',        crm: 'Full Social Security Number',       label: 'Social Security Number',        type: 'secret', required: true, digits: 9, format: 'ssn', placeholder: '•••••••••' },
      { key: 'dl_number',  crm: 'Driver License',                    label: 'Driver License Number',         type: 'secret', required: true, placeholder: 'Enter your DL number' },
      { key: 'dl_confirm', crm: 'Driver License',                    label: 'Re-enter Driver License Number', type: 'secret', required: true, matches: 'dl_number', placeholder: 'Re-enter your DL number' },
      { key: 'dl_file',    crm: 'Driver License Attached File Name', label: 'Driver License (photo or scan)', type: 'file',  required: true, span: 2,
        hint: 'JPG, PNG, HEIC, PDF, DOC — max 10 MB' },
    ],
    // translations.js personalInfo.ownerNotice
    notice: 'The information on the driver license must match the business owner, account holder, and contract signatory.',
  },

  {
    id: 'home',
    title: 'Personal Address',
    blurb: 'Your personal home address may differ from your business or mailing address. Please select or enter the address on file with your ID.',
    // translations.js personalAddress.radio* — three options, not two.
    choice: {
      key: 'personalAddressChoice',
      crm: 'personalAddressChoice',
      default: 'same-as-business',
      revealOn: 'other',
      options: [
        ['same-as-business', 'Same as business address'],
        ['same-as-mailing',  'Same as mailing address'],
        ['other',            'Enter a different home address'],
      ],
    },
    fields: addressFields('home', 'Personal Home'),
  },

  {
    id: 'billing_contact',
    title: 'Who will be responsible for billing?',
    blurb: 'This contact will receive invoices and payment notifications from iTrucking.',
    choice: {
      key: 'billingChoice',
      crm: 'billingChoice',
      default: 'self',
      revealOn: 'other',
      options: [
        ['self',  'I am the billing contact'],
        ['other', 'Someone else in my company'],
      ],
      // translations.js billingContact.radioSelfDesc
      hint: 'We will use your email for invoices and billing notifications. Please make sure it is correct and accessible.',
    },
    fields: [
      { key: 'billing_first_name', crm: 'Billing Contact',                 label: 'First Name',    type: 'text',  required: true,  placeholder: 'Jane' },
      { key: 'billing_last_name',  crm: 'Billing Contact',                 label: 'Last Name',     type: 'text',  required: true,  placeholder: 'Smith' },
      { key: 'billing_email',      crm: 'Billing Contact',                 label: 'Email Address', type: 'email', required: true,  placeholder: 'billing@company.com' },
      { key: 'billing_phone',      crm: 'Billing Contact',                 label: 'Phone Number',  type: 'phone', required: true },
      { key: 'billing_title',      crm: 'Title of the Billing Contact',    label: 'Job Title',     type: 'text',  required: false, placeholder: 'Accountant (optional)' },
    ],
  },
]

// Reference only — not rendered, not asked of the customer. Kept because this
// file is the one place the CRM mapping is written down, and which records are
// derived rather than collected is part of that mapping.
export const DERIVED_FIELDS = [
  { crm: 'Full Name',    from: 'First Name + Last Name' },
  { crm: 'Full name',    from: 'duplicate of Full Name in the source list' },
  { crm: 'Company Identifier',  from: 'Company name' },
  { crm: 'Customer Identifier', from: 'Company name' },
  { crm: 'Customer ID',  from: 'our record id — never shown to the customer' },
]

export const CHOICE_GROUPS = GROUPS.filter((g) => g.choice)
export const ALL_FIELDS = GROUPS.flatMap((g) => g.fields)
