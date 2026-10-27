/**
 * Truncate a string to a maximum length, appending an ellipsis character when
 * the text exceeds that limit.
 *
 * Used throughout the UI wherever text must fit in a constrained space — queue
 * song titles (40 chars), artist names in queue items (30 chars), album and
 * artist names in the New Releases Carousel (30 chars), etc.
 *
 * @param text      The string to truncate. Null or undefined returns ''.
 * @param maxLength The maximum number of characters to display (including the
 *                  ellipsis). Must be a positive integer.
 * @returns         The original string when it fits, or a truncated string
 *                  ending with '…' when it does not.
 */
export const truncateText = (
  text: string | null | undefined,
  maxLength: number,
): string => {
  if (text === null || text === undefined) return '';
  if (maxLength <= 0) return '';
  if (text.length <= maxLength) return text;

  // Trim to maxLength - 1 to leave room for the ellipsis character, then
  // strip any trailing whitespace so we don't end up with "foo …".
  return text.slice(0, maxLength - 1).trimEnd() + '…';
};
