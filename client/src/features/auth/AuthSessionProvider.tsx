import { useEffect, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { useAppDispatch } from '../../app/hooks';
import {
  clearAuthSession,
  setAuthSession,
} from './authSlice';

interface AuthSessionProviderProps {
  children: ReactNode;
}

const getSessionPayload = (session: Session | null) => ({
  accessToken: session?.access_token ?? null,
  email: session?.user.email ?? null,
});

const AuthSessionProvider = ({ children }: AuthSessionProviderProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | undefined;

    import('../../services/supabaseClient')
      .then(({ supabase }) => {
        if (!mounted) return;

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          dispatch(setAuthSession(getSessionPayload(session)));
        });
        unsubscribe = () => subscription.unsubscribe();

        return supabase.auth.getSession().then(({ data }) => {
          if (!mounted) return;
          dispatch(setAuthSession(getSessionPayload(data.session)));
        });
      })
      .catch((error: unknown) => {
        if (!mounted) return;
        console.error('Failed to initialize Supabase auth session:', error);
        dispatch(clearAuthSession());
      });

    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthSessionProvider;