import type { APIContext } from 'astro';
import { getEntry } from 'astro:content';
import { getPublished } from '../../lib/articles';
import { bnDate } from '../../lib/dates';
import { box, frame, rule, text, toPng, C } from '../../lib/og-card';

/**
 * Typographic OG cards, built at build time — no photograph. This is what
 * WhatsApp shows when someone forwards a link, and WhatsApp is the main
 * channel here, so the title has to be large and legible at thumbnail size.
 */
export async function getStaticPaths() {
  const articles = await getPublished();
  return articles.map((a) => ({ params: { slug: a.data.slug }, props: { article: a } }));
}

export async function GET({ props }: APIContext) {
  const { article } = props as { article: Awaited<ReturnType<typeof getPublished>>[number] };
  const d = article.data;
  const author = await getEntry(d.authors[0]);

  // Long Bengali titles need to shrink or they overflow the card.
  const titleSize = d.title.length > 46 ? 52 : d.title.length > 32 ? 62 : 72;

  return toPng(
    frame([
      box({ flexDirection: 'column' }, [
        rule(2, C.ink, { marginBottom: 28 }),
        text({ fontSize: 26, color: C.rubric, marginBottom: 28 }, d.category),
        // Room for descenders below the baseline; Bengali clips otherwise.
        text({ fontSize: titleSize, lineHeight: 1.3, color: C.ink, paddingBottom: 12 }, d.title),
      ]),

      box({ flexDirection: 'column' }, [
        rule(1, C.rule, { marginBottom: 24 }),
        box({ justifyContent: 'space-between', fontSize: 26, color: C.inkSoft }, [
          text({}, `${author?.data.name ?? ''} · ${bnDate(d.publishedAt)}`),
          text({ color: C.ink }, 'আর-রিসালাহ'),
        ]),
      ]),
    ]),
  );
}
