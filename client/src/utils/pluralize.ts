/** "1 song", "2 songs" - the count followed by the right form of the noun. */
export const pluralize = (count: number, noun: string): string =>
  `${count} ${noun}${count === 1 ? '' : 's'}`;
