import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useI18n } from '@/i18n/context';
import { useModalDialog } from '@/hooks/useModalDialog';
import { LightboxContext } from './context';
import styles from './Lightbox.module.css';

interface Image {
  src: string;
  alt: string;
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [image, setImage] = useState<Image | null>(null);
  const openImage = useCallback((src: string, alt: string) => setImage({ src, alt }), []);
  const value = useMemo(() => ({ openImage }), [openImage]);

  return (
    <LightboxContext.Provider value={value}>
      {children}
      {image && <Lightbox image={image} onClose={() => setImage(null)} />}
    </LightboxContext.Provider>
  );
}

function Lightbox({ image, onClose }: { image: Image; onClose: () => void }) {
  const { t } = useI18n();
  const dialog = useModalDialog(onClose);

  return (
    <dialog {...dialog} className={styles.lightbox} aria-label={image.alt || t.zoomImage}>
      <button type="button" className={styles.close} onClick={onClose} aria-label={t.close}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <img src={image.src} alt={image.alt} className={styles.image} />
    </dialog>
  );
}
