import type { Messages } from '@/i18n/messages';

/** Контакты, ссылки и прочие настройки сайта — меняются здесь, без правки компонентов. */
export const site = {
  url: 'https://tutorial.itrucking.pro',
  portalUrl: 'https://itrucking.pro/',
  companyUrl: 'https://www.itruckingservices.com',
  privacyUrl: 'https://itrucking.pro/legal/privacy',
  termsUrl: 'https://itrucking.pro/legal/terms',

  appStoreUrl: 'https://apps.apple.com/us/app/pumpprice/id1670283070',
  googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.fuelanalytics.bakerstreet',

  phones: [
    { label: 'footerMainPhone', display: '+1 (916) 269-4606', href: 'tel:+19162694606' },
    {
      label: 'footerAccountingPhone',
      display: '+1 (916) 269-4606 ext. 3',
      href: 'tel:+19162694606,3',
    },
    { label: 'footerTirePhone', display: '+1 (916) 234-0257', href: 'tel:+19162340257' },
  ],
  emails: [
    { label: 'footerGeneral', address: 'info@itruckingservices.com' },
    { label: 'footerFuel', address: 'fuel@itrucking.org' },
    { label: 'footerAccounting', address: 'accounting@itrucking.org' },
  ],
  addressLines: ['1229 Pleasant Grove Blvd', 'Roseville, CA 95678'],
  social: {
    instagram: 'https://www.instagram.com/itrucking.inc/',
    facebook: 'https://www.facebook.com/itruckingservicesinc/',
  },
} as const satisfies {
  phones: readonly { label: keyof Messages; display: string; href: string }[];
  emails: readonly { label: keyof Messages; address: string }[];
  [key: string]: unknown;
};
