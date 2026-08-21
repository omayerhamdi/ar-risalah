/** One place for the navigation so header, footer and mobile bar cannot drift. */

export const SITE = {
  name: 'আর-রিসালাহ',
  nameArabic: 'الرسالة',
  tagline: 'চিন্তার পরিশুদ্ধি, আখলাকের পুনরুদ্ধার',
} as const;

export const PRIMARY_NAV = [
  { href: '/articles', label: 'প্রবন্ধ' },
  { href: '/topics', label: 'বিষয়' },
  { href: '/research', label: 'গবেষণা' },
  { href: '/for-khateebs', label: 'খতীবদের জন্য' },
  { href: '/about', label: 'পরিচয়' },
] as const;

/** Bottom bar on phones. Three items, per the brief. */
export const MOBILE_NAV = [
  { href: '/articles', label: 'প্রবন্ধ' },
  { href: '/search', label: 'খোঁজ' },
  { href: '/subscribe', label: 'যুক্ত হোন' },
] as const;

export const FOOTER_NAV = [
  {
    heading: 'পড়ুন',
    links: [
      { href: '/start-here', label: 'শুরু করুন এখান থেকে' },
      { href: '/articles', label: 'সব প্রবন্ধ' },
      { href: '/topics', label: 'বিষয়সমূহ' },
      { href: '/research', label: 'গবেষণা' },
    ],
  },
  {
    heading: 'সম্পদ',
    links: [
      { href: '/resources', label: 'একাডেমিক রিসোর্স' },
      { href: '/for-khateebs', label: 'খতীব ও দাঈদের জন্য' },
      { href: '/glossary', label: 'পরিভাষা কোষ' },
      { href: '/authors', label: 'লেখকবৃন্দ' },
    ],
  },
  {
    heading: 'আর-রিসালাহ',
    links: [
      { href: '/about', label: 'আমাদের পরিচয়' },
      { href: '/contact', label: 'যোগাযোগ' },
      { href: '/privacy', label: 'গোপনীয়তা নীতি' },
      { href: '/terms', label: 'ব্যবহারের শর্ত' },
    ],
  },
] as const;
