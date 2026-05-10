import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ISong } from '../../types/song';

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
          (s) => s.id === action.payload.song.id
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
        state.currentIndex = pickRandomIndex(state.queue.length, state.currentIndex);
        state.currentSong = state.queue[state.currentIndex];
        state.isPlaying = true;
        return;
      }

      if (state.currentIndex < state.queue.length - 1) {
        state.currentIndex += 1;
        state.currentSong = state.queue[state.currentIndex];
        state.isPlaying = true;
        return;
      }

      if (state.repeat === 'all') {
        state.currentIndex = 0;
        state.currentSong = state.queue[0];
        state.isPlaying = true;
      }
    },
    prevSong(state) {
      if (state.queue.length === 0) return;

      if (state.shuffle) {
        state.currentIndex = pickRandomIndex(state.queue.length, state.currentIndex);
        state.currentSong = state.queue[state.currentIndex];
        state.isPlaying = true;
        return;
      }

      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
        state.currentSong = state.queue[state.currentIndex];
        state.isPlaying = true;
        return;
      }

      if (state.repeat === 'all') {
        state.currentIndex = state.queue.length - 1;
        state.currentSong = state.queue[state.currentIndex];
        state.isPlaying = true;
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
      state.repeat = state.repeat === 'off' ? 'all' : state.repeat === 'all' ? 'one' : 'off';
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
} = playerSlice.actions;
export default playerSlice.reducer;
