/**
 * Format a total running time the way streaming apps do: "4 min" under an
 * hour, "1 hr 12 min" from an hour up.
 *
 * Rounds to the nearest minute, but never shows "0 min" for something that
 * has any length at all. For a single track's `m:ss` length use
 * `formatDuration` instead.
 */
export const formatTotalDuration = (
  seconds: number | null | undefined,
): string => {
  if (seconds === null || seconds === undefined) return '0 min';
  if (!Number.isFinite(seconds) || seconds <= 0) return '0 min';

  const totalMinutes = Math.max(1, Math.round(seconds / 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} min`;
  return minutes === 0 ? `${hours} hr` : `${hours} hr ${minutes} min`;
};
