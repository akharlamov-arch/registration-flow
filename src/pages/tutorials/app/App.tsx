import { useEffect } from 'react';
import { Navigate, Route, Routes, useSearchParams } from 'react-router-dom';
import Header from '../../../components/Header';
import { useTheme } from '../../../context/ThemeContext';
import { tutorialPath } from '@/app/navigation';
import { InstallButton } from '@/components/InstallButton/InstallButton';
import { LightboxProvider } from '@/components/Lightbox/LightboxProvider';
import { useTutorialsHead } from '@/hooks/useTutorialsHead';
import { LanguageProvider, usePageLanguage } from '@/i18n/LanguageProvider';
import { HomePage } from '@/pages/HomePage';
import { TutorialRoute } from '@/pages/TutorialRoute';
import '@/styles/global.css';

/*
 * Точка входа туториалов внутри registration-flow (маршрут #/tutorials/* в src/App.jsx).
 * В отличие от оригинала: HashRouter приложения вместо своего BrowserRouter, общий Header
 * и тема приложения вместо своих, язык — из общего I18nContext (см. i18n/LanguageProvider.tsx).
 */

/** Старые ссылки `#/tutorials?article=<id>` (до перехода на slug'и) — id прежнего content.js. */
const LEGACY_ARTICLE_SLUGS: Record<string, string> = {
  1: 'efs-card-block',
  2: 'install-app',
  3: 'ifta-report',
  4: 'transaction-report',
  5: 'manage-users',
  6: 'assign-cards',
  7: 'unit-pin',
  8: 'tire-discount-register',
  9: 'tire-discount-use',
};

function TutorialsRoutes() {
  const [searchParams] = useSearchParams();
  const legacySlug = LEGACY_ARTICLE_SLUGS[searchParams.get('article') ?? ''];
  if (legacySlug) return <Navigate to={tutorialPath(legacySlug)} replace />;

  // Пути относительны #/tutorials: список — сам #/tutorials, туториал — #/tutorials/<slug>.
  return (
    <Routes>
      <Route element={<HomePage />}>
        <Route index element={null} />
        <Route path=":slug" element={<TutorialRoute />} />
      </Route>
      <Route path="*" element={<Navigate to="/tutorials" replace />} />
    </Routes>
  );
}

export default function TutorialsApp() {
  const { lang, selected, choose } = usePageLanguage();
  const { theme } = useTheme();

  useTutorialsHead();

  // Области прокрутки за краем страницы показывают <body> — красим его как фон оригинала.
  useEffect(() => {
    const previous = document.body.style.backgroundColor;
    document.body.style.backgroundColor = theme === 'dark' ? '#0a0a0a' : '#fafafa';
    return () => {
      document.body.style.backgroundColor = previous;
    };
  }, [theme]);

  return (
    <LanguageProvider lang={lang} setLang={choose}>
      <div className="tutorials-page">
        <Header lang={selected} onLangChange={choose} extra={<InstallButton />} />
        <div className="tutorials-content">
          <LightboxProvider>
            <TutorialsRoutes />
          </LightboxProvider>
        </div>
      </div>
    </LanguageProvider>
  );
}
