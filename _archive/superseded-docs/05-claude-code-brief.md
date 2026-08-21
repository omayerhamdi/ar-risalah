# Claude Code Implementation Brief — আর-রিসালাহ

> **বাংলায় সংক্ষেপে:** এই ফাইলটি Claude Code Agent-এর জন্য। এটি তাকে *কী বানাতে হবে* বলে, *কীভাবে* তা বেশিরভাগ ক্ষেত্রে তার নিজের সিদ্ধান্তে ছেড়ে দেয় — কারণ সে লাইভ কোড চালাতে ও দেখতে পারে। এই ব্রিফ পড়ার পর তার আর কোনো প্রশ্ন করার দরকার হওয়া উচিত নয়।

---

## 0. How to use this brief

Read these four documents before writing any code:

1. `docs/00-project-overview.md` — what this is and why
2. `docs/02-information-architecture.md` — sitemap, routes, content model
3. `docs/03-design-system.md` — **the authority on all visual decisions**
4. This file — build instructions

The design system is not a suggestion. Every colour, size, and spacing value must come from its tokens. Where this brief and the design system disagree, **the design system wins**.

Where a decision is not specified anywhere, make it yourself and note it in `DECISIONS.md`. Do not stop to ask.

---

## 1. Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | **Astro 5** | Static output, zero JS by default, MDX content collections — exactly right for a reading site |
| Styling | **Tailwind CSS v4** with CSS custom properties | v4's `@theme` maps cleanly to the token system |
| Content | **Astro Content Collections** (MDX + Zod schemas) | Type-safe frontmatter, git-based, no CMS needed at this stage |
| Search | **Pagefind** | Build-time index, client-side, Unicode/Bengali safe, free |
| Fonts | **@fontsource** self-hosted, subset | No CDN dependency; Bangladesh latency |
| Images | **astro:assets** → AVIF + WebP | Automatic responsive srcset |
| Deploy | **Cloudflare Pages** | Unlimited bandwidth, fast in South Asia, free tier is sufficient |
| Analytics | Plausible or Umami (add later, leave the hook) | Privacy, no cookie banner |

**Do not add:** React, Vue, or any UI framework. Do not add a state library. Do not add a component library. Total shipped JS on the article page must stay under 20KB gzipped.

Interactive bits needed (mobile menu, search overlay, table-of-contents highlight, reading progress, share, subscribe bar) are all achievable with ~150 lines of vanilla JS in an inline `<script>`. Use `<details>/<summary>` for accordions so they work without JS.

---

## 2. Repository layout

```
ar-risalah/
├── src/
│   ├── content/
│   │   ├── config.ts              Zod schemas for all collections
│   │   ├── articles/              14 .mdx files (provided)
│   │   ├── authors/               5 .md files (provided)
│   │   ├── resources/             academic resource entries
│   │   └── series/
│   ├── components/
│   │   ├── layout/                Header, Footer, MobileMenu, SkipLink
│   │   ├── article/               ArticleHeader, Jadwal, Hashiya, AyahBlock,
│   │   │                          HadithBlock, PullQuote, KeyTakeaways,
│   │   │                          References, ResourceList, ReadingProgress, Toc
│   │   ├── cards/                 ArticleCard, ResourceCard, AuthorCard, SeriesCard
│   │   ├── home/                  Hero, RecentBand, AkhlaqBand, SeriesBand,
│   │   │                          ResearchBand, CategoryGrid, SubscribeBand
│   │   └── ui/                    Button, Rule, Tag, Accordion, SearchOverlay,
│   │                              SubscribeCard, SubscribeBar, ShareRow
│   ├── layouts/                   Base.astro, Article.astro, Archive.astro
│   ├── pages/                     per the sitemap in 02-information-architecture.md
│   ├── styles/
│   │   ├── tokens.css             ← copy tokens verbatim from design system
│   │   ├── base.css               reset, typography defaults, Bengali tuning
│   │   └── global.css
│   └── lib/                       readingTime.ts, related.ts, formatDate.ts (Bengali numerals)
├── public/
│   ├── fonts/                     subset woff2
│   └── assets/                    covers, logo, og
├── DECISIONS.md                   ← you write this as you go
└── astro.config.mjs
```

---

## 3. Build order

Work in this sequence. Deploy a preview after each phase so Omayer can review incrementally.

**Phase 1 — Foundation**
Scaffold Astro + Tailwind v4. Write `tokens.css` from the design system. Install and subset fonts. Build `Base.astro` with skip link, `lang="bn"`, meta, and a type-specimen test page at `/dev/type` showing every heading level, body text, Arabic block, mono label, and card — at 375px, 768px and 1280px. **Verify Bengali conjuncts (যুক্তাক্ষর) render correctly in Tiro Bangla and Anek Bangla before going further.** If either font breaks conjuncts, fall back to Noto Serif Bengali (body) / Baloo Da 2 (headings) and record the change in `DECISIONS.md`.

**Phase 2 — Content layer**
Zod schemas per the content model in `02-information-architecture.md`. Import the 14 articles and 5 authors. Write `readingTime.ts` using **180 Bengali words per minute**. Write `formatDate.ts` to output Bengali numerals and Bengali month names (`১২ সেপ্টেম্বর ২০২৬`).

**Phase 3 — Article page** ← the most important page; spend the most time here
Build it mobile-first at 375px and get it right before touching desktop. Then add the desktop hashiya margin column. This page is the product.

**Phase 4 — Home + archives + author pages**

**Phase 5 — Search (Pagefind), subscribe components, share, RSS, sitemap, OG image generation**

**Phase 6 — Audit**
Lighthouse mobile ≥95 on all four categories. Keyboard-only pass. 200% zoom pass. Test at 320px width (smallest real device). Fix, then deploy.

---

## 4. Non-negotiables

These are the things most likely to go wrong. Treat each as a hard requirement.

1. **Mobile is the primary target.** Most readers are on mid-range Android phones on mobile data. Design and test at 375px first, then 320px, then widen.
2. **Bengali line-height 1.85 minimum** in body text. Anything tighter clips conjuncts.
3. **No `letter-spacing` on Bengali text.** It breaks conjunct rendering. Use `word-spacing` if you need air.
4. **Arabic must be `lang="ar" dir="rtl"`**, set in Amiri, at `--fs-arabic` with `--lh-arabic`. Never smaller than the surrounding Bengali.
5. **No box-shadows anywhere.** Depth comes from rules. This is a deliberate design position.
6. **No hover-only information.** Touch devices have no hover.
7. **Focus rings visible everywhere.** Never `outline: none`.
8. **`prefers-reduced-motion` respected.**
9. **No form inputs below 16px** or iOS will zoom the page.
10. **No Google Fonts CDN, no Google Analytics, no cookie banner.**
11. **No word from this list may appear anywhere in the built site:** demo, sample, placeholder, dummy, lorem ipsum, TODO, coming soon, "content to be added". If a section has no content yet, the section does not render.
12. **Every image needs Bengali `alt` text.**

---

## 5. Assets — use Magnific

Omayer has an active Magnific subscription connected via MCP. Generate assets there; do not use stock photo sites.

### Global image direction (apply to every generated asset)

> Abstract, non-figurative, scholarly. No people, no faces, no animals, no domes, no minarets, no crescents. Muted, desaturated, warm-neutral. Matte paper texture. Deep green `#1D4A3A` and slate `#2B4257` as the only chromatic notes, used sparingly. Feels like a page from a manuscript or a research monograph, not a poster.

### Logo prompt

```
A minimal wordmark logotype for an Islamic research journal named
"Ar-Risalah". Arabic word الرسالة set in a classical Naskh style,
above a thin 1px horizontal rule. Flat vector, single colour
(deep green #1D4A3A) on off-white #F4F4F0. No dome, no crescent,
no star, no book icon, no pen, no light rays, no ornament.
Extremely restrained. Editorial, scholarly, timeless. Generous
white space around the mark. Suitable for print at small sizes.
```

Also generate a **square monogram**: the Arabic letter **ر** centred in a square, `#F4F4F0` on `#1D4A3A`, for favicon and social. Square, not circular.

Produce: `logo.svg`, `logo-dark.svg`, `monogram.svg`, `favicon.ico`, `apple-touch-icon.png` (180×180), `og-default.png` (1200×630).

### Cover images

Each of the 14 articles has a `coverPrompt` field in its frontmatter — use it directly with Magnific. Export each at 1600×1200 (4:3), convert to AVIF, target under 80KB.

If Magnific is unavailable, fall back to **generated typographic covers**: build a small Astro/Satori route that renders the article title in Anek Bangla on `--paper` with the category rule on top. This is a legitimate design outcome, not a compromise — record it in `DECISIONS.md`.

### Geometric pattern

Generate one seamless girih-derived line pattern as SVG, single stroke, `--rule` colour. Used at very low opacity (4–6%) in exactly two places: the subscribe band and the 404 page. Nowhere else.

---

## 6. Components that need extra care

### `AyahBlock` / `HadithBlock`
MDX component, used inside articles:

```mdx
<AyahBlock
  arabic="وَقُل رَّبِّ زِدْنِي عِلْمًا"
  bangla="এবং বলো, হে আমার রব, আমার জ্ঞান বাড়িয়ে দিন।"
  source="সূরা ত্ব-হা, আয়াত ১১৪"
/>

<HadithBlock
  arabic="إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الأَخْلاَقِ"
  bangla="আমি প্রেরিত হয়েছি উত্তম চরিত্রের পূর্ণতা সাধনের জন্য।"
  source="মুসনাদে আহমাদ"
/>
```

Layout per `03-design-system.md` §5(গ). Test that long Arabic wraps without horizontal overflow at 320px.

### `Hashiya`
```mdx
<Hashiya term="ইশকাল">
এমন প্রশ্ন যার সহজ উত্তর নেই।
</Hashiya>
```
Desktop ≥1152px: absolutely positioned in the right margin column, aligned to its anchor point in the text. Below that: renders inline as a bordered box. Use CSS only — no JS positioning.

### `ReadingProgress`
2px bar, top, `--accent`. Use `IntersectionObserver` or a throttled scroll listener. Article pages only. Hidden under `prefers-reduced-motion`? No — keep it, it's functional, but do not animate its colour.

### `SubscribeBar`
Bottom bar. Strict rules in `04-ux-and-growth.md` §3. Fires only on the reader's **second** article and only past 70% scroll. Dismissal stored in `localStorage` for 90 days. Max height 72px. Never a modal.

### `Toc`
Built from `h2`/`h3` in the MDX. Desktop: sticky in the hashiya column with the active section marked by a filled rule. Mobile: a `<details>` accordion, closed by default, directly under the article meta.

---

## 7. Deployment

- GitHub repo → Cloudflare Pages, auto-deploy on push to `main`
- Preview deployments on every branch (Omayer will review these before the majlis)
- Build command `npm run build`, output `dist`
- Add `_headers`: long cache for `/assets/*` and `/fonts/*`, security headers (`X-Content-Type-Options`, `Referrer-Policy: strict-origin-when-cross-origin`, a CSP with no external script origins)
- `robots.txt` allowing everything, pointing to `/sitemap.xml`

---

## 8. Deliver at the end

1. Live preview URL
2. `DECISIONS.md` — every decision you made that this brief did not specify, with a one-line reason
3. `README.md` — how to add a new article, how to add an author, how to add a resource, written **in Bengali**, for a non-developer team member
4. Lighthouse mobile report screenshot
5. A short list of anything you could not do and why

---

## 9. Judgement calls — you decide

The design system fixes the visual language. Everything below is genuinely yours; you can see the running site and this brief cannot.

- Exact component decomposition and file naming
- How the mobile menu animates open (something quiet)
- Whether the hero needs a cover image at all — the design thesis says typography is the hero; test both and pick
- Pagination vs. load-more thresholds
- Whether the resource library needs its own filter UI in phase 1
- Any Tailwind v4 `@theme` structure that keeps the tokens single-sourced
- Anything that makes the reading experience quieter

**One instruction above all:** when in doubt, remove something. The whole design is built on restraint. A page that feels slightly too empty is correct; a page that feels busy is a failure.
