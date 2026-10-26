import { categories, type Category, type CategoryId } from '@/content/categories';
import { useI18n } from '@/i18n/context';
import styles from './CategoryFilter.module.css';

interface CategoryFilterProps {
  value: CategoryId | 'all';
  onChange: (value: CategoryId | 'all') => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const { lang, t } = useI18n();

  const button = (id: CategoryId | 'all', label: string, category?: Category) => (
    <button
      key={id}
      type="button"
      className={id === value ? `${styles.button} ${styles.active}` : styles.button}
      aria-pressed={id === value}
      onClick={() => onChange(id)}
    >
      {category && 'image' in category.icon && (
        <img src={category.icon.image} alt="" className={styles.icon} />
      )}
      {category && 'emoji' in category.icon && (
        <span aria-hidden="true">{category.icon.emoji}</span>
      )}
      <span>{label}</span>
    </button>
  );

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{t.categoriesTitle}</h2>
      <div className={styles.categories}>
        {button('all', t.categoryAll)}
        {categories.map((category) => button(category.id, category.name[lang], category))}
      </div>
    </section>
  );
}
