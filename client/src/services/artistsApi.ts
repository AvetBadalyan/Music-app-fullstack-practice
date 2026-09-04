import { api } from './api';
import type { IArtist } from '../types/api';

interface CreateArtistPayload {
  name: string;
  bio?: string;
  profilePicture?: File;
}

export const artistsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllArtists: build.query<IArtist[], void>({
      query: () => '/artists',
      providesTags: ['Artist'],
    }),
    getArtistById: build.query<IArtist, string>({
      query: (id) => `/artists/${id}`,
      providesTags: ['Artist'],
    }),
    searchArtists: build.query<IArtist[], string>({
      query: (name) => ({
        url: '/artists/search',
        params: { name },
      }),
      providesTags: ['Artist'],
    }),
    createArtist: build.mutation<IArtist, CreateArtistPayload>({
      query: ({ name, bio, profilePicture }) => {
        const formData = new FormData();
        formData.append('name', name);
        if (bio) formData.append('bio', bio);
        if (profilePicture) formData.append('profilePicture', profilePicture);
        return {
          url: '/artists',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Artist'],
    }),
    deleteArtist: build.mutation<void, string>({
      query: (id) => ({
        url: `/artists/${id}`,
        method: 'DELETE',
      }),
      // Deleting an artist DB-cascades to their albums and songs.
      invalidatesTags: ['Artist', 'Album', 'Song', 'Genre'],
    }),
  }),
});

export const {
  useGetAllArtistsQuery,
  useGetArtistByIdQuery,
  useSearchArtistsQuery,
  useCreateArtistMutation,
  useDeleteArtistMutation,
} = artistsApi;
