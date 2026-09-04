import { api } from './api';
import type { ISong } from '../types/api';

export interface CreateSongPayload {
  title: string;
  artistId: string;
  audioFile: File;
  albumId?: string;
  genreIds?: string[];
}

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
    createSong: build.mutation<ISong, CreateSongPayload>({
      query: ({ title, artistId, audioFile, albumId, genreIds }) => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('artistId', artistId);
        if (albumId) formData.append('albumId', albumId);
        genreIds?.forEach((id) => formData.append('genreIds', id));
        formData.append('audioFile', audioFile);

        return {
          url: '/songs',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Song', 'Artist', 'Album', 'Genre'],
    }),
    deleteSong: build.mutation<void, string>({
      query: (id) => ({
        url: `/songs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Song', 'Album', 'Artist', 'Genre'],
    }),
  }),
});

export const {
  useGetAllSongsQuery,
  useGetSongByIdQuery,
  useSearchSongsQuery,
  useCreateSongMutation,
  useDeleteSongMutation,
} = songsApi;
