import { useEffect } from 'react';
import { Badge } from '@/components/Badge/Badge';
import { Recommendations } from '@/components/Recommendations/Recommendations';
import { TutorialBody } from '@/components/TutorialBody/TutorialBody';
import { ZoomableImage } from '@/components/ZoomableImage/ZoomableImage';
import { getCategory } from '@/content/categories';
import type { Tutorial } from '@/content/schema';
import { useModalDialog } from '@/hooks/useModalDialog';
import { useI18n } from '@/i18n/context';
import { localize } from '@/lib/localize';
import styles from './TutorialModal.module.css';

interface TutorialModalProps {
  tutorial: Tutorial;
  onClose: () => void;
}

export function TutorialModal({ tutorial, onClose }: TutorialModalProps) {
  const { lang, t } = useI18n();
  const dialog = useModalDialog(onClose);
  const title = tutorial.title[lang];

  // При переходе по ссылке на другой туториал окно остаётся тем же — прокручиваем его наверх.
  useEffect(() => {
    dialog.ref.current?.scrollTo?.({ top: 0 });
  }, [dialog.ref, tutorial.slug]);

  return (
    <dialog {...dialog} className={styles.dialog} aria-labelledby="tutorial-title">
      {/* Фокус ставим на само окно, а не на кнопку ×, чтобы не было рамки фокуса при открытии. */}
      <article className={styles.content} tabIndex={-1} autoFocus>
        <header className={styles.header}>
          <div>
            <h2 id="tutorial-title" className={styles.title}>
              {title}
            </h2>
            <div className={styles.meta}>
              <Badge>{getCategory(tutorial.category).name[lang]}</Badge>
              {tutorial.badges?.map((badge) => (
                <Badge key={badge.en} tone="highlight">
                  {badge[lang]}
                </Badge>
              ))}
            </div>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label={t.close}>
            ×
          </button>
        </header>
        <div className={styles.body}>
          {tutorial.cover && (
            <ZoomableImage
              src={localize(tutorial.cover, lang)}
              alt={title}
              className={styles.cover}
            />
          )}
          <TutorialBody blocks={tutorial.body} />
          <Recommendations tutorial={tutorial} />
        </div>
      </article>
    </dialog>
  );
}
