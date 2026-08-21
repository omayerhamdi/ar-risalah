# PROGRESS — আর-রিসালাহ

> **যেকোনো সেশনের প্রথম কাজ: এই ফাইল পড়া।** শেষ কাজ: এই ফাইল আপডেট করে কমিট করা।

**Last updated:** 2026-08-21
**Last session ended at:** Steps 1-4 complete, plus all 14 cover images from
Step 10.
**Next action:** Step 5 — Header, Footer, MobileBar. The SkipLink already exists
in `Base.astro`. Then Step 6 homepage, Step 7 archives, Step 8 static pages,
Step 9 search. The logo (rest of Step 10) is still outstanding.

---

## Build order (docs/06-claude-code-brief.md §3)

- [x] **Step 0 — Setup**
  - [x] Folder reorganised; duplicates trashed, superseded drafts moved to `_archive/`
  - [x] `.claude/settings.json` permission allowlist written
  - [x] `CLAUDE.md`, `DECISIONS.md`, `PROGRESS.md` written
  - [x] git init + first commit + push to `github.com/omayerhamdi/ar-risalah`
  - [x] Auto-resume scheduled task created
- [x] **Step 1 — Foundation.** Astro + Tailwind v4. All design tokens into `tokens.css`
      from `docs/03-design-system.md`. Self-host fonts: Tiro Bangla, Noto Serif Bengali,
      Anek Bangla, Amiri, Newsreader, Inter. Bengali + Latin subsets, WOFF2,
      `font-display: swap`, preload the two critical faces.
- [x] **Step 2 — Typography verification.** PASSED — see notes below. Separate step; Bengali rendering is the
      biggest risk. Test page must verify: যুক্তাক্ষর (ক্ষ, জ্ঞ, ঙ্গ, ত্র, দ্ধ, ষ্ণ),
      matra unbroken with zero letter-spacing, Arabic RTL with harakat uncut,
      Bengali+Arabic baseline on one line, no overflow at 320px.
      Fallbacks if broken: Hind Siliguri, Baloo Da 2. **Rendering accuracy beats aesthetics.**
- [x] **Step 3 — Content schema and data.** PASSED — Zod schema in `config.ts` from
      `docs/02-information-architecture.md`. 14 articles + 5 authors in place.
      `astro build` must validate all.
- [x] **Step 4 — Single article page.** PASSED — The most important page. All components born here.
      Do not move on until mobile is flawless.
- [ ] **Step 5 — Header, footer, mobile bar.**
- [ ] **Step 6 — Homepage.**
- [ ] **Step 7 — Archive pages.** articles, categories, topics, authors, research, resources.
- [ ] **Step 8 — Static pages.** about, contact, start-here, for-khateebs, privacy, terms, 404.
- [ ] **Step 9 — Search (Pagefind).** Verify Bengali indexing with যৌতুক, শাশুড়ি, আখলাক.
      Fall back to Fuse.js over `searchKeywords[]` if Pagefind fails on Bengali.
- [~] **Step 10 — Logo and visual assets.** Covers DONE (see below). **Logo still to do:**
      hand-built SVG, typographic only, three options to compare, plus favicon.
- [ ] **Step 11 — SEO, RSS, sitemap, OG images.** OG images are typographic, build-time.
- [ ] **Step 12 — Final audit.** Full checklist in `docs/07-verification-checklist.md`
      and brief §10. Lighthouse results recorded in `DECISIONS.md`.

---

## Step 3 verification result (2026-08-21)

`src/content.config.ts` loads 14 articles + 5 authors with zero Zod errors.
14 published, 10 pillar pieces, 4 categories, 47 distinct topics, 165 minutes
of reading. Every `authors:` reference resolves to a real author file.

Two notes carried forward:

1. The brief points at `docs/02-information-architecture.md` for the Zod schema,
   but that document never contains one. The schema was derived from the
   frontmatter as actually authored.
2. ~~Content gap: no article carries references or academicResources.~~
   **Corrected at Step 4.** They are not missing — every one of the 14 articles
   ends with three authored h2 sections: দলিল ও রেফারেন্স, একাডেমিক রিসোর্স,
   গবেষণার দিক. They live in the MDX body rather than frontmatter, and
   `rehype-article-sections.mjs` now rewrites them into the design system's
   markup. Nothing needs writing. The frontmatter fields stay optional for
   articles that may want structured data later.

`src/pages/schema-check.astro` was deleted at the end of Step 4. `/type-test`
still needs deleting at Step 12.

## Step 4 verification result (2026-08-21)

The article page renders all 14 articles. Measured on `/articles/jobaner-hifazat`:

- 4 ayah figures, 1 pull quote, 1 research-layer `<details>`, 2 apparatus
  sections — all produced from plain markdown by the three rehype plugins,
  so writers never touch JSX.
- TOC lists 7 argument sections; the three apparatus headings are filtered out.
- Heading order H1 → H2 → H3 with no jumps. Every image has alt text.
  `<html lang="bn">`, 4 elements tagged `lang="ar"`.
- No horizontal overflow at 390px. Desktop reading column measures exactly
  608px (38rem) with the rail sticky beside it.
- Article JSON-LD and BreadcrumbList present, canonical URL correct.
- **JS budget: 4.29kb** against a 25kb ceiling (1.86kb inline + 2.43kb Astro
  prefetch). CSS 14.8kb.

One real bug found and fixed: the skip link was `position: absolute`, so once
the reader had scrolled it stayed off-screen even when focused. Now `fixed` —
verified by pressing Tab at scrollY 2500 and confirming it lands on screen at
top: 16px. Focus ring is `solid 2px #1E5F8C` at 2px offset.

## Cover images (2026-08-22)

All 14 generated with Magnific from the prompts already in each article's
frontmatter, with the brief's unity clause appended. Three were made and
compared first, as the brief instructs, before the other eleven.

Three were regenerated after review:
- #2 (যৌতুক) came back with the balance scale level, which reads as justice —
  the opposite of the article's point. Redone clearly tipped.
- #4 and #6 came back as a sheet of paper photographed on white with a drop
  shadow, while the other twelve are full-bleed textures. They would have
  broken the card grid. Redone as full-bleed macros.

Treatment: `saturate(0.72) contrast(0.96)` plus a `#F7F5EF` soft-light wash at
28% opacity, per the design system. This is what makes covers from different
prompts read as one family — verified on a 14-up contact sheet.

Budget: sources capped at 1216px (2x the 608px reading column). AVIF quality 40,
chosen by comparing 1:1 crops against the source — the weave and stitching in
the noisiest cover survive intact. Largest variant anywhere is 54.4kb against a
70kb target. A 390px phone downloads 14.6kb of images for a whole article page.

## Blocked — needs the user

| # | Item | What the user must do | Blocks |
|---|---|---|---|
| ~~B1~~ | ~~Magnific MCP not connected~~ | **Cleared 2026-08-21** — Magnific is connected; `images_generate` is available | — |
| B2 | Cloudflare Pages not connected | Connect `omayerhamdi/ar-risalah` in the Cloudflare Pages dashboard | Live deploy only |

Neither blocks the build. Work around them; do not stall.

---

## Step 2 verification result (2026-08-21)

Checked in the browser at 320px, 390px and 1440px:

- Conjuncts ক্ষ জ্ঞ ঙ্গ ত্র দ্ধ ষ্ণ হ্ম ন্ত্র স্ত্র ক্ত ঞ্চ দ্ভ — all render as single
  shapes. No fallback needed; Tiro Bangla and Noto Serif Bengali both shape correctly.
- Matra unbroken. `letter-spacing: normal` is pinned on `:lang(bn)`.
- Arabic RTL correct in Amiri; harakat fully visible, not clipped.
- Bengali and Arabic on one line share a baseline correctly.
- No horizontal scroll at 320px with the longest compounds
  (ব্যক্তিস্বাতন্ত্র্যবাদ, প্রাতিষ্ঠানিকীকরণ) — verified by measuring scrollWidth,
  and no element extends past the viewport.
- ﷺ (U+FDFA) initially fell back to a system font; the Amiri subset was rebuilt to
  include it and the fix was verified by loading the file's bytes directly
  (105.5px from Amiri vs 123.4px from the system fallback).

Fonts shipped: `tiro-bangla-400` 48.2kb, `noto-serif-bengali-400` 52.8kb,
`amiri-400` 75.0kb. Article page 175.9kb, other pages 101kb. Budget 180kb.

The test page lives at `/type-test`. It is not linked from anywhere.
**Delete it before launch** (Step 12).

## Session log

| Date | Session did | Stopped because |
|---|---|---|
| 2026-08-21 | Step 0 — read all docs, resolved content-set conflict, reorganised folder, wrote permissions/CLAUDE.md/PROGRESS.md, repo + resume setup | — |
| 2026-08-22 | Step 10 (covers) — 14 covers generated, 3 regenerated after review, wired in with astro:assets and the design system's wash | — |
| 2026-08-21 | Step 4 — article page, 8 components, 3 rehype plugins, verified at 390/1440px; fixed skip-link positioning | — |
| 2026-08-21 | Step 3 — content schema derived from real frontmatter, validated across all 19 files | — |
| 2026-08-21 | Steps 1–2 — Astro 7 + Tailwind v4 scaffold, self-hosted subsetted fonts inside budget, tokens/base/bangla CSS, Base layout, typography test page verified at 3 widths | — |
