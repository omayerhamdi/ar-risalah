import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * The brief points at 02-information-architecture.md for this schema, but that
 * doc never actually carries one. These shapes are derived from the frontmatter
 * of the 14 articles and 5 author files as authored — see DECISIONS.md.
 *
 * Fields the content does not use yet (references, academicResources,
 * searchKeywords) are declared optional so they can be filled in later without
 * a schema migration. The verification checklist expects references and
 * academicResources on every article; that is a content gap, tracked in
 * PROGRESS.md, not a build gap.
 */

const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.mdx' }),
  schema: z.object({
    title: z.string(),
    /** Used in cards, breadcrumbs and the TOC where the full title is too long. */
    titleShort: z.string(),
    slug: z.string(),

    category: z.string(),
    categorySlug: z.string(),
    subcategory: z.string(),
    topics: z.array(z.string()).min(1),

    excerpt: z.string(),
    authors: z.array(reference('authors')).min(1),

    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    /** Minutes. Bengali reads slower than Latin — count at ~180 wpm, not 238. */
    readingTime: z.number().int().positive(),

    featured: z.boolean().default(false),
    /** A cornerstone piece for its pillar; surfaced above ordinary articles. */
    pillar: z.boolean().default(false),

    cover: z.object({
      alt: z.string(),
      /** The generation prompt, kept with the article so covers stay reproducible. */
      prompt: z.string().optional(),
      src: z.string().optional(),
    }),

    keyTakeaways: z.array(z.string()).min(3).max(5),
    pullQuote: z.string(),

    hasResearch: z.boolean().default(false),
    hasKhutbahResource: z.boolean().default(false),

    references: z
      .array(
        z.object({
          text: z.string(),
          url: z.string().url().optional(),
        }),
      )
      .optional(),

    academicResources: z
      .array(
        z.object({
          title: z.string(),
          author: z.string().optional(),
          language: z.enum(['bn', 'ar', 'en', 'ur']).optional(),
          note: z.string().optional(),
          url: z.string().url().optional(),
        }),
      )
      .optional(),

    /** Fallback search terms for Pagefind; Bengali has no stemming support. */
    searchKeywords: z.array(z.string()).optional(),

    status: z.enum(['draft', 'review', 'published']).default('draft'),
  }),
});

const authors = defineCollection({
  loader: glob({ base: './src/content/authors', pattern: '**/*.md' }),
  schema: z.object({
    name: z.string(),
    nameArabic: z.string(),
    slug: z.string(),
    role: z.string(),
    shortBio: z.string(),
    areasOfInterest: z.array(z.string()).min(1),
    /** Editorial board and research desk publish under a collective name. */
    isCollective: z.boolean().default(false),
    order: z.number().int(),
  }),
});

export const collections = { articles, authors };

/**
 * A `glossary` collection is deliberately NOT defined yet. Astro warns on every
 * build when a glob collection matches no files, and the brief requires builds
 * to pass without warnings. To add it, create the first term at
 * src/content/glossary/<slug>.md with:
 *
 *   term, termArabic (optional), slug, shortDefinition, seeAlso (optional)
 *
 * then define the collection here and switch /glossary over to getCollection.
 * The terms themselves are editorial work — defining মাকাসিদ or তাযকিয়া belongs
 * to the editors, not to the build.
 */
