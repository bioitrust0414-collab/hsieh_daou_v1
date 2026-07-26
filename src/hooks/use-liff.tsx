import { useEffect, useState, useCallback } from 'react';
import { recordLineLogin } from '../lib/supabase';

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
  loginAndOpen: (url: string) => void;
}

// Query param used to carry the intended destination through the LINE Login
// OAuth redirect (browser flow only; in-client flow never leaves the page).
const REDIRECT_PARAM = "liffRedirectTo";

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

        // Get user profile whenever logged in — in-client login is silent
        // (happens automatically for OA friends), browser login only gets
        // here after a completed OAuth redirect, both cases are real logins.
        if (liff.isLoggedIn()) {
          const lineProfile = await liff.getProfile();
          setProfile({
            userId: lineProfile.userId,
            displayName: lineProfile.displayName,
            pictureUrl: lineProfile.pictureUrl,
            statusMessage: lineProfile.statusMessage,
          });
          recordLineLogin({
            line_user_id: lineProfile.userId,
            display_name: lineProfile.displayName,
            picture_url: lineProfile.pictureUrl,
            status_message: lineProfile.statusMessage,
            is_in_client: inLineApp,
          });
        }

        console.log('[LIFF] Initialized successfully', {
          inLineApp,
          hasProfile: liff.isLoggedIn(),
        });

        // If we just came back from the LINE Login OAuth redirect with a
        // pending destination, and login succeeded, continue there now.
        const params = new URLSearchParams(window.location.search);
        const pendingUrl = params.get(REDIRECT_PARAM);
        if (pendingUrl && liff.isLoggedIn()) {
          window.open(decodeURIComponent(pendingUrl), '_blank');
          params.delete(REDIRECT_PARAM);
          const newSearch = params.toString();
          const newUrl =
            window.location.pathname +
            (newSearch ? `?${newSearch}` : '') +
            window.location.hash;
          window.history.replaceState({}, '', newUrl);
        }
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

  // Log in if needed, then open `url` (e.g. the OA add-friend page).
  // In-client: login is silent, so we can open immediately after.
  // Browser: liff.login() is a full-page OAuth redirect, so we pass the
  // target along as a query param and resume it after the redirect back
  // (see the pending-redirect check in the init effect above).
  const loginAndOpen = useCallback(
    async (url: string) => {
      if (typeof window === 'undefined') return;

      try {
        const { liff } = await import('@line/liff');

        if (liff.isInClient()) {
          if (!liff.isLoggedIn()) {
            liff.login();
          }
          liff.openWindow({ url, external: true });
          return;
        }

        if (liff.isLoggedIn()) {
          window.open(url, '_blank');
          return;
        }

        const redirectUri = `${window.location.origin}${window.location.pathname}?${REDIRECT_PARAM}=${encodeURIComponent(url)}`;
        liff.login({ redirectUri });
      } catch (err) {
        console.error('[LIFF] loginAndOpen failed:', err);
        window.open(url, '_blank');
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
    loginAndOpen,
  };
}
