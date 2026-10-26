import { TutorialCard } from '@/components/TutorialCard/TutorialCard';
import type { Tutorial } from '@/content/schema';
import { useI18n } from '@/i18n/context';
import styles from './TutorialGrid.module.css';

export function TutorialGrid({ tutorials }: { tutorials: Tutorial[] }) {
  const { t } = useI18n();

  return (
    <section className={styles.section}>
      {tutorials.length > 0 ? (
        <div className={styles.grid}>
          {tutorials.map((tutorial) => (
            <TutorialCard key={tutorial.slug} tutorial={tutorial} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <h3>{t.noResults}</h3>
          <p>{t.noResultsText}</p>
        </div>
      )}
    </section>
  );
}
