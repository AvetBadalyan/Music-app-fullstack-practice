import type { IAlbumRef, ISong } from '../types/api';

/**
 * Internal extension types for sort-time fields that the base API types do
 * not guarantee but that callers can provide when available.
 *
 * - `AlbumRefWithDate`:  IAlbumRef extended with an optional releaseDate.
 *   Populated by the ArtistDetailPage, which has `artist.albums[].releaseDate`
 *   and can merge it onto each `song.album` before calling sortByAlbumReleaseThenTrack.
 *
 * - `SongWithSortFields`: ISong extended with the album extension above and an
 *   optional trackNumber for future use (the field does not currently exist in
 *   the database schema, so the fallback is always alphabetical by title).
 */
type AlbumRefWithDate = IAlbumRef & { releaseDate?: string | null };

type SongWithSortFields = ISong & {
  album?: AlbumRefWithDate | null;
  /** Not yet present in the DB schema; handled gracefully when absent. */
  trackNumber?: number | null;
};

/**
 * Sort songs for an artist's "Play All" action.
 *
 * Primary key  – album release date ascending (ISO string comparison).
 *                Albums without a release date sort after dated albums.
 * Secondary key – album title alphabetically (stable group boundary when
 *                 release dates are absent or tied).
 * Tertiary key  – track number ascending (when available).
 * Final fallback – song title alphabetically.
 *
 * Songs with no album are placed at the very end.
 *
 * @param songs  Any ISong array.  Optionally enriched with
 *               `song.album.releaseDate` and/or `song.trackNumber`.
 * @returns      A new sorted array; the original is not mutated.
 */
export function sortByAlbumReleaseThenTrack(songs: ISong[]): ISong[] {
  return [...songs].sort((a, b) => {
    const songA = a as SongWithSortFields;
    const songB = b as SongWithSortFields;

    // ── Album presence ───────────────────────────────────────────────────────
    const hasAlbumA = songA.album != null;
    const hasAlbumB = songB.album != null;

    if (!hasAlbumA && !hasAlbumB) return songA.title.localeCompare(songB.title);
    if (!hasAlbumA) return 1;  // A goes after B
    if (!hasAlbumB) return -1; // B goes after A

    // ── Album release date ───────────────────────────────────────────────────
    const dateA = songA.album!.releaseDate;
    const dateB = songB.album!.releaseDate;

    const hasDatedA = dateA != null && dateA !== '';
    const hasDatedB = dateB != null && dateB !== '';

    if (hasDatedA && hasDatedB) {
      // ISO date strings compare lexicographically → ascending = oldest first
      if (dateA! < dateB!) return -1;
      if (dateA! > dateB!) return 1;
    } else if (hasDatedA) {
      return -1; // Dated album sorts before undated
    } else if (hasDatedB) {
      return 1;
    }

    // ── Album title (stable group when dates absent or equal) ────────────────
    const albumTitleDiff = songA.album!.title.localeCompare(songB.album!.title);
    if (albumTitleDiff !== 0) return albumTitleDiff;

    // ── Track number within the album ────────────────────────────────────────
    const trackA = songA.trackNumber;
    const trackB = songB.trackNumber;

    if (trackA != null && trackB != null) return trackA - trackB;
    if (trackA != null) return -1;
    if (trackB != null) return 1;

    // ── Final tiebreaker ─────────────────────────────────────────────────────
    return songA.title.localeCompare(songB.title);
  });
}

/**
 * Sort songs for an album's "Play All" action.
 *
 * Primary key  – track number ascending (when available).
 *                The Song entity has no trackNumber column in the current DB
 *                schema; the field is handled here for forward compatibility.
 * Final fallback – song title alphabetically.
 *
 * @param songs  Any ISong array, optionally carrying a `trackNumber` field.
 * @returns      A new sorted array; the original is not mutated.
 */
export function sortByTrackNumber(songs: ISong[]): ISong[] {
  return [...songs].sort((a, b) => {
    const songA = a as SongWithSortFields;
    const songB = b as SongWithSortFields;

    const trackA = songA.trackNumber;
    const trackB = songB.trackNumber;

    if (trackA != null && trackB != null) return trackA - trackB;
    if (trackA != null) return -1; // Numbered song sorts before unnumbered
    if (trackB != null) return 1;

    // No track numbers available: fall back to alphabetical by title
    return songA.title.localeCompare(songB.title);
  });
}
