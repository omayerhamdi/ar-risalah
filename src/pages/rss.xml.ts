import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getEntry } from 'astro:content';
import { getPublished } from '../lib/articles';
import { SITE } from '../lib/nav';

export async function GET(context: APIContext) {
  const articles = await getPublished();

  const items = await Promise.all(
    articles.map(async (a) => {
      const author = await getEntry(a.data.authors[0]);
      return {
        title: a.data.title,
        // Excerpt and link only — never the full text. The brief is explicit,
        // and a full-text feed removes any reason to visit the article.
        description: a.data.excerpt,
        pubDate: a.data.publishedAt,
        link: `/articles/${a.data.slug}/`,
        categories: [a.data.category, ...a.data.topics],
        author: author?.data.name,
      };
    }),
  );

  return rss({
    title: SITE.name,
    description: 'দলিল, গবেষণা ও বাস্তবতার আলোকে দ্বীন ও সমকালের পাঠ। আখলাক থেকে মতবাদ পর্যন্ত।',
    site: context.site!,
    items,
    customData: '<language>bn</language>',
  });
}
