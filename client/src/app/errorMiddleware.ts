import { isRejectedWithValue, type Middleware } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

interface RtkErrorPayload {
  status?: number | string;
  data?: { message?: string; error?: string } | string;
  error?: string;
}

// Normalize different RTK Query error shapes into one user-friendly message.
const extractMessage = (payload: unknown): string => {
  if (!payload || typeof payload !== 'object') return 'Something went wrong';
  const errorPayload = payload as RtkErrorPayload;

  if (errorPayload.status === 'FETCH_ERROR')
    return 'Network error - is the server running?';
  if (errorPayload.status === 'PARSING_ERROR')
    return 'Unexpected response from server';

  if (typeof errorPayload.data === 'string') return errorPayload.data;
  if (errorPayload.data && typeof errorPayload.data === 'object') {
    if (errorPayload.data.message) return errorPayload.data.message;
    if (errorPayload.data.error) return errorPayload.data.error;
  }
  if (errorPayload.error) return errorPayload.error;

  if (typeof errorPayload.status === 'number') {
    return `Request failed (${errorPayload.status})`;
  }
  return 'Something went wrong';
};

export const rtkQueryErrorToast: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const actionMeta = (action as { meta?: { arg?: { type?: string } } }).meta;
    // Auto-toast only failed queries. Mutations already show inline form errors.
    if (actionMeta?.arg?.type === 'query') {
      toast.error(extractMessage(action.payload));
    }
  }
  return next(action);
};
