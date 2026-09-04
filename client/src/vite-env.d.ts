/// <reference types="vite/client" />

/**
 * The environment variables the frontend reads. Declaring them turns a typo in
 * `import.meta.env.VITE_...` into a compile error instead of `undefined` at
 * runtime.
 *
 * Every value here is compiled into the public bundle - none of them are
 * secret. Real secrets live in the API's environment only.
 */
interface ImportMetaEnv {
  /** Deployed API origin. Unset in development, where Vite proxies /api. */
  readonly VITE_API_URL?: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  /** Shows the admin UI for this account. The API enforces the real check. */
  readonly VITE_ADMIN_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
