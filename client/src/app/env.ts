/**
 * Read a required frontend environment variable, failing loudly at startup if
 * it is missing. Vite inlines these at build time, so a missing value means a
 * misconfigured build - better to say so than to render a broken app.
 */
export const requireViteEnv = (
  name: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_PUBLISHABLE_KEY',
): string => {
  const value = import.meta.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};
