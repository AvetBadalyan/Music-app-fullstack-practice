import { configureStore } from '@reduxjs/toolkit';
import { api } from '../services/api';
import playerReducer from '../features/player/playerSlice';
import { playerListener } from '../features/player/playerListener';
import { rtkQueryErrorToast } from './errorMiddleware';

// Create the Redux store — the single source of truth for all app state
export const store = configureStore({
  // `reducer` tells Redux what state pieces to manage
  reducer: {
    api: api.reducer, // RTK Query manages all server data (songs, albums, etc.)
    player: playerReducer, // Our manual slice for the music player state
  },

  // `middleware` are functions that intercept state changes:
  // 1. playerListener — closes the player when its current song is deleted
  //    (prepended so it sees actions before RTK Query's own handlers)
  // 2. RTK Query's middleware — handles caching and refetching
  // 3. rtkQueryErrorToast — auto-shows error messages to users when queries fail
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(playerListener.middleware)
      .concat(api.middleware, rtkQueryErrorToast),
});

// These types tell TypeScript what the full state shape is, and what dispatch can do.
// Used in hooks.ts so components can safely read and modify state.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
