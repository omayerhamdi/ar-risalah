import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'articles'>;

/** Published articles, newest first. The one place that filters drafts. */
export async function getPublished(): Promise<Article[]> {
  const all = await getCollection('articles', (a) => a.data.status === 'published');
  return all.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

export function byCategory(articles: Article[]) {
  const map = new Map<string, { label: string; articles: Article[] }>();
  for (const a of articles) {
    const slug = a.data.categorySlug;
    if (!map.has(slug)) map.set(slug, { label: a.data.category, articles: [] });
    map.get(slug)!.articles.push(a);
  }
  return map;
}

export function byTopic(articles: Article[]) {
  const map = new Map<string, Article[]>();
  for (const a of articles) {
    for (const t of a.data.topics) {
      if (!map.has(t)) map.set(t, []);
      map.get(t)!.push(a);
    }
  }
  return map;
}
