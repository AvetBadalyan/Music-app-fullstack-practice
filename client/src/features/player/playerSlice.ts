import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ISong } from '../../types/song';

interface PlayerState {
  currentSong: ISong | null;
  isPlaying: boolean;
  queue: ISong[];
  currentIndex: number;
}

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,
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
      if (state.currentIndex < state.queue.length - 1) {
        state.currentIndex += 1;
        state.currentSong = state.queue[state.currentIndex];
        state.isPlaying = true;
      }
    },
    prevSong(state) {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
        state.currentSong = state.queue[state.currentIndex];
        state.isPlaying = true;
      }
    },
  },
});

export const { playSong, togglePlay, pause, nextSong, prevSong } = playerSlice.actions;
export default playerSlice.reducer;
