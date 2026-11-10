/**
 * The year an album came out, or null when its release date is unknown.
 *
 * Uses getUTCFullYear: "1974-01-01" is midnight UTC, which getFullYear() would
 * turn into 1973 for visitors west of Greenwich.
 */
export const getReleaseYear = (releaseDate: string | null): number | null =>
  releaseDate ? new Date(releaseDate).getUTCFullYear() : null;
