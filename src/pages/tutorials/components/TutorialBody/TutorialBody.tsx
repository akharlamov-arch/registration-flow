import { AppDownloadButtons } from '@/components/AppDownloadButtons/AppDownloadButtons';
import { RichText } from '@/components/RichText/RichText';
import { ZoomableImage } from '@/components/ZoomableImage/ZoomableImage';
import type { Block, CalloutVariant, StepsBlock } from '@/content/schema';
import { useI18n } from '@/i18n/context';
import type { Messages } from '@/i18n/messages';
import { localize } from '@/lib/localize';
import { CalloutIcon } from './CalloutIcon';
import styles from './TutorialBody.module.css';

/** Где находится блок: от этого зависят отступы и цвета. */
type Placement = 'body' | 'step' | 'substep';

export function TutorialBody({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, index) => (
        <BlockView key={index} block={block} placement="body" />
      ))}
    </>
  );
}

function BlockView({ block, placement }: { block: Block; placement: Placement }) {
  const { lang } = useI18n();

  switch (block.type) {
    case 'text':
      return <RichText text={block.text[lang]} className={styles[`text-${placement}`]} />;
    case 'image': {
      const alt = block.alt?.[lang] ?? '';
      return (
        <ZoomableImage
          src={localize(block.src, lang)}
          alt={alt}
          className={[styles[`image-${placement}`], block.size && styles[`image-${block.size}`]]
            .filter(Boolean)
            .join(' ')}
        />
      );
    }
    case 'list':
      return (
        <section className={styles.list}>
          {block.title && <h3>{block.title[lang]}</h3>}
          <ol>
            {block.items.map((item, index) => (
              <li key={index}>
                <RichText text={item[lang]} />
              </li>
            ))}
          </ol>
        </section>
      );
    case 'checklist':
      return (
        <ul className={styles.checklist}>
          {block.items.map((item, index) => (
            <li key={index}>
              <svg className={styles.checkIcon} viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="10" fill="currentColor" />
                <path
                  d="M7.5 12.5l3 3 6-6.5"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <RichText text={item[lang]} />
            </li>
          ))}
        </ul>
      );
    case 'bullets':
      return (
        <ul className={styles.bullets}>
          {block.items.map((item, index) => (
            <li key={index}>
              <RichText text={item[lang]} />
            </li>
          ))}
        </ul>
      );
    case 'callout':
      return <Callout {...block} placement={placement} />;
    case 'appDownload':
      return <AppDownloadButtons />;
    case 'heading':
      return block.level === 3 ? (
        <h3 className={styles.subheading}>{block.text[lang]}</h3>
      ) : (
        <h2 className={styles.heading}>{block.text[lang]}</h2>
      );
    case 'steps':
      return <Steps block={block} />;
  }
}

const CALLOUT_LABELS: Partial<Record<CalloutVariant, keyof Messages>> = {
  solution: 'calloutSolution',
  tip: 'calloutTip',
  note: 'calloutNote',
};

interface CalloutProps {
  variant: CalloutVariant;
  text: Record<'ru' | 'en', string>;
  image?: string;
  placement: Placement;
}

function Callout({ variant, text, image, placement }: CalloutProps) {
  const { lang, t } = useI18n();
  const labelKey = CALLOUT_LABELS[variant];
  const className = [
    styles.callout,
    styles[`tone-${variant}`],
    styles[`callout-${placement}`],
    variant === 'info' && styles.calloutPlain,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <aside className={className}>
      {variant !== 'info' && <CalloutIcon variant={variant} className={styles.calloutIcon} />}
      <div className={styles.calloutContent}>
        {variant === 'conclusion' && <h3 className={styles.calloutLabel}>{t.calloutConclusion}</h3>}
        {labelKey && <strong className={styles.calloutLabel}>{t[labelKey]}</strong>}
        <RichText text={text[lang]} />
        {image && <ZoomableImage src={image} alt="" className={styles.calloutImage} />}
      </div>
    </aside>
  );
}

function Steps({ block }: { block: StepsBlock }) {
  const { lang, t } = useI18n();
  const secondary = block.variant === 'secondary';
  const title = block.title?.[lang] ?? (secondary ? undefined : t.stepsTitle);
  const placement: Placement = secondary ? 'substep' : 'step';
  const StepHeading = secondary ? 'h4' : 'h3';

  return (
    <section className={secondary ? styles.substepsSection : styles.stepsSection}>
      {title && <h2 className={styles.stepsTitle}>{title}</h2>}
      {block.description && (
        <RichText text={block.description[lang]} className={styles.stepsDescription} />
      )}
      <ol className={styles.steps}>
        {block.items.map((step, index) => (
          <li key={index} className={secondary ? styles.substep : styles.step}>
            <StepHeading className={styles.stepTitle}>
              <span className={styles.stepNumber}>{index + 1}</span>
              <span>{step.title[lang]}</span>
            </StepHeading>
            {step.blocks.map((child, childIndex) => (
              <BlockView key={childIndex} block={child} placement={placement} />
            ))}
          </li>
        ))}
      </ol>
    </section>
  );
}
