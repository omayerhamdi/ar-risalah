/** One place for the navigation so header, footer and mobile bar cannot drift. */

export const SITE = {
  name: 'আর-রিসালাহ',
  nameArabic: 'الرسالة',
  /** What the platform is, in one line. Used in the footer and the <title>. */
  tagline: 'সুন্নাহ ও মাকাসিদের আলোকে প্রজন্ম গঠনের দাওয়াহ ও গবেষণা কেন্দ্র',
  /** Where the header wordmark is too tight for the full line. */
  taglineShort: 'দাওয়াহ ও গবেষণা কেন্দ্র',
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

/** The four pillars, in the order the editorial plan gives them. */
export const CATEGORIES = [
  { slug: 'akhlaq-poribar', label: 'আখলাক ও পরিবার' },
  { slug: 'chinta-motobad', label: 'চিন্তা ও মতবাদ' },
  { slug: 'jubosomaj-somokal', label: 'যুবসমাজ ও সমকাল' },
  { slug: 'ilm-jibondorshon', label: 'ইলম ও জীবনদর্শন' },
] as const;

export const FOOTER_NAV = [
  {
    heading: 'পড়ুন',
    links: [
      { href: '/start-here', label: 'শুরু করুন এখান থেকে' },
      { href: '/articles', label: 'সব প্রবন্ধ' },
      { href: '/topics', label: 'বিষয়সমূহ' },
      { href: '/search', label: 'খুঁজে দেখুন' },
    ],
  },
  {
    heading: 'বিভাগ',
    links: CATEGORIES.map((c) => ({ href: `/categories/${c.slug}`, label: c.label })),
  },
  {
    heading: 'গবেষণা ও রিসোর্স',
    links: [
      { href: '/research', label: 'গবেষণা স্তর' },
      { href: '/resources', label: 'রিসোর্স আর্কাইভ' },
      { href: '/for-khateebs', label: 'খুতবা ও লিফলেট' },
      { href: '/glossary', label: 'পরিভাষা কোষ' },
    ],
  },
  {
    heading: 'আর-রিসালাহ',
    links: [
      { href: '/about', label: 'আমাদের পরিচয়' },
      { href: '/authors', label: 'লেখকবৃন্দ' },
      { href: '/subscribe', label: 'যুক্ত হোন' },
      { href: '/contact', label: 'যোগাযোগ' },
    ],
  },
] as const;

export const LEGAL_NAV = [
  { href: '/privacy', label: 'গোপনীয়তা নীতি' },
  { href: '/terms', label: 'ব্যবহারের শর্ত' },
  { href: '/rss.xml', label: 'RSS ফিড' },
] as const;

/**
 * Accounts are not open yet, so every href is a placeholder. The icons are
 * here so the footer can be judged as a whole; swap the '#' when the pages
 * exist. `icon` keys the inline SVG in Footer.astro.
 */
export const SOCIAL = [
  { icon: 'facebook', label: 'ফেসবুক', href: '#' },
  { icon: 'youtube', label: 'ইউটিউব', href: '#' },
  { icon: 'telegram', label: 'টেলিগ্রাম', href: '#' },
  { icon: 'whatsapp', label: 'হোয়াটসঅ্যাপ চ্যানেল', href: '#' },
  { icon: 'x', label: 'এক্স', href: '#' },
] as const;
