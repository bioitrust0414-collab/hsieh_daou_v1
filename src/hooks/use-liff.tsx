import { useEffect, useState, useCallback } from 'react';

interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

interface UseLiffReturn {
  isInitialized: boolean;
  isInLineApp: boolean;
  profile: LiffProfile | null;
  error: Error | null;
  login: () => void;
  logout: () => void;
  openWindow: (url: string, target?: string) => void;
}

/**
 * Hook to manage LIFF initialization and state
 * Safely handles SSR by only running on client side
 */
export function useLiff(): UseLiffReturn {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInLineApp, setIsInLineApp] = useState(false);
  const [profile, setProfile] = useState<LiffProfile | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Initialize LIFF on component mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') {
      return; // Skip on server side
    }

    const initLiff = async () => {
      try {
        const { liff } = await import('@line/liff');
        const liffId = import.meta.env.VITE_LIFF_ID;

        if (!liffId) {
          throw new Error('VITE_LIFF_ID is not configured');
        }

        // Initialize LIFF
        await liff.init({ liffId });
        setIsInitialized(true);

        // Check if running in LINE app
        const inLineApp = liff.isInClient();
        setIsInLineApp(inLineApp);

        // Get user profile if in LINE app and logged in
        if (inLineApp && liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          setProfile({
            userId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl,
            statusMessage: profile.statusMessage,
          });
        }

        console.log('[LIFF] Initialized successfully', {
          inLineApp,
          hasProfile: !!profile,
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        console.error('[LIFF] Initialization failed:', error);
      }
    };

    initLiff();
  }, []);

  // Login handler
  const login = useCallback(async () => {
    if (typeof window === 'undefined') return;

    try {
      const { liff } = await import('@line/liff');
      if (!liff.isLoggedIn()) {
        liff.login();
      }
    } catch (err) {
      console.error('[LIFF] Login failed:', err);
    }
  }, []);

  // Logout handler
  const logout = useCallback(async () => {
    if (typeof window === 'undefined') return;

    try {
      const { liff } = await import('@line/liff');
      if (liff.isLoggedIn()) {
        liff.logout();
        setProfile(null);
      }
    } catch (err) {
      console.error('[LIFF] Logout failed:', err);
    }
  }, []);

  // Open external window
  const openWindow = useCallback(
    (url: string, target: string = '_blank') => {
      if (typeof window === 'undefined') return;

      try {
        const { liff } = require('@line/liff');
        if (liff.isInClient()) {
          liff.openWindow({
            url,
            external: true,
          });
        } else {
          window.open(url, target);
        }
      } catch (err) {
        console.error('[LIFF] Open window failed:', err);
        window.open(url, target);
      }
    },
    []
  );

  return {
    isInitialized,
    isInLineApp,
    profile,
    error,
    login,
    logout,
    openWindow,
  };
}
