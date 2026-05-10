import { isRejectedWithValue, type Middleware } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

interface RtkErrorPayload {
  status?: number | string;
  data?: { message?: string; error?: string } | string;
  error?: string;
}

const extractMessage = (payload: unknown): string => {
  if (!payload || typeof payload !== 'object') return 'Something went wrong';
  const p = payload as RtkErrorPayload;

  if (p.status === 'FETCH_ERROR') return 'Network error — is the server running?';
  if (p.status === 'PARSING_ERROR') return 'Unexpected response from server';

  if (typeof p.data === 'string') return p.data;
  if (p.data && typeof p.data === 'object') {
    if (p.data.message) return p.data.message;
    if (p.data.error) return p.data.error;
  }
  if (p.error) return p.error;

  if (typeof p.status === 'number') return `Request failed (${p.status})`;
  return 'Something went wrong';
};

export const rtkQueryErrorToast: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const meta = (action as { meta?: { arg?: { type?: string } } }).meta;
    // Only auto-toast query failures; mutations are typically handled inline by forms.
    if (meta?.arg?.type === 'query') {
      toast.error(extractMessage(action.payload));
    }
  }
  return next(action);
};
