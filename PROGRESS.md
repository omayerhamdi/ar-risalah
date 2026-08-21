# PROGRESS — আর-রিসালাহ

> **যেকোনো সেশনের প্রথম কাজ: এই ফাইল পড়া।** শেষ কাজ: এই ফাইল আপডেট করে কমিট করা।

**Last updated:** 2026-08-21
**Last session ended at:** Step 0 complete — setup, reorg, repo, resume infrastructure.
**Next action:** Step 1 — Astro 5 + Tailwind v4 scaffold, self-hosted fonts, `tokens.css`.

---

## Build order (docs/06-claude-code-brief.md §3)

- [x] **Step 0 — Setup**
  - [x] Folder reorganised; duplicates trashed, superseded drafts moved to `_archive/`
  - [x] `.claude/settings.json` permission allowlist written
  - [x] `CLAUDE.md`, `DECISIONS.md`, `PROGRESS.md` written
  - [x] git init + first commit + push to `github.com/omayerhamdi/ar-risalah`
  - [x] Auto-resume scheduled task created
- [ ] **Step 1 — Foundation.** Astro + Tailwind v4. All design tokens into `tokens.css`
      from `docs/03-design-system.md`. Self-host fonts: Tiro Bangla, Noto Serif Bengali,
      Anek Bangla, Amiri, Newsreader, Inter. Bengali + Latin subsets, WOFF2,
      `font-display: swap`, preload the two critical faces.
- [ ] **Step 2 — Typography verification.** Separate step; Bengali rendering is the
      biggest risk. Test page must verify: যুক্তাক্ষর (ক্ষ, জ্ঞ, ঙ্গ, ত্র, দ্ধ, ষ্ণ),
      matra unbroken with zero letter-spacing, Arabic RTL with harakat uncut,
      Bengali+Arabic baseline on one line, no overflow at 320px.
      Fallbacks if broken: Hind Siliguri, Baloo Da 2. **Rendering accuracy beats aesthetics.**
- [ ] **Step 3 — Content schema and data.** Zod schema in `config.ts` from
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

## Blocked — needs the user

| # | Item | What the user must do | Blocks |
|---|---|---|---|
| B1 | Magnific MCP not connected | Connect Magnific so `images_generate` is available | Step 10 cover images only |
| B2 | Cloudflare Pages not connected | Connect `omayerhamdi/ar-risalah` in the Cloudflare Pages dashboard | Live deploy only |

Neither blocks the build. Work around them; do not stall.

---

## Session log

| Date | Session did | Stopped because |
|---|---|---|
| 2026-08-21 | Step 0 — read all docs, resolved content-set conflict, reorganised folder, wrote permissions/CLAUDE.md/PROGRESS.md, repo + resume setup | — |
