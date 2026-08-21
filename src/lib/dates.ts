import { toBn } from './toBn';

const BN_MONTHS = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর',
] as const;

/** "৬ আগস্ট ২০২৬" */
export function bnDate(d: Date): string {
  return `${toBn(d.getUTCDate())} ${BN_MONTHS[d.getUTCMonth()]} ${toBn(d.getUTCFullYear())}`;
}

/** Machine-readable, for <time datetime>. Never localised. */
export const isoDate = (d: Date): string => d.toISOString().slice(0, 10);

/** "১২ মিনিট" */
export const bnReadingTime = (minutes: number): string => `${toBn(minutes)} মিনিট`;
