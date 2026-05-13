/**
 * Field length limits mirroring the backend DTOs in `src/dto/*.dto.ts`.
 * Keep these in sync with the server-side `@MaxLength()` decorators so the
 * frontend never sends a payload the backend would reject.
 */
export const FIELD_LIMITS = {
  artistName: 50,
  artistBio: 1000,
  albumTitle: 100,
  songTitle: 100,
  genreName: 50,
  imageUrl: 500,
  searchQuery: 100,
} as const;

/**
 * Character count at which a soft warning is shown under image URL inputs,
 * advising the user to shorten the source filename before the hard limit hits.
 */
export const IMAGE_URL_WARN_AT = 400;
