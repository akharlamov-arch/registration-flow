import { createContext, useContext } from 'react';

export interface LightboxContextValue {
  openImage: (src: string, alt: string) => void;
}

export const LightboxContext = createContext<LightboxContextValue | null>(null);

export function useLightbox(): LightboxContextValue {
  const value = useContext(LightboxContext);
  if (!value) throw new Error('useLightbox must be used inside <LightboxProvider>');
  return value;
}
