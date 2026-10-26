import pumppriceIcon from '@/assets/categories/pumpprice.png';
import onrampIcon from '@/assets/categories/onramp.png';
import { typographLocalized } from '@/lib/typography';
import type { Localized } from './schema';

export interface Category {
  id: string;
  name: Localized;
  /** Картинка или эмодзи перед названием. */
  icon: { image: string } | { emoji: string };
}

/** Порядок здесь = порядок кнопок фильтра на главной. */
export const categories = [
  {
    id: 'pumpprice',
    name: { ru: 'PumpPrice', en: 'PumpPrice' },
    icon: { image: pumppriceIcon },
  },
  {
    id: 'onramp',
    name: { ru: 'OnRamp Fleet Dashboard', en: 'OnRamp Fleet Dashboard' },
    icon: { image: onrampIcon },
  },
  {
    id: 'onramp-app',
    name: { ru: 'OnRamp Mobile App', en: 'OnRamp Mobile App' },
    icon: { image: onrampIcon },
  },
  {
    id: 'efs-cards',
    name: typographLocalized({ ru: 'Использование карт EFS', en: 'Using EFS Cards Tutorial' }),
    icon: { emoji: '💳' },
  },
  {
    id: 'tire-discount',
    name: typographLocalized({ ru: 'Программа скидок на шины', en: 'Tire Discount Program' }),
    icon: { emoji: '🚛' },
  },
] as const satisfies readonly Category[];

export type CategoryId = (typeof categories)[number]['id'];

export function getCategory(id: CategoryId): Category {
  const category = categories.find((c) => c.id === id);
  if (!category) throw new Error(`Unknown category: ${id}`);
  return category;
}

export function isCategoryId(value: string | null): value is CategoryId {
  return categories.some((c) => c.id === value);
}
