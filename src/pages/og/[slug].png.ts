import fs from 'node:fs';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import type { APIContext } from 'astro';
import { getEntry } from 'astro:content';
import { getPublished } from '../../lib/articles';
import { bnDate } from '../../lib/dates';

/**
 * Typographic OG cards, built at build time — no photograph. This is what
 * WhatsApp shows when someone forwards a link, and WhatsApp is the main
 * channel here, so the title has to be large and legible at thumbnail size.
 *
 * satori cannot read woff2, so this is the static TTF. Only Tiro Bangla is
 * loaded: every string on the card is display-scale, and satori chokes on the
 * variable Noto Serif Bengali file.
 */
const display = fs.readFileSync('src/assets/og-fonts/tiro-bangla-regular.ttf');

const PAPER = '#F7F5EF';
const INK = '#171A18';
const INK_SOFT = '#5D655F';
const RUBRIC = '#8C2B23';
const RULE = '#DDD8CB';

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

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: PAPER,
          padding: '64px 72px',
          fontFamily: 'Tiro Bangla',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column' },
              children: [
                // The matra rule, at poster scale.
                { type: 'div', props: { style: { height: 2, background: INK, marginBottom: 28 } } },
                {
                  type: 'div',
                  props: {
                    style: { fontSize: 26, color: RUBRIC, marginBottom: 28 },
                    children: d.category,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: titleSize,
                      lineHeight: 1.3,
                      color: INK,
                      // Room for descenders; Bengali clips otherwise.
                      paddingBottom: 12,
                    },
                    children: d.title,
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column' },
              children: [
                { type: 'div', props: { style: { height: 1, background: RULE, marginBottom: 24 } } },
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', justifyContent: 'space-between', fontSize: 26, color: INK_SOFT },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex' },
                          children: `${author?.data.name ?? ''} · ${bnDate(d.publishedAt)}`,
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', color: INK },
                          children: 'আর-রিসালাহ',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Tiro Bangla', data: display, weight: 400, style: 'normal' }],
    },
  );

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
