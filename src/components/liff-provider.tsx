import { createContext, useContext, type ReactNode } from 'react';
import { useLiff, type UseLiffReturn } from '../hooks/use-liff';

const LiffContext = createContext<UseLiffReturn | null>(null);

export function LiffProvider({ children }: { children: ReactNode }) {
  const liffState = useLiff();

  return (
    <LiffContext.Provider value={liffState}>
      {children}
    </LiffContext.Provider>
  );
}

export function useLiffContext() {
  const context = useContext(LiffContext);
  if (!context) {
    throw new Error('useLiffContext must be used within LiffProvider');
  }
  return context;
}
