import { useEffect, useRef, useState } from 'react';
import { categories, type Category, type CategoryId } from '@/content/categories';
import { useI18n } from '@/i18n/context';
import styles from './CategoryFilter.module.css';

interface CategoryFilterProps {
  value: CategoryId | 'all';
  onChange: (value: CategoryId | 'all') => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const { lang, t } = useI18n();
  // registration-flow: на мобильных вместо ряда кнопок — выпадающий список (см. .dropdown в CSS).
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const content = (label: string, category?: Category) => (
    <>
      {category && 'image' in category.icon && (
        <img src={category.icon.image} alt="" className={styles.icon} />
      )}
      {category && 'emoji' in category.icon && (
        <span aria-hidden="true">{category.icon.emoji}</span>
      )}
      <span>{label}</span>
    </>
  );

  const button = (id: CategoryId | 'all', label: string, category?: Category) => (
    <button
      key={id}
      type="button"
      className={id === value ? `${styles.button} ${styles.active}` : styles.button}
      aria-pressed={id === value}
      onClick={() => onChange(id)}
    >
      {content(label, category)}
    </button>
  );

  const option = (id: CategoryId | 'all', label: string, category?: Category) => (
    <li key={id} role="option" aria-selected={id === value}>
      <button
        type="button"
        className={id === value ? `${styles.option} ${styles.optionActive}` : styles.option}
        onClick={() => {
          onChange(id);
          setOpen(false);
        }}
      >
        {content(label, category)}
      </button>
    </li>
  );

  const selected = categories.find((category) => category.id === value);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{t.categoriesTitle}</h2>
      <div className={styles.categories}>
        {button('all', t.categoryAll)}
        {categories.map((category) => button(category.id, category.name[lang], category))}
      </div>
      <div className={styles.dropdown} ref={dropdownRef}>
        <button
          type="button"
          className={open ? `${styles.trigger} ${styles.triggerOpen}` : styles.trigger}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className={styles.triggerLabel}>
            {selected ? content(selected.name[lang], selected) : content(t.categoryAll)}
          </span>
          <span className={styles.chevron} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </button>
        {open && (
          <ul className={styles.menu} role="listbox" aria-label={t.categoriesTitle}>
            {option('all', t.categoryAll)}
            {categories.map((category) => option(category.id, category.name[lang], category))}
          </ul>
        )}
      </div>
    </section>
  );
}
