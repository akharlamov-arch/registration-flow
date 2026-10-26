import { Link } from 'react-router-dom';
import { useTutorialLink } from '@/app/navigation';
import { Badge } from '@/components/Badge/Badge';
import { getCategory } from '@/content/categories';
import type { Tutorial } from '@/content/schema';
import { useI18n } from '@/i18n/context';
import { localize } from '@/lib/localize';
import { pluralizeSteps } from '@/lib/plural';
import styles from './TutorialCard.module.css';

// Фон карточки без обложки. Выбирается по slug, чтобы не менялся при каждом рендере.
const GRADIENTS = [
  '#667eea 0%, #764ba2 100%',
  '#f093fb 0%, #f5576c 100%',
  '#4facfe 0%, #00f2fe 100%',
  '#43e97b 0%, #38f9d7 100%',
  '#fa709a 0%, #fee140 100%',
  '#30cfd0 0%, #330867 100%',
];

function gradientFor(slug: string): string {
  const hash = [...slug].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return `linear-gradient(135deg, ${GRADIENTS[hash % GRADIENTS.length]})`;
}

export function TutorialCard({ tutorial }: { tutorial: Tutorial }) {
  const { lang, t } = useI18n();
  const title = tutorial.title[lang];

  return (
    <Link {...useTutorialLink(tutorial.slug)} className={styles.card}>
      {tutorial.cover ? (
        <div className={styles.imageWrapper}>
          <img src={localize(tutorial.cover, lang)} alt={title} className={styles.image} />
        </div>
      ) : (
        <div className={styles.placeholder} style={{ background: gradientFor(tutorial.slug) }}>
          {tutorial.icon}
        </div>
      )}
      <div className={styles.content}>
        <div className={styles.meta}>
          <Badge>{getCategory(tutorial.category).name[lang]}</Badge>
          {tutorial.badges?.map((badge) => (
            <Badge key={badge.en} tone="highlight">
              {badge[lang]}
            </Badge>
          ))}
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{tutorial.description[lang]}</p>
        <div className={styles.stats}>
          <span>
            📖 {tutorial.readTime} {t.readTime}
          </span>
          {tutorial.stepsCount > 0 && (
            <span>
              ✓ {tutorial.stepsCount} {pluralizeSteps(tutorial.stepsCount, lang, t)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
