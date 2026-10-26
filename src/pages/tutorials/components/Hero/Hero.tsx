import { useI18n } from '@/i18n/context';
import styles from './Hero.module.css';

const BRAND = 'iTrucking';

export function Hero() {
  const { t } = useI18n();
  const [before, after] = t.heroTitle.split('{brand}');

  return (
    <section className={styles.hero}>
      <h1>
        {before}
        <span className={styles.brand}>{BRAND}</span>
        {after}
      </h1>
      <p>{t.heroSubtitle}</p>
    </section>
  );
}
