import { api } from './api';
import type { IGenre } from '../types/genre';

export const genresApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllGenres: build.query<IGenre[], void>({
      query: () => '/genres',
      providesTags: ['Genre'],
    }),
    getGenreById: build.query<IGenre, string>({
      query: (id) => `/genres/${id}`,
      providesTags: ['Genre'],
    }),
    createGenre: build.mutation<IGenre, { name: string }>({
      query: (body) => ({
        url: '/genres',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Genre'],
    }),
  }),
});

export const {
  useGetAllGenresQuery,
  useGetGenreByIdQuery,
  useCreateGenreMutation,
} = genresApi;
