import { createClient } from '@supabase/supabase-js';
import { requireViteEnv } from '../app/env';

export const supabase = createClient(
  requireViteEnv('VITE_SUPABASE_URL'),
  requireViteEnv('VITE_SUPABASE_PUBLISHABLE_KEY'),
);