import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthSessionPayload {
  accessToken: string | null;
  email: string | null;
}

interface AuthState extends AuthSessionPayload {
  initialized: boolean;
  isAdmin: boolean;
}

const adminEmail = import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase();

const initialState: AuthState = {
  accessToken: null,
  email: null,
  initialized: false,
  isAdmin: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthSession: (state, action: PayloadAction<AuthSessionPayload>) => {
      const email = action.payload.email?.toLowerCase() ?? null;

      state.accessToken = action.payload.accessToken;
      state.email = action.payload.email;
      state.initialized = true;
      state.isAdmin = Boolean(email && adminEmail && email === adminEmail);
    },
    clearAuthSession: (state) => {
      state.accessToken = null;
      state.email = null;
      state.initialized = true;
      state.isAdmin = false;
    },
  },
});

export const { setAuthSession, clearAuthSession } = authSlice.actions;

export default authSlice.reducer;