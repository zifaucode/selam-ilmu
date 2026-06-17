import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articleSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  summary: z.string(),
  author: z.string().default('Admin'),
  createdAt: z.coerce.date().optional(),
  image: z.string().optional(),
  related: z.array(z.string()).default([]),
  sub_category: z.string().optional(),
});

const civilizations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/civilizations' }),
  schema: articleSchema,
});

const spirituality = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/spirituality' }),
  schema: articleSchema,
});

const theology = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/theology' }),
  schema: articleSchema,
});

const cultures = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cultures' }),
  schema: articleSchema,
});

const literatures = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/literatures' }),
  schema: articleSchema,
});

const philosophy = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/philosophy' }),
  schema: articleSchema,
});

const figures = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/figures' }),
  schema: articleSchema,
});


const glossary = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/glossary' }),
  schema: articleSchema,
});

export const collections = {
  civilizations,
  spirituality,
  theology,
  cultures,
  literatures,
  philosophy,
  figures,
  glossary,
};
