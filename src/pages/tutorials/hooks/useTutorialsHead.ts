import { useEffect } from 'react';
import appleTouchIcon from '@/assets/icons/apple-touch-icon.png';
import favicon from '@/assets/icons/favicon.ico';
import favicon16 from '@/assets/icons/favicon-16x16.png';
import favicon32 from '@/assets/icons/favicon-32x32.png';

/**
 * <head> оригинала (иконки вкладки и домашнего экрана, цвет браузера) — пока страница на экране.
 * В registration-flow у туториалов нет своего index.html, поэтому теги ставятся и убираются здесь.
 */
export function useTutorialsHead() {
  useEffect(() => {
    const added: HTMLElement[] = [];
    const add = (tag: string, attrs: Record<string, string>) => {
      const el = document.createElement(tag);
      Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
      document.head.appendChild(el);
      added.push(el);
    };

    const icon = document.querySelector('link[rel="icon"]');
    const previous = icon && { href: icon.getAttribute('href'), type: icon.getAttribute('type') };
    icon?.setAttribute('href', favicon);
    icon?.setAttribute('type', 'image/x-icon');

    add('link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: favicon32 });
    add('link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: favicon16 });
    add('link', { rel: 'apple-touch-icon', sizes: '180x180', href: appleTouchIcon });
    add('meta', { name: 'theme-color', content: '#0066ff' });
    add('meta', { name: 'apple-mobile-web-app-capable', content: 'yes' });
    add('meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'default' });
    add('meta', { name: 'apple-mobile-web-app-title', content: 'iTrucking' });

    return () => {
      added.forEach((el) => el.remove());
      if (icon && previous) {
        icon.setAttribute('href', previous.href ?? '');
        icon.setAttribute('type', previous.type ?? '');
      }
    };
  }, []);
}
