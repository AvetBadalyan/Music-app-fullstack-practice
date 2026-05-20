import { useEffect, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { useAppDispatch } from '../../app/hooks';
import { supabase } from '../../services/supabaseClient';
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

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        dispatch(setAuthSession(getSessionPayload(data.session)));
      })
      .catch(() => {
        if (!mounted) return;
        dispatch(clearAuthSession());
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setAuthSession(getSessionPayload(session)));
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthSessionProvider;