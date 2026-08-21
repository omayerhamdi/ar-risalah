import fs from 'node:fs';
import path from 'node:path';
import { getPublished, type Article } from './articles';

export interface Resource {
  /** The bullet as authored, e.g. "ইমাম গাজালি, *ইহইয়াউ...* — ..." */
  text: string;
  /** Italicised run in the bullet, which is always the work's title. */
  title?: string;
  article: { slug: string; titleShort: string; category: string };
}

const DIR = 'src/content/articles';
const HEADING = '## একাডেমিক রিসোর্স';

/**
 * Academic resources are authored as a bullet list inside each article rather
 * than as a separate collection. Reading them back out at build time gives
 * /resources real content instead of a placeholder, and keeps a single source
 * of truth: the writer edits the article, and the library follows.
 */
export async function getResources(): Promise<Resource[]> {
  const articles = await getPublished();
  const bySlug = new Map<string, Article>(articles.map((a) => [a.data.slug, a]));
  const out: Resource[] = [];

  for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith('.mdx'))) {
    const raw = fs.readFileSync(path.join(DIR, file), 'utf8');
    const start = raw.indexOf(HEADING);
    if (start === -1) continue;

    const after = raw.slice(start + HEADING.length);
    const end = after.indexOf('\n## ');
    const block = end === -1 ? after : after.slice(0, end);

    const slug = raw.match(/^slug: "(.+?)"/m)?.[1];
    const article = slug ? bySlug.get(slug) : undefined;
    if (!article) continue;

    for (const line of block.split('\n')) {
      const m = line.match(/^\s*[-*]\s+(.*\S)\s*$/);
      if (!m) continue;
      out.push({
        text: m[1],
        title: m[1].match(/\*([^*]+)\*/)?.[1],
        article: {
          slug: article.data.slug,
          titleShort: article.data.titleShort,
          category: article.data.category,
        },
      });
    }
  }

  return out;
}
