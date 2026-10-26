import type { ReactNode } from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  children: ReactNode;
  /** highlight — оранжевый бейдж для ограничений вроде «Только предоплата». */
  tone?: 'default' | 'highlight';
}

export function Badge({ children, tone = 'default' }: BadgeProps) {
  const className = [styles.badge, tone === 'highlight' && styles.highlight]
    .filter(Boolean)
    .join(' ');
  return <span className={className}>{children}</span>;
}
