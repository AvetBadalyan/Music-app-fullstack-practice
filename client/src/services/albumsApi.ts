import { api } from './api';
import type { IAlbum } from '../types/album';

interface CreateAlbumPayload {
  title: string;
  releaseDate?: string;
  coverImage?: File;
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
      query: ({ title, artistId, releaseDate, coverImage }) => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('artistId', artistId);
        if (releaseDate) formData.append('releaseDate', releaseDate);
        if (coverImage) formData.append('coverImage', coverImage);
        return {
          url: '/albums',
          method: 'POST',
          body: formData,
        };
      },
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
