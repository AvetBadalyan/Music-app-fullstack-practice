/**
 * Field length limits mirroring the backend DTOs in `src/dto/*.dto.ts`.
 *
 * Used for the `maxLength` on every text input, so the browser stops the
 * visitor at the same point the API would reject the request. The server still
 * validates - this only saves a pointless round trip.
 */
export const FIELD_LIMITS = {
  artistName: 50,
  artistBio: 1000,
  albumTitle: 100,
  songTitle: 100,
  genreName: 50,
  searchQuery: 100,
} as const;
