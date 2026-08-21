# PROGRESS — আর-রিসালাহ

> **যেকোনো সেশনের প্রথম কাজ: এই ফাইল পড়া।** শেষ কাজ: এই ফাইল আপডেট করে কমিট করা।

**Last updated:** 2026-08-21
**Last session ended at:** Steps 1-3 complete. Content schema validates all 14
articles and 5 authors.
**Next action:** Step 4 — the single article page. This is the most important
page and every component is born here: Ayah, PullQuote, KeyTakeaways,
ResearchLayer, References, TOC, ReadingProgress, ShareRow. Do not move to
Step 5 until mobile is flawless.

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
- [ ] **Step 4 — Single article page.** The most important page. All components born here.
      Do not move on until mobile is flawless.
- [ ] **Step 5 — Header, footer, mobile bar.**
- [ ] **Step 6 — Homepage.**
- [ ] **Step 7 — Archive pages.** articles, categories, topics, authors, research, resources.
- [ ] **Step 8 — Static pages.** about, contact, start-here, for-khateebs, privacy, terms, 404.
- [ ] **Step 9 — Search (Pagefind).** Verify Bengali indexing with যৌতুক, শাশুড়ি, আখলাক.
      Fall back to Fuse.js over `searchKeywords[]` if Pagefind fails on Bengali.
- [ ] **Step 10 — Logo and visual assets.** Logo is hand-built SVG, typographic only.
      **Covers: BLOCKED — waiting on Magnific MCP connection.** Everything else in this
      step can proceed. See "Blocked" below.
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
2. **Content gap:** no article carries `references` or `academicResources`, but
   `docs/07-verification-checklist.md` requires both to be visible on every
   article. The schema declares them optional so they can be added later with no
   migration. The article page will render the sections only when present.
   **This needs the user to write the content — it cannot be invented.**

`src/pages/schema-check.astro` is a temporary gate. Delete it once the real
article page renders (Step 4), along with `/type-test` at Step 12.

## Blocked — needs the user

| # | Item | What the user must do | Blocks |
|---|---|---|---|
| B1 | Magnific MCP not connected | Connect Magnific so `images_generate` is available | Step 10 cover images only |
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
| 2026-08-21 | Step 3 — content schema derived from real frontmatter, validated across all 19 files | — |
| 2026-08-21 | Steps 1–2 — Astro 7 + Tailwind v4 scaffold, self-hosted subsetted fonts inside budget, tokens/base/bangla CSS, Base layout, typography test page verified at 3 widths | — |
