# আর-রিসালাহ — Claude Code Project Rules

বাংলা ইসলামিক এডিটোরিয়াল ও গবেষণা প্ল্যাটফর্ম। Astro 5 + Tailwind v4 + MDX → Cloudflare Pages.

## Read first, every session
1. `PROGRESS.md` — where the last session stopped. **Always read this before doing anything.**
2. `docs/06-claude-code-brief.md` — the full build brief (folder structure, build order, component specs, budgets).
3. `docs/03-design-system.md` — tokens, type scale, matra-rule, rubric colour rules.
4. `docs/02-information-architecture.md` — Zod schema, sitemap, URL slugs, related-article logic.

## Four non-negotiables (from the brief)
1. **Mobile-first and fast.** Performance budget is not up for discussion.
2. **The design signature — matra-rule and rubric.** This is the site's identity.
3. **No placeholder, lorem ipsum, demo, or sample content anywhere.**
4. **Accessibility floor.** Focus rings, contrast, keyboard nav — never dropped.

## Content source of truth
- Articles: `src/content/articles/` — 14 MDX, migrated from the original `articles/` folder.
- Authors: `src/content/authors/` — 5 profiles, split from `authors/authors.md`.
  Slugs: `omayer-hamdi`, `mawlana-afsaruddin`, `mawlana-ilyas`, `editorial-board`, `research-desk`.
- `_archive/alt-content-draft/` is a superseded parallel draft. **Do not use it.** Do not delete it either.

## Verification cadence (token discipline)
The user pays for every check. Do NOT screenshot after every small edit.
Take mobile (390px) + desktop (1440px) screenshots only at these checkpoints:
- End of a numbered build step in the brief (§3), not mid-step.
- After any change to `tokens.css`, `base.css`, or `bangla.css`.
- After the article page, header/footer, and homepage are each first complete.
Between checkpoints, trust the CSS and keep building. Batch fixes.

## Tooling rules
- Never `rm`. Use `trash`.
- Use `rg` to find code. Never read a whole file to find one function.
- Read partially: `sed -n '100,150p' file`.
- Use `git diff` instead of re-reading edited files.
- Never touch `.env` or any credential.

## Language
Bengali for explanation and discussion with the user. English for code, comments, commit messages, and variable names. Bengali for all user-facing site copy.

## After every meaningful unit of work
Update `PROGRESS.md` and commit. This is what makes the work resumable after a
usage-limit reset or a machine shutdown. A session that ends without updating
`PROGRESS.md` has lost its context.
