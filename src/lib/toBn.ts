const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'] as const;

/**
 * Bengali numerals. Used for dates, reading time, reference numerals, counts —
 * everywhere except URLs, ISBNs, and the publication years of English books.
 */
export const toBn = (n: number | string): string =>
  String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
