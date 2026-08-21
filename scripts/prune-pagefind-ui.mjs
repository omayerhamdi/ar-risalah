import fs from 'node:fs';
import path from 'node:path';

/**
 * Pagefind ships three prebuilt UI bundles alongside the search index. This
 * site uses the JS API with its own markup, so none of them are ever loaded —
 * verified by grepping the built HTML. They also carry box-shadows, gradients
 * and 8-12px radii, which contradict the design system if anyone later wires
 * them up by accident. Drop them from the deploy.
 */
const DIR = 'dist/pagefind';
const UNUSED = [
  'pagefind-ui.css', 'pagefind-ui.js',
  'pagefind-modular-ui.css', 'pagefind-modular-ui.js',
  'pagefind-component-ui.css', 'pagefind-component-ui.js',
];

if (!fs.existsSync(DIR)) process.exit(0);

const html = [];
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (p.endsWith('.html')) html.push(fs.readFileSync(p, 'utf8'));
  }
};
walk('dist');

let freed = 0;
for (const name of UNUSED) {
  const file = path.join(DIR, name);
  if (!fs.existsSync(file)) continue;
  // Never delete something a page actually references.
  if (html.some((h) => h.includes(name))) {
    console.log(`prune-pagefind-ui: ${name} is referenced — keeping it`);
    continue;
  }
  freed += fs.statSync(file).size;
  fs.unlinkSync(file);
}

console.log(`prune-pagefind-ui: removed ${(freed / 1024).toFixed(1)}kb of unused Pagefind UI`);
