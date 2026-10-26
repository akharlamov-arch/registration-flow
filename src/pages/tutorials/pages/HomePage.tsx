import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { CategoryFilter } from '@/components/CategoryFilter/CategoryFilter';
import { Footer } from '@/components/Footer/Footer';
import { Hero } from '@/components/Hero/Hero';
import { TutorialGrid } from '@/components/TutorialGrid/TutorialGrid';
import { tutorials } from '@/content';
import { isCategoryId, type CategoryId } from '@/content/categories';
import { useI18n } from '@/i18n/context';
import styles from './HomePage.module.css';

/**
 * Главная: список туториалов. Открытый туториал рендерится поверх через <Outlet />.
 * Шапку рисует app/App.tsx (общий Header приложения).
 */
export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get('category');
  const category: CategoryId | 'all' = isCategoryId(categoryParam) ? categoryParam : 'all';
  const setCategory = (value: CategoryId | 'all') =>
    setSearchParams(value === 'all' ? {} : { category: value });

  const visible =
    category === 'all' ? tutorials : tutorials.filter((tutorial) => tutorial.category === category);

  return (
    <>
      <main>
        <Hero />
        <BackToPortal />
        <CategoryFilter value={category} onChange={setCategory} />
        <TutorialGrid tutorials={visible} />
      </main>
      <Footer />
      <Outlet />
    </>
  );
}

/** Только в registration-flow: возврат в клиентский портал (#/attention). */
function BackToPortal() {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <div className={styles.backRow}>
      <button type="button" className={styles.back} onClick={() => navigate('/attention')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        <span>{t.backToPortal}</span>
      </button>
    </div>
  );
}
