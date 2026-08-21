import { visit } from 'unist-util-visit';

const textOf = (node) =>
  node.type === 'text' ? node.value : (node.children ?? []).map(textOf).join('');

/** The apparatus every article ends with, authored as plain h2 sections. */
const REFERENCES = 'দলিল ও রেফারেন্স';
const ACADEMIC = 'একাডেমিক রিসোর্স';
const RESEARCH = 'গবেষণার দিক';

/** Headings that are apparatus rather than argument — kept out of the TOC. */
export const APPARATUS_HEADINGS = [REFERENCES, ACADEMIC, RESEARCH];

/**
 * All 14 articles close with the same three sections. Rather than ask writers
 * to wrap them in JSX, recognise them here and give each the markup the design
 * system asks for: rubric-numbered references, a resource list, and the
 * research layer as a <details> that costs no JavaScript.
 */
export function rehypeArticleSections() {
  return (tree) => {
    const marks = [];
    tree.children.forEach((node, i) => {
      if (node.type !== 'element' || node.tagName !== 'h2') return;
      const label = textOf(node).trim();
      if (APPARATUS_HEADINGS.includes(label)) marks.push({ label, index: i });
    });
    if (!marks.length) return;

    // Walk backwards so splicing never shifts an index we still need.
    for (let m = marks.length - 1; m >= 0; m--) {
      const { label, index } = marks[m];
      const end =
        m + 1 < marks.length ? marks[m + 1].index : tree.children.length;
      const heading = tree.children[index];
      const content = tree.children.slice(index + 1, end);

      let replacement;
      if (label === RESEARCH) {
        replacement = {
          type: 'element',
          tagName: 'details',
          properties: { className: ['research-layer'] },
          children: [
            {
              type: 'element',
              tagName: 'summary',
              properties: {},
              children: [
                {
                  type: 'element',
                  tagName: 'span',
                  properties: { className: ['label'] },
                  children: [{ type: 'text', value: 'গবেষণা স্তর: গভীরে যেতে চাইলে' }],
                },
                {
                  type: 'element',
                  tagName: 'span',
                  properties: { className: ['est'] },
                  children: [{ type: 'text', value: 'উন্মুক্ত গবেষণার প্রশ্ন' }],
                },
              ],
            },
            {
              type: 'element',
              tagName: 'div',
              properties: { className: ['body'] },
              children: content,
            },
          ],
        };
      } else {
        replacement = {
          type: 'element',
          tagName: 'section',
          properties: {
            className: ['apparatus', label === REFERENCES ? 'refs' : 'academic'],
          },
          children: [heading, ...content],
        };
      }

      tree.children.splice(index, end - index, replacement);
    }
  };
}
