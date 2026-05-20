import { createClient } from '@supabase/supabase-js';
import type { NextFunction, Request, Response } from 'express';
import { AuthenticationError, AuthorizationError } from '../utils/errors';
import { requireEnv } from '../utils/env';

const supabaseAuth = createClient(
  requireEnv('SUPABASE_URL'),
  requireEnv('SUPABASE_SECRET_KEY'),
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

const adminEmail = requireEnv('ADMIN_EMAIL').toLowerCase();

const getBearerToken = (authorizationHeader?: string): string | null => {
  if (!authorizationHeader?.startsWith('Bearer ')) return null;

  const token = authorizationHeader.slice('Bearer '.length).trim();
  return token || null;
};

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = getBearerToken(req.headers.authorization);

    if (!token) {
      throw new AuthenticationError('Authentication required');
    }

    const { data, error } = await supabaseAuth.auth.getUser(token);

    if (error || !data.user?.email) {
      throw new AuthenticationError('Invalid or expired session');
    }

    const userEmail = data.user.email.toLowerCase();

    if (userEmail !== adminEmail) {
      throw new AuthorizationError('Admin access required');
    }

    next();
  } catch (error) {
    next(error);
  }
};