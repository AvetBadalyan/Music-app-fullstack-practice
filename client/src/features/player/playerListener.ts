import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { songsApi } from '../../services/songsApi';
import { albumsApi } from '../../services/albumsApi';
import { artistsApi } from '../../services/artistsApi';
import { closePlayer } from './playerSlice';
import type { RootState } from '../../app/store';

// Closes the player whenever the currently-playing song gets deleted —
// directly via deleteSong, or indirectly via deleteAlbum / deleteArtist
// (which DB-cascade to songs).
export const playerListener = createListenerMiddleware();

playerListener.startListening({
  matcher: isAnyOf(
    songsApi.endpoints.deleteSong.matchFulfilled,
    albumsApi.endpoints.deleteAlbum.matchFulfilled,
    artistsApi.endpoints.deleteArtist.matchFulfilled,
  ),
  effect: (action, api) => {
    const state = api.getState() as RootState;
    const current = state.player.currentSong;
    if (!current) return;

    let matches = false;
    if (songsApi.endpoints.deleteSong.matchFulfilled(action)) {
      matches = current.id === action.meta.arg.originalArgs;
    } else if (albumsApi.endpoints.deleteAlbum.matchFulfilled(action)) {
      matches = current.album?.id === action.meta.arg.originalArgs;
    } else if (artistsApi.endpoints.deleteArtist.matchFulfilled(action)) {
      matches = current.artist?.id === action.meta.arg.originalArgs;
    }

    if (matches) {
      api.dispatch(closePlayer());
    }
  },
});
