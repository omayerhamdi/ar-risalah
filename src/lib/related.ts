import type { CollectionEntry } from 'astro:content';

type Article = CollectionEntry<'articles'>;

/**
 * Related articles, per docs/02-information-architecture.md §6. Priority order:
 *   1. most overlapping topics
 *   2. same subcategory
 *   3. same category, different author
 *   4. the deliberate bridge — an akhlaq piece always surfaces at least one
 *      thought/ideology piece, and the reverse
 *
 * Rule 4 is the editorial point of this function, not a nicety: a reader who
 * came for শাশুড়ি-পুত্রবধূ should be able to walk to ব্যক্তিস্বাতন্ত্র্যবাদ.
 */

const AKHLAQ = 'akhlaq-poribar';
const CHINTA = 'chinta-motobad';

function score(a: Article, b: Article): number {
  const shared = b.data.topics.filter((t) => a.data.topics.includes(t)).length;
  let n = shared * 100;
  if (b.data.subcategory === a.data.subcategory) n += 40;
  if (b.data.categorySlug === a.data.categorySlug) {
    n += 15;
    // A different voice on the same subject is more useful than the same one.
    const sameAuthor = b.data.authors.some((x) =>
      a.data.authors.some((y) => y.id === x.id),
    );
    if (!sameAuthor) n += 10;
  }
  if (b.data.pillar) n += 5;
  return n;
}

export function getRelated(current: Article, all: Article[], limit = 3): Article[] {
  const pool = all
    .filter((a) => a.id !== current.id && a.data.status === 'published')
    .map((a) => ({ article: a, score: score(current, a) }))
    .sort((x, y) =>
      y.score - x.score ||
      y.article.data.publishedAt.getTime() - x.article.data.publishedAt.getTime(),
    );

  const picked = pool.slice(0, limit).map((p) => p.article);

  // Rule 4. If the list came back entirely from the reader's own side of the
  // house, swap the weakest pick for the strongest one from the other side.
  const here = current.data.categorySlug;
  const bridgeTo = here === AKHLAQ ? CHINTA : here === CHINTA ? AKHLAQ : null;
  if (bridgeTo && picked.length && !picked.some((p) => p.data.categorySlug === bridgeTo)) {
    const bridge = pool.find((p) => p.article.data.categorySlug === bridgeTo);
    if (bridge) picked[picked.length - 1] = bridge.article;
  }

  return picked;
}
