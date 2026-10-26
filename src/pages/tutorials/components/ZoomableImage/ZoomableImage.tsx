import { useI18n } from '@/i18n/context';
import { useLightbox } from '@/components/Lightbox/context';
import styles from './ZoomableImage.module.css';

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
}

/** Картинка, которая по клику открывается на весь экран. */
export function ZoomableImage({ src, alt, className }: ZoomableImageProps) {
  const { t } = useI18n();
  const { openImage } = useLightbox();
  return (
    <button
      type="button"
      className={[styles.button, className].filter(Boolean).join(' ')}
      onClick={() => openImage(src, alt)}
      aria-label={alt ? `${t.zoomImage}: ${alt}` : t.zoomImage}
    >
      <img src={src} alt={alt} className={styles.image} loading="lazy" />
    </button>
  );
}
