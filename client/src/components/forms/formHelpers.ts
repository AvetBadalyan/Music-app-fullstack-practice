export type FormFeedback = {
  kind: 'idle' | 'success' | 'error';
  message: string;
  linkPath?: string;
  linkLabel?: string;
};

export const idleFeedback: FormFeedback = {
  kind: 'idle',
  message: '',
};

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null) {
    if ('data' in error) {
      const apiError = error as { data?: { error?: string } | string };

      if (typeof apiError.data === 'string') {
        return apiError.data;
      }

      if (
        apiError.data &&
        typeof apiError.data === 'object' &&
        'error' in apiError.data
      ) {
        return apiError.data.error ?? 'Request failed.';
      }
    }

    if (
      'message' in error &&
      typeof (error as { message?: unknown }).message === 'string'
    ) {
      return (error as { message: string }).message;
    }
  }

  return 'Request failed.';
};
