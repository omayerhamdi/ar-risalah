import { visit } from 'unist-util-visit';

const ARABIC = /[؀-ۿﭐ-﷿ﹰ-﻿]/;

const textOf = (node) =>
  node.type === 'text'
    ? node.value
    : (node.children ?? []).map(textOf).join('');

/**
 * Ayah and hadith are authored as plain markdown blockquotes:
 *
 *   > <arabic>
 *   >
 *   > "<bengali translation>"
 *   >
 *   > — <source>
 *
 * Writers should not have to hand-write JSX or remember lang attributes, so the
 * structure is recognised here and rewritten into the <figure class="ayah">
 * the design system specifies. A blockquote with no Arabic in it is left alone
 * and styled as an ordinary quote.
 */
export function rehypeAyah() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'blockquote' || !parent) return;

      const paras = (node.children ?? []).filter(
        (c) => c.type === 'element' && c.tagName === 'p',
      );
      if (!paras.length || !ARABIC.test(textOf(paras[0]))) return;

      const [arabic, ...rest] = paras;
      arabic.properties = {
        ...arabic.properties,
        lang: 'ar',
        dir: 'rtl',
        className: ['arabic'],
      };

      // A trailing line opened with an em dash is the attribution.
      const last = rest[rest.length - 1];
      const hasSource = last && /^\s*[—–-]/.test(textOf(last));
      const body = hasSource ? rest.slice(0, -1) : rest;

      for (const p of body) {
        p.properties = { ...p.properties, className: ['translation'] };
      }

      const children = [arabic, ...body];
      if (hasSource) {
        children.push({
          type: 'element',
          tagName: 'figcaption',
          properties: {},
          children: last.children,
        });
      }

      parent.children[index] = {
        type: 'element',
        tagName: 'figure',
        properties: { className: ['ayah'] },
        children,
      };
    });
  };
}
