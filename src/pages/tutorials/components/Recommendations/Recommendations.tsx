import { Link } from 'react-router-dom';
import { useTutorialLink } from '@/app/navigation';
import { tutorials } from '@/content';
import type { Tutorial } from '@/content/schema';
import { useI18n } from '@/i18n/context';
import { getRecommendations } from '@/lib/recommendations';
import styles from './Recommendations.module.css';

export function Recommendations({ tutorial }: { tutorial: Tutorial }) {
  const { t } = useI18n();
  const recommended = getRecommendations(tutorial, tutorials);
  if (recommended.length === 0) return null;

  return (
    <nav className={styles.recommendations} aria-labelledby="recommendations-title">
      <h3 id="recommendations-title">{t.recommendationsTitle}</h3>
      <div className={styles.links}>
        {recommended.map((rec) => (
          <RecommendationLink key={rec.slug} tutorial={rec} />
        ))}
      </div>
    </nav>
  );
}

function RecommendationLink({ tutorial }: { tutorial: Tutorial }) {
  const { lang } = useI18n();
  return (
    <Link {...useTutorialLink(tutorial.slug)} className={styles.link}>
      → {tutorial.title[lang]}
    </Link>
  );
}
