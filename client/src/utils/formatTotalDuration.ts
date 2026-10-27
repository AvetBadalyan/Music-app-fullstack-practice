/**
 * Format a total duration (in seconds) as "Xh Ym".
 *
 * Used for artist total-duration stat badges (Requirement 5.3).
 *
 * Examples:
 *   formatTotalDurationHours(8100) → "2h 15m"
 *   formatTotalDurationHours(0)    → "0h 0m"
 *
 * @param seconds - Total duration in seconds (non-negative finite number)
 * @returns Formatted string in "Xh Ym" form
 */
export function formatTotalDurationHours(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0h 0m';

  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
}

/**
 * Format a total duration (in seconds) as "M:SS".
 *
 * Used for album total-duration stat badges (Requirement 5.5).
 *
 * Examples:
 *   formatTotalDurationMinutes(2703) → "45:03"
 *   formatTotalDurationMinutes(0)    → "0:00"
 *
 * @param seconds - Total duration in seconds (non-negative finite number)
 * @returns Formatted string in "M:SS" form
 */
export function formatTotalDurationMinutes(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';

  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const secs = String(totalSeconds % 60).padStart(2, '0');

  return `${minutes}:${secs}`;
}
