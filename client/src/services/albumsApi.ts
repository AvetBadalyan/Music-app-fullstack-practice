import { api } from './api';
import type { IAlbum } from '../types/album';

interface CreateAlbumPayload {
  title: string;
  releaseDate?: string;
  coverImage?: string;
  artistId: string;
}

export const albumsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllAlbums: build.query<IAlbum[], void>({
      query: () => '/albums',
      providesTags: ['Album'],
    }),
    getAlbumById: build.query<IAlbum, string>({
      query: (id) => `/albums/${id}`,
      providesTags: ['Album'],
    }),
    createAlbum: build.mutation<IAlbum, CreateAlbumPayload>({
      query: (body) => ({
        url: '/albums',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Album'],
    }),
    deleteAlbum: build.mutation<void, string>({
      query: (id) => ({
        url: `/albums/${id}`,
        method: 'DELETE',
      }),
      // Deleting an album DB-cascades to its songs.
      invalidatesTags: ['Album', 'Song', 'Artist', 'Genre'],
    }),
  }),
});

export const {
  useGetAllAlbumsQuery,
  useGetAlbumByIdQuery,
  useCreateAlbumMutation,
  useDeleteAlbumMutation,
} = albumsApi;
