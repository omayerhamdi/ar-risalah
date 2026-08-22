// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { rehypeAyah } from './src/lib/rehype-ayah.mjs';
import { rehypePullQuote } from './src/lib/rehype-pullquote.mjs';
import { rehypeArticleSections } from './src/lib/rehype-article-sections.mjs';

export default defineConfig({
  site: 'https://ar-risalah.pages.dev',
  integrations: [
    mdx(),
    // /search renders results client-side and carries a noindex tag; listing it
    // in the sitemap as well would send crawlers two opposite instructions.
    sitemap({ filter: (page) => !page.includes('/search') }),
  ],
  markdown: {
    // Ayah blocks and pull quotes are authored as plain markdown so writers
    // never touch JSX; these two rewrite them into the design system's markup.
    rehypePlugins: [rehypeAyah, rehypePullQuote, rehypeArticleSections],
  },
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: 'auto' },
  image: { responsiveStyles: true },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
