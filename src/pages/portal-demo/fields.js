// Field map for the updated-contract step of the customer portal.
//
// `crm` is the record name as it is stored on our side; `label` is the plainer
// wording the customer sees. Keeping both in one table means the form, the
// validation and the "show CRM names" overlay all read from a single source,
// and backend devs can see the mapping without reading JSX.
//
// The address / contact / personal shapes mirror prompts/LEAD_API_CONTRACT.md:
//   companyAddress{line1,line2,city,state,zip}
//   mailingAddressChoice "same-as-company | custom" + mailingAddress{...}
//   personalAddressChoice "same-as-business | custom" + personalAddress{...}
//   billingContact{name,role,email}, personal{ssn,driverLicenseNumber}
// Fields with no counterpart there (formation type, truck count, DOT/MC,
// phones, identifiers) are the ones the updated contract adds.

export const FORMATION_TYPES = [
  'LLC',
  'INC',
  'Corporation',
  'S-Corporation',
  'Sole Proprietorship',
  'Partnership',
  'LLP',
]

// Groups render in this order. `sameAs` turns the group into a checkbox-gated
// block: ticked means "copy the source group", unticked reveals the inputs.
export const GROUPS = [
  {
    id: 'company',
    title: 'Company',
    blurb: 'How your business is registered and how we reach it.',
    fields: [
      { key: 'company_name',   crm: 'Company name',            label: 'Company name',           type: 'text',   required: true },
      { key: 'formation_type', crm: 'Business Formation Type', label: 'Business formation type', type: 'select', required: true, options: FORMATION_TYPES },
      { key: 'company_phone',  crm: 'Company Phone Number',    label: 'Company phone number',   type: 'phone',  required: true },
      { key: 'company_email',  crm: 'Company Billing Email',   label: 'Company billing email',  type: 'email',  required: true },
      { key: 'truck_count',    crm: 'Truck Count',             label: 'Number of trucks',       type: 'number', required: true },
      { key: 'dot_number',     crm: 'DOT Number',              label: 'DOT number',             type: 'text',   required: false },
      { key: 'mc_number',      crm: 'MC Number',               label: 'MC number',              type: 'text',   required: false },
      { key: 'fuel_tier',      crm: 'Fuel Discount Tier Level', label: 'Fuel discount tier',    type: 'readonly',
        hint: 'Set by iTrucking — shown for your reference.' },
    ],
  },
  {
    id: 'company_address',
    title: 'Company billing address',
    blurb: 'The registered address on the contract.',
    fields: [
      { key: 'company_line1', crm: 'Company Billing Address', label: 'Street address', type: 'text',  required: true, span: 2 },
      { key: 'company_city',  crm: 'City',                    label: 'City',           type: 'text',  required: true },
      { key: 'company_state', crm: 'State',                   label: 'State',          type: 'state', required: true },
      { key: 'company_zip',   crm: 'ZIP',                     label: 'ZIP',            type: 'zip',   required: true },
    ],
  },
  {
    id: 'mailing',
    title: 'Mailing address',
    blurb: 'Where we send physical mail.',
    // Mirrors mailingAddressChoice: "same-as-company | custom".
    sameAs: { label: 'Same as company billing address', source: 'company_address', crm: 'mailingAddressChoice' },
    fields: [
      { key: 'mailing_line1', crm: 'Mailing Street Address', label: 'Street address', type: 'text',  required: true, span: 2 },
      { key: 'mailing_line2', crm: 'Mailing apt, Unit',      label: 'Apt, unit',      type: 'text',  required: false, span: 2 },
      { key: 'mailing_city',  crm: 'Mailing City',           label: 'City',           type: 'text',  required: true },
      { key: 'mailing_state', crm: 'Mailing State',          label: 'State',          type: 'state', required: true },
      { key: 'mailing_zip',   crm: 'Mailing ZIP',            label: 'ZIP',            type: 'zip',   required: true },
    ],
  },
  {
    id: 'contact',
    title: 'Primary contact',
    blurb: 'The company owner completing this form.',
    fields: [
      { key: 'first_name',   crm: 'First Name',                    label: 'First name',   type: 'text',  required: true },
      { key: 'last_name',    crm: 'Last Name',                     label: 'Last name',    type: 'text',  required: true },
      { key: 'contact_role', crm: 'Title of the Primary Contact',  label: 'Job title',    type: 'text',  required: true },
      { key: 'mobile_phone', crm: 'Mobile Phone Number',           label: 'Mobile phone', type: 'phone', required: true },
    ],
  },
  {
    id: 'personal',
    title: 'Personal information',
    blurb: 'Required by the lender. Stored encrypted; shown back to you masked.',
    fields: [
      { key: 'ssn',            crm: 'Full Social Security Number', label: 'Social Security Number', type: 'secret', required: true, digits: 9, format: 'ssn' },
      { key: 'driver_license', crm: 'Driver License',              label: 'Driver license number',  type: 'secret', required: true },
      { key: 'dl_file',        crm: 'Driver License Attached File Name', label: 'Driver license scan', type: 'file', required: true,
        hint: 'PDF, PNG or JPG.' },
    ],
  },
  {
    id: 'home',
    title: 'Personal home address',
    blurb: '',
    // Mirrors personalAddressChoice: "same-as-business | custom".
    sameAs: { label: 'My home address is the same as my company address', source: 'company_address', crm: 'personalAddressChoice' },
    fields: [
      { key: 'home_line1', crm: 'Personal Home Street Address', label: 'Street address', type: 'text',  required: true, span: 2 },
      { key: 'home_city',  crm: 'Personal Home City',           label: 'City',           type: 'text',  required: true },
      { key: 'home_state', crm: 'Personal Home State',          label: 'State',          type: 'state', required: true },
      { key: 'home_zip',   crm: 'Personal Home ZIP',            label: 'ZIP',            type: 'zip',   required: true },
    ],
  },
]

// Reference only — not rendered anywhere, and not asked of the customer.
// Kept because this file is the one place the CRM mapping is written down, and
// which records are derived rather than collected is part of that mapping.
export const DERIVED_FIELDS = [
  { crm: 'Full Name',                  from: 'First Name + Last Name' },
  { crm: 'Full name',                  from: 'duplicate of Full Name in the source list' },
  { crm: 'Title of the Billing Contact', from: 'First Name + Last Name' },
  { crm: 'Billing Contact',            from: 'the primary contact — always the company owner' },
  { crm: 'Company Identifier',         from: 'Company name' },
  { crm: 'Customer Identifier',        from: 'Company name' },
  { crm: 'Driver License Attached File Name', from: 'the uploaded file, renamed on storage' },
  { crm: 'Customer ID',                from: 'our record id — never shown to the customer' },
]

export const ALL_FIELDS = GROUPS.flatMap((g) => g.fields)

export function fieldByKey(key) {
  return ALL_FIELDS.find((f) => f.key === key)
}
