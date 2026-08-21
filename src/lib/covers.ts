import type { ImageMetadata } from 'astro';

/**
 * Covers are stored as `NN-<slug>.jpg` under src/assets/covers. Matching by
 * slug here means the 14 frontmatter blocks never had to carry a path, and a
 * renamed file fails loudly at build time instead of rendering a broken image.
 */
const files = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/covers/*.jpg',
  { eager: true },
);

const bySlug = new Map<string, ImageMetadata>(
  Object.entries(files).map(([path, mod]) => {
    const name = path.split('/').pop()!.replace(/\.jpg$/, '');
    return [name.replace(/^\d+-/, ''), mod.default];
  }),
);

export function getCover(slug: string): ImageMetadata | undefined {
  return bySlug.get(slug);
}
