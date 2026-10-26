import { useState } from 'react';
import { useModalDialog } from '@/hooks/useModalDialog';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { useI18n } from '@/i18n/context';
// Кнопка стоит в общем Header приложения (его `extra`), поэтому и выглядит как его кнопки.
import { headerIconBtnCls } from '../../../../components/Header';
import styles from './InstallButton.module.css';

type InstructionsPlatform = 'ios' | 'android';

export function InstallButton() {
  const { t } = useI18n();
  const { platform, canInstall, promptInstall } = useInstallPrompt();
  const [instructions, setInstructions] = useState<InstructionsPlatform | null>(null);

  if (!canInstall) return null;

  const handleClick = async () => {
    if (await promptInstall()) return;
    setInstructions(platform === 'ios' ? 'ios' : 'android');
  };

  return (
    <>
      <button
        type="button"
        className={headerIconBtnCls}
        onClick={handleClick}
        title={t.installApp}
        aria-label={t.installApp}
      >
        📱
      </button>
      {instructions && (
        <InstallInstructions platform={instructions} onClose={() => setInstructions(null)} />
      )}
    </>
  );
}

function InstallInstructions({
  platform,
  onClose,
}: {
  platform: InstructionsPlatform;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const dialog = useModalDialog(onClose);

  const steps =
    platform === 'ios'
      ? [
          <>
            {t.iosInstallStep1} <span className={styles.icon}>⋯</span> {t.iosInstallStep1Desc}
          </>,
          <>
            {t.iosInstallStep2} <strong>"{t.iosInstallStep2Desc}"</strong>
          </>,
          <>
            {t.iosInstallStep3} {t.iosInstallStep3Desc}
          </>,
        ]
      : [
          <>
            {t.androidInstallStep1} <span className={styles.icon}>⋮</span>{' '}
            {t.androidInstallStep1Desc}
          </>,
          <>
            {t.androidInstallStep2} <strong>"{t.androidInstallStep2Desc}"</strong>
          </>,
        ];

  return (
    <dialog {...dialog} className={styles.dialog} aria-labelledby="install-title">
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 id="install-title">
            {platform === 'ios' ? t.iosInstallTitle : t.androidInstallTitle}
          </h3>
          <button type="button" className={styles.close} onClick={onClose} aria-label={t.close}>
            ×
          </button>
        </div>
        <ol className={styles.steps}>
          {steps.map((step, index) => (
            <li key={index} className={styles.step}>
              <span className={styles.number}>{index + 1}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </dialog>
  );
}
