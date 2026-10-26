import { Navigate, useParams } from 'react-router-dom';
import { HOME_PATH, useCloseTutorial } from '@/app/navigation';
import { TutorialModal } from '@/components/TutorialModal/TutorialModal';
import { getTutorial } from '@/content';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useI18n } from '@/i18n/context';

/** /tutorials/:slug — окно туториала поверх списка. Неизвестный slug ведёт к списку. */
export function TutorialRoute() {
  const { slug } = useParams();
  const { lang } = useI18n();
  const closeTutorial = useCloseTutorial();
  const tutorial = getTutorial(slug);

  useDocumentTitle(tutorial ? `${tutorial.title[lang]} | iTrucking` : undefined);

  if (!tutorial) return <Navigate to={HOME_PATH} replace />;
  return <TutorialModal tutorial={tutorial} onClose={closeTutorial} />;
}
