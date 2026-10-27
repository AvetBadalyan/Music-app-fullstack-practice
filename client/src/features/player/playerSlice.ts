import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ISong } from '../../types/api';

export type RepeatMode = 'off' | 'all' | 'one';

interface PlayerState {
  currentSong: ISong | null;
  isPlaying: boolean;
  queue: ISong[];
  currentIndex: number;
  volume: number; // 0..1
  isMuted: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
}

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,
  volume: 0.8,
  isMuted: false,
  shuffle: false,
  repeat: 'off',
};

const pickRandomIndex = (length: number, exclude: number) => {
  if (length <= 1) return 0;
  let next = Math.floor(Math.random() * length);
  if (next === exclude) next = (next + 1) % length;
  return next;
};

const setCurrentByIndex = (state: PlayerState, index: number) => {
  state.currentIndex = index;
  state.currentSong = state.queue[index];
  state.isPlaying = true;
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    playSong(state, action: PayloadAction<{ song: ISong; queue?: ISong[] }>) {
      state.currentSong = action.payload.song;
      state.isPlaying = true;
      if (action.payload.queue) {
        state.queue = action.payload.queue;
        state.currentIndex = action.payload.queue.findIndex(
          (song) => song.id === action.payload.song.id,
        );
      } else {
        state.queue = [action.payload.song];
        state.currentIndex = 0;
      }
    },
    togglePlay(state) {
      state.isPlaying = !state.isPlaying;
    },
    pause(state) {
      state.isPlaying = false;
    },
    nextSong(state) {
      if (state.queue.length === 0) return;

      if (state.shuffle) {
        const nextIndex = pickRandomIndex(
          state.queue.length,
          state.currentIndex,
        );
        setCurrentByIndex(state, nextIndex);
        return;
      }

      if (state.currentIndex < state.queue.length - 1) {
        setCurrentByIndex(state, state.currentIndex + 1);
        return;
      }

      if (state.repeat === 'all') {
        setCurrentByIndex(state, 0);
      }
    },
    prevSong(state) {
      if (state.queue.length === 0) return;

      if (state.shuffle) {
        const prevIndex = pickRandomIndex(
          state.queue.length,
          state.currentIndex,
        );
        setCurrentByIndex(state, prevIndex);
        return;
      }

      if (state.currentIndex > 0) {
        setCurrentByIndex(state, state.currentIndex - 1);
        return;
      }

      if (state.repeat === 'all') {
        setCurrentByIndex(state, state.queue.length - 1);
      }
    },
    setVolume(state, action: PayloadAction<number>) {
      const clamped = Math.max(0, Math.min(1, action.payload));
      state.volume = clamped;
      if (clamped > 0) state.isMuted = false;
    },
    toggleMute(state) {
      state.isMuted = !state.isMuted;
    },
    toggleShuffle(state) {
      state.shuffle = !state.shuffle;
    },
    cycleRepeat(state) {
      state.repeat =
        state.repeat === 'off' ? 'all' : state.repeat === 'all' ? 'one' : 'off';
    },
    closePlayer(state) {
      state.currentSong = null;
      state.isPlaying = false;
      state.queue = [];
      state.currentIndex = -1;
    },
    removeFromQueue(state, action: PayloadAction<number>) {
      const indexToRemove = action.payload;

      if (indexToRemove < 0 || indexToRemove >= state.queue.length) return;

      if (indexToRemove === state.currentIndex) {
        state.queue.splice(indexToRemove, 1);

        if (state.queue.length === 0) {
          // Queue is now empty
          state.currentSong = null;
          state.currentIndex = -1;
          state.isPlaying = false;
        } else if (indexToRemove >= state.queue.length) {
          // Was last song, wrap to first
          state.currentIndex = 0;
          state.currentSong = state.queue[0];
        } else {
          // Play next song at same index
          state.currentSong = state.queue[indexToRemove];
        }
      } else {
        // Removing non-current song
        state.queue.splice(indexToRemove, 1);

        // Adjust currentIndex if needed
        if (indexToRemove < state.currentIndex) {
          state.currentIndex -= 1;
        }
      }
    },
    playFromQueue(state, action: PayloadAction<number>) {
      const index = action.payload;

      if (index < 0 || index >= state.queue.length) return;

      state.currentIndex = index;
      state.currentSong = state.queue[index];
      state.isPlaying = true;
    },
  },
});

export const {
  playSong,
  togglePlay,
  pause,
  nextSong,
  prevSong,
  setVolume,
  toggleMute,
  toggleShuffle,
  cycleRepeat,
  closePlayer,
  removeFromQueue,
  playFromQueue,
} = playerSlice.actions;
export default playerSlice.reducer;
