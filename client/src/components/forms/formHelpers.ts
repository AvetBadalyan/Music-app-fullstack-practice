export type FormFeedback =
  | { kind: 'idle' }
  | { kind: 'error'; message: string }
  | {
      kind: 'success';
      message: string;
      /** Route to the record just created, offered as a follow-up link. */
      linkPath: string;
      linkLabel: string;
    };

export const idleFeedback: FormFeedback = { kind: 'idle' };

/**
 * Pull a message out of a failed RTK Query mutation.
 *
 * The API answers with `{ error: string }`, but a request that never reached it
 * (offline, CORS) rejects with a plain `Error` instead, so both are handled.
 */
export const getErrorMessage = (error: unknown): string => {
  const fallback = 'Request failed.';

  if (typeof error !== 'object' || error === null) return fallback;

  const { data, message } = error as { data?: unknown; message?: unknown };

  if (typeof data === 'string') return data;

  if (typeof data === 'object' && data !== null) {
    const apiError = (data as { error?: unknown }).error;
    if (typeof apiError === 'string') return apiError;
  }

  if (typeof message === 'string') return message;

  return fallback;
};
