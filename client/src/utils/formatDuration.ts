/**
 * Format a length in seconds as `m:ss`.
 *
 * Shared by the track lists and the player so a song's duration reads the same
 * everywhere. Returns the placeholder for anything unusable - a missing
 * duration, or the `NaN` an <audio> element reports before its metadata loads.
 */
export const formatDuration = (
  seconds: number | null | undefined,
  placeholder = '0:00',
): string => {
  if (seconds === null || seconds === undefined) return placeholder;
  if (!Number.isFinite(seconds) || seconds < 0) return placeholder;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');

  return `${minutes}:${remainingSeconds}`;
};
