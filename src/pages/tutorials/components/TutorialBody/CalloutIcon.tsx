import type { ReactNode } from 'react';
import type { CalloutVariant } from '@/content/schema';

// Иконки выделенных блоков: одна сетка 24×24, обводка 2px, скруглённые концы.
const PATHS: Record<Exclude<CalloutVariant, 'info'>, ReactNode> = {
  solution: (
    <>
      <path d="M12 3l7 3v5c0 4.4-2.9 8.2-7 10-4.1-1.8-7-5.6-7-10V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  tip: (
    <>
      <path d="M12 3.5l1.8 5.2 5.2 1.8-5.2 1.8L12 17.5l-1.8-5.2L5 10.5l5.2-1.8z" />
      <path d="M19 16v4M17 18h4" />
    </>
  ),
  note: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  hint: (
    <>
      <path d="M9.5 18h5M10.5 21h3" />
      <path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z" />
    </>
  ),
  warning: (
    <>
      <path d="M10.3 4.2L2.8 17.5A2 2 0 0 0 4.5 20.5h15a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z" />
      <path d="M12 9.5v4M12 17h.01" />
    </>
  ),
  conclusion: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.7 2.7L16 9.8" />
    </>
  ),
};

interface CalloutIconProps {
  variant: Exclude<CalloutVariant, 'info'>;
  className?: string;
}

export function CalloutIcon({ variant, className }: CalloutIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[variant]}
    </svg>
  );
}
