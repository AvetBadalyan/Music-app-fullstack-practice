import { api } from './api';
import type { IArtist } from '../types/artist';

interface CreateArtistPayload {
  name: string;
  bio?: string;
  profilePicture?: string;
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
      query: (body) => ({
        url: '/artists',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Artist'],
    }),
  }),
});

export const {
  useGetAllArtistsQuery,
  useGetArtistByIdQuery,
  useSearchArtistsQuery,
  useCreateArtistMutation,
} = artistsApi;
