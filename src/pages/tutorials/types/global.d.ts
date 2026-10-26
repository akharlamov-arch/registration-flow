// Событие установки PWA (Chrome/Android). Его нет в стандартных типах DOM.
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface WindowEventMap {
  beforeinstallprompt: BeforeInstallPromptEvent;
}

interface Navigator {
  /** Safari iOS: сайт открыт как приложение с домашнего экрана. */
  standalone?: boolean;
}
