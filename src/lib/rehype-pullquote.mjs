import { visit } from 'unist-util-visit';

/**
 * The pull quote lives in frontmatter, but it belongs in the middle of the
 * reading column — a quote pinned above the article reads as a subtitle, not a
 * pull quote. Insert it after the second <h2> so it lands once the reader is
 * committed, falling back to the midpoint of the document for short pieces.
 */
export function rehypePullQuote() {
  return (tree, file) => {
    const quote = file?.data?.astro?.frontmatter?.pullQuote;
    if (!quote) return;

    const h2s = [];
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'h2' && parent === tree) h2s.push(index);
    });

    const at = h2s.length >= 3 ? h2s[2] : Math.floor(tree.children.length / 2);

    tree.children.splice(at, 0, {
      type: 'element',
      tagName: 'aside',
      properties: { className: ['pull-quote'] },
      children: [
        {
          type: 'element',
          tagName: 'p',
          properties: {},
          children: [{ type: 'text', value: quote }],
        },
      ],
    });
  };
}
