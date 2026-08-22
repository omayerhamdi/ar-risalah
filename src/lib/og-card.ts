import fs from 'node:fs';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

/**
 * Shared plumbing for the build-time OG cards. Both the per-article card and
 * the site-wide card draw the same furniture — paper ground, matra rule, rubric
 * eyebrow — so the shapes live here and the routes only supply content.
 *
 * satori cannot read woff2, so this is the static TTF. Only Tiro Bangla is
 * loaded: every string on a card is display-scale, and satori chokes on the
 * variable Noto Serif Bengali file.
 */
const display = fs.readFileSync('src/assets/og-fonts/tiro-bangla-regular.ttf');

export const CARD = { W: 1200, H: 630 } as const;

export const C = {
  paper: '#F7F5EF',
  ink: '#171A18',
  inkSoft: '#5D655F',
  rubric: '#8C2B23',
  rule: '#DDD8CB',
} as const;

type Style = Record<string, unknown>;
export type Node = { type: string; props: Record<string, unknown> };

/**
 * satori needs an explicit `display` on anything holding more than one child,
 * so flex is the default here rather than something to remember at each call.
 */
export const box = (style: Style, children: Node[]): Node => ({
  type: 'div',
  props: { style: { display: 'flex', ...style }, children },
});

export const text = (style: Style, children: string): Node => ({
  type: 'div',
  props: { style: { display: 'flex', ...style }, children },
});

/** A horizontal rule. `weight` 2 is the matra; 1 is an ordinary divider. */
export const rule = (weight: 1 | 2, colour: string, style: Style = {}): Node => ({
  type: 'div',
  props: { style: { display: 'flex', height: weight, background: colour, ...style } },
});

/** The outer frame every card shares: paper ground, one padded column. */
export const frame = (children: Node[]): Node =>
  box(
    {
      width: CARD.W,
      height: CARD.H,
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: C.paper,
      padding: '64px 72px',
      fontFamily: 'Tiro Bangla',
    },
    children,
  );

/** Renders a satori tree to a PNG response. */
export async function toPng(tree: Node): Promise<Response> {
  const svg = await satori(tree as Parameters<typeof satori>[0], {
    width: CARD.W,
    height: CARD.H,
    fonts: [{ name: 'Tiro Bangla', data: display, weight: 400, style: 'normal' }],
  });

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: CARD.W } }).render().asPng();

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
