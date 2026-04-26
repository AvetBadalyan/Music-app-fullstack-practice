import { api } from './api';
import type { ISong } from '../types/song';

export const songsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllSongs: build.query<ISong[], void>({
      query: () => '/songs',
      providesTags: ['Song'],
    }),
    getSongById: build.query<ISong, string>({
      query: (id) => `/songs/${id}`,
      providesTags: ['Song'],
    }),
    searchSongs: build.query<ISong[], string>({
      query: (title) => ({
        url: '/songs/search',
        params: { title },
      }),
      providesTags: ['Song'],
    }),
    createSong: build.mutation<ISong, FormData>({
      query: (formData) => ({
        url: '/songs',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Song'],
    }),
  }),
});

export const {
  useGetAllSongsQuery,
  useGetSongByIdQuery,
  useSearchSongsQuery,
  useCreateSongMutation,
} = songsApi;
